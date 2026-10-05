/**
 * Express Backend Entry Point for OnThiTuDo
 * Provides full REST API with MongoDB persistence and mounts Vite middlewares in development.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { initDatabaseConnection, getDatabaseStatus, db } from './server/database.js';
import { seedOfficialCurriculumIfEmpty } from './server/seedOfficialData.js';
import { parseDocxBufferToText, parseExamText } from './server/wordParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Database connection and seed official curriculum
await initDatabaseConnection();
await seedOfficialCurriculumIfEmpty();

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

// Health & System Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/database/status', (req: Request, res: Response) => {
  res.json(getDatabaseStatus());
});

app.post('/api/database/reset', async (req: Request, res: Response) => {
  try {
    await db.userProfiles.clear();
    await db.roadmaps.clear();
    await db.examAttempts.clear();
    await db.writingSubmissions.clear();
    await db.bookmarks.clear();
    await db.studyNotes.clear();
    await db.curriculums.clear();
    await seedOfficialCurriculumIfEmpty();
    res.json({ success: true, message: 'Database reset to clean official syllabus state. Zero mock user data.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// AUTHENTICATION ROUTES (Register & Login)
// -----------------------------------------------------------------------------
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, candidateType, examYear } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Email, Mật khẩu và Họ tên.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await db.users.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được đăng ký trên hệ thống.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = await db.users.insertOne({
      email: cleanEmail,
      passwordHash,
      fullName: fullName.trim(),
      candidateType: candidateType || 'THI_SINH_TU_DO',
      examYear: examYear || 2027,
      role: cleanEmail.includes('admin') ? 'ADMIN' : 'CANDIDATE',
      token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also create initial user profile linked to this user
    const profile = await db.userProfiles.insertOne({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      candidateType: newUser.candidateType,
      examYear: newUser.examYear,
      curriculumCode: 'GDPT2018',
      enrolledSubjects: ['van', 'su', 'dia'],
      targetScores: { van: 7.0, su: 7.0, dia: 7.0 },
      currentEstimatedScores: { van: 0, su: 0, dia: 0 },
      dailyStudyTimeMinutes: 60,
      streakDays: 0,
      totalStudyMinutes: 0,
      hasCompletedOnboarding: false,
      hasCompletedDiagnostic: false,
      weakTopics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.json({
      token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        candidateType: newUser.candidateType,
        examYear: newUser.examYear,
        role: newUser.role,
      },
      profile,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập Email và Mật khẩu.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await db.users.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await db.users.updateById(user._id, { token, updatedAt: new Date().toISOString() });

    let profile = await db.userProfiles.findById(user._id);
    if (!profile) {
      profile = await db.userProfiles.insertOne({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        candidateType: user.candidateType,
        examYear: user.examYear,
        curriculumCode: 'GDPT2018',
        enrolledSubjects: ['van', 'su', 'dia'],
        targetScores: { van: 7.0, su: 7.0, dia: 7.0 },
        currentEstimatedScores: { van: 0, su: 0, dia: 0 },
        dailyStudyTimeMinutes: 60,
        streakDays: 0,
        totalStudyMinutes: 0,
        hasCompletedOnboarding: false,
        hasCompletedDiagnostic: false,
        weakTopics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        candidateType: user.candidateType,
        examYear: user.examYear,
        role: user.role,
      },
      profile,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.json(null);

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.json(null);

    const user = await db.users.findOne({ token });
    if (!user) return res.json(null);

    const profile = await db.userProfiles.findById(user._id);

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        candidateType: user.candidateType,
        examYear: user.examYear,
        role: user.role,
      },
      profile,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const user = await db.users.findOne({ token });
      if (user) {
        await db.users.updateById(user._id, { token: '' });
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// WORD / DOCX EXAM IMPORT ROUTES
// -----------------------------------------------------------------------------
app.post('/api/questions/import-word', async (req: Request, res: Response) => {
  try {
    const { rawText, fileBase64, fileName } = req.body;
    let textToParse = rawText || '';

    if (fileBase64) {
      // Decode base64 buffer and extract text via mammoth
      const buffer = Buffer.from(fileBase64, 'base64');
      textToParse = await parseDocxBufferToText(buffer);
    }

    if (!textToParse || !textToParse.trim()) {
      return res.status(400).json({ error: 'Không tìm thấy nội dung văn bản trong file để trích xuất câu hỏi.' });
    }

    const parsedQuestions = parseExamText(textToParse);
    res.json({
      fileName: fileName || 'Tài liệu đề thi',
      totalCount: parsedQuestions.length,
      questions: parsedQuestions,
      rawExtractedLength: textToParse.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: `Lỗi xử lý file Word: ${err.message}` });
  }
});

app.post('/api/questions/batch-insert', async (req: Request, res: Response) => {
  try {
    const { subjectId, topicId, curriculumVersionYear, sourceType, questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Danh sách câu hỏi rỗng.' });
    }

    const formattedQuestions = questions.map((q: any) => ({
      _id: q._id || crypto.randomBytes(12).toString('hex'),
      subjectId: subjectId || q.subjectId || 'van',
      curriculumVersionYear: curriculumVersionYear || 2027,
      topicId: topicId || q.topicId || 'top_van_01',
      knowledgeUnitId: q.knowledgeUnitId || 'ku_van_01',
      competency: q.competency || 'RECOGNITION',
      questionType: q.questionType || 'SINGLE_CHOICE',
      difficulty: q.difficulty || 'NHAN_BIET',
      content: q.content,
      options: q.options,
      correctAnswer: q.correctAnswer,
      trueFalseStatements: q.trueFalseStatements,
      explanation: q.explanation || 'Hướng dẫn giải chi tiết theo đề thi.',
      relatedKnowledgeUnitTitle: q.relatedKnowledgeUnitTitle || 'Chuyên đề tự học',
      sourceType: sourceType || 'PRACTICE',
      sourceCitation: q.sourceCitation || 'Trích xuất từ file Word đề thi',
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    await db.questions.insertMany(formattedQuestions);
    res.json({ success: true, count: formattedQuestions.length, inserted: formattedQuestions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// User Profile (Linked to Authenticated User & MongoDB)
app.get('/api/user/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const user = await db.users.findOne({ token });
      if (user) {
        let profile = await db.userProfiles.findById(user._id);
        if (!profile) {
          profile = await db.userProfiles.insertOne({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            candidateType: user.candidateType,
            examYear: user.examYear,
            curriculumCode: 'GDPT2018',
            enrolledSubjects: ['van', 'su', 'dia'],
            targetScores: { van: 7.0, su: 7.0, dia: 7.0 },
            currentEstimatedScores: { van: 0, su: 0, dia: 0 },
            dailyStudyTimeMinutes: 60,
            streakDays: 0,
            totalStudyMinutes: 0,
            hasCompletedOnboarding: false,
            hasCompletedDiagnostic: false,
            weakTopics: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        return res.json(profile);
      }
    }

    const profiles = await db.userProfiles.find();
    if (profiles.length > 0) {
      res.json(profiles[0]);
    } else {
      res.json(null);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/profile', async (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    const authHeader = req.headers.authorization;
    let targetUserId = profileData._id;

    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const user = await db.users.findOne({ token });
      if (user) {
        targetUserId = user._id;
      }
    }

    if (targetUserId) {
      const existing = await db.userProfiles.findById(targetUserId);
      let saved;
      if (existing) {
        saved = await db.userProfiles.updateById(targetUserId, {
          ...profileData,
          _id: targetUserId,
          updatedAt: new Date().toISOString(),
        });
      } else {
        saved = await db.userProfiles.insertOne({
          ...profileData,
          _id: targetUserId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return res.json(saved);
    }

    const existingList = await db.userProfiles.find();
    let saved;
    if (existingList.length > 0) {
      saved = await db.userProfiles.updateById(existingList[0]._id, {
        ...profileData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      saved = await db.userProfiles.insertOne({
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Roadmaps
app.get('/api/roadmaps/:userId', async (req: Request, res: Response) => {
  try {
    const roadmap = await db.roadmaps.findOne({ userId: req.params.userId });
    res.json(roadmap);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roadmaps', async (req: Request, res: Response) => {
  try {
    const roadmapData = req.body;
    const existing = await db.roadmaps.findOne({ userId: roadmapData.userId });
    let saved;
    if (existing) {
      saved = await db.roadmaps.updateById(existing._id, {
        ...roadmapData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      saved = await db.roadmaps.insertOne({
        ...roadmapData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Subjects
app.get('/api/subjects', async (req: Request, res: Response) => {
  try {
    const subjects = await db.subjects.find();
    res.json(subjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Topics
app.get('/api/topics', async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.query;
    const filter = subjectId ? { subjectId: String(subjectId) } : {};
    const topics = await db.topics.find(filter as any);
    res.json(topics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/topics', async (req: Request, res: Response) => {
  try {
    const saved = await db.topics.insertOne({
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/topics/:id', async (req: Request, res: Response) => {
  try {
    await db.topics.deleteById(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Knowledge Units
app.get('/api/knowledge-units', async (req: Request, res: Response) => {
  try {
    const { subjectId, topicId } = req.query;
    const filter: any = {};
    if (subjectId) filter.subjectId = String(subjectId);
    if (topicId) filter.topicId = String(topicId);
    const units = await db.knowledgeUnits.find(filter);
    res.json(units);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Lessons
app.get('/api/lessons', async (req: Request, res: Response) => {
  try {
    const { subjectId, topicId } = req.query;
    const filter: any = {};
    if (subjectId) filter.subjectId = String(subjectId);
    if (topicId) filter.topicId = String(topicId);
    const lessons = await db.lessons.find(filter);
    res.json(lessons);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lessons/:id', async (req: Request, res: Response) => {
  try {
    const lesson = await db.lessons.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lessons', async (req: Request, res: Response) => {
  try {
    const saved = await db.lessons.insertOne({
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Questions
app.get('/api/questions', async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.query;
    const filter = subjectId ? { subjectId: String(subjectId) } : {};
    const questions = await db.questions.find(filter as any);
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/questions', async (req: Request, res: Response) => {
  try {
    const qData = req.body;
    let saved;
    if (qData._id) {
      saved = await db.questions.updateById(qData._id, {
        ...qData,
        updatedAt: new Date().toISOString(),
      });
      if (!saved) {
        saved = await db.questions.insertOne({
          ...qData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      saved = await db.questions.insertOne({
        ...qData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/questions/:id', async (req: Request, res: Response) => {
  try {
    await db.questions.deleteById(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Exams
app.get('/api/mock-exams', async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.query;
    const filter = subjectId ? { subjectId: String(subjectId) } : {};
    const exams = await db.mockExams.find(filter as any);
    res.json(exams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// History Timeline Events
app.get('/api/history-events', async (req: Request, res: Response) => {
  try {
    const events = await db.historyEvents.find();
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Geo Datasets
app.get('/api/geo-datasets', async (req: Request, res: Response) => {
  try {
    const datasets = await db.geoDatasets.find();
    res.json(datasets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Exam Attempts (Real user quiz / test results)
app.get('/api/exam-attempts/:userId', async (req: Request, res: Response) => {
  try {
    const attempts = await db.examAttempts.find({ userId: req.params.userId });
    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exam-attempts', async (req: Request, res: Response) => {
  try {
    const saved = await db.examAttempts.insertOne({
      ...req.body,
      submittedAt: new Date().toISOString(),
    });

    // Update real user profile based on this attempt
    const profile = await db.userProfiles.findOne({ _id: req.body.userId });
    if (profile) {
      const subjectId = req.body.subjectId;
      const currentScores = { ...(profile.currentEstimatedScores || {}) };
      const score = Math.min(10, Math.max(1, req.body.score));
      currentScores[subjectId] = currentScores[subjectId]
        ? Number(((currentScores[subjectId] * 0.6) + (score * 0.4)).toFixed(1))
        : score;

      const studyTime = (profile.totalStudyMinutes || 0) + Math.ceil((req.body.timeSpentSeconds || 60) / 60);

      await db.userProfiles.updateById(profile._id, {
        currentEstimatedScores: currentScores,
        totalStudyMinutes: studyTime,
        updatedAt: new Date().toISOString(),
      });
    }

    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Writing Submissions
app.get('/api/writing-submissions/:userId', async (req: Request, res: Response) => {
  try {
    const submissions = await db.writingSubmissions.find({ userId: req.params.userId });
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/writing-submissions', async (req: Request, res: Response) => {
  try {
    const saved = await db.writingSubmissions.insertOne({
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Bookmarks
app.get('/api/bookmarks/:userId', async (req: Request, res: Response) => {
  try {
    const bookmarks = await db.bookmarks.find({ userId: req.params.userId });
    res.json(bookmarks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookmarks', async (req: Request, res: Response) => {
  try {
    const { userId, targetId, itemType, subjectId, title, subtitle } = req.body;
    const existing = await db.bookmarks.findOne({ userId, targetId });
    if (existing) {
      await db.bookmarks.deleteById(existing._id);
      return res.json({ saved: false });
    }
    const created = await db.bookmarks.insertOne({
      userId,
      targetId,
      itemType,
      subjectId,
      title,
      subtitle,
      createdAt: new Date().toISOString(),
    });
    res.json({ saved: true, data: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Study Notes
app.get('/api/notes/:userId', async (req: Request, res: Response) => {
  try {
    const notes = await db.studyNotes.find({ userId: req.params.userId });
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req: Request, res: Response) => {
  try {
    const noteData = req.body;
    let saved;
    if (noteData._id) {
      saved = await db.studyNotes.updateById(noteData._id, {
        ...noteData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      saved = await db.studyNotes.insertOne({
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:id', async (req: Request, res: Response) => {
  try {
    await db.studyNotes.deleteById(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Curriculums, Versions, Exam Specifications
app.get('/api/curriculums', async (req: Request, res: Response) => {
  try {
    const items = await db.curriculums.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/curriculum-versions', async (req: Request, res: Response) => {
  try {
    const items = await db.curriculumVersions.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/curriculum-versions', async (req: Request, res: Response) => {
  try {
    const saved = await db.curriculumVersions.insertOne({
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/exam-specifications', async (req: Request, res: Response) => {
  try {
    const items = await db.examSpecifications.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// FRONTEND SERVING & VITE MIDDLEWARE
// -----------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Server] OnThiTuDo full-stack server running on http://0.0.0.0:${PORT}`);
});
