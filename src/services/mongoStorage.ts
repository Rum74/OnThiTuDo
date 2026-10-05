/**
 * MongoDB-Compatible Local Document Storage Service
 * Simulates MongoDB collections with document schemas, persistent store, and CRUD operations.
 */

import {
  CurriculumDoc,
  CurriculumVersionDoc,
  ExamSpecificationDoc,
  SubjectDoc,
  TopicDoc,
  KnowledgeUnitDoc,
  LessonDoc,
  QuestionDoc,
  MockExamDoc,
  UserProfileDoc,
  RoadmapDoc,
  BookmarkDoc,
  StudyNoteDoc,
  ExamAttemptDoc,
  WritingSubmissionDoc,
  SubjectId,
} from '../types/database';
import {
  SEED_CURRICULUM,
  SEED_CURRICULUM_VERSIONS,
  SEED_EXAM_SPECIFICATIONS,
  SEED_SUBJECTS,
  SEED_TOPICS,
  SEED_KNOWLEDGE_UNITS,
  SEED_LESSONS,
  SEED_QUESTIONS,
  SEED_MOCK_EXAMS,
  DEFAULT_USER_PROFILE,
  SEED_ROADMAP,
} from '../data/seedData';
import { ApiService } from './api';

const STORAGE_KEYS = {
  CURRICULUMS: 'mongodb_curriculums',
  CURRICULUM_VERSIONS: 'mongodb_curriculum_versions',
  EXAM_SPECS: 'mongodb_exam_specifications',
  SUBJECTS: 'mongodb_subjects',
  TOPICS: 'mongodb_topics',
  KNOWLEDGE_UNITS: 'mongodb_knowledge_units',
  LESSONS: 'mongodb_lessons',
  QUESTIONS: 'mongodb_questions',
  MOCK_EXAMS: 'mongodb_mock_exams',
  USER_PROFILE: 'mongodb_user_profile',
  ROADMAPS: 'mongodb_roadmaps',
  BOOKMARKS: 'mongodb_bookmarks',
  STUDY_NOTES: 'mongodb_study_notes',
  EXAM_ATTEMPTS: 'mongodb_exam_attempts',
  WRITING_SUBMISSIONS: 'mongodb_writing_submissions',
  DARK_MODE: 'onthitudo_dark_mode',
};

function getCollection<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    // If upgraded default syllabus has more items, automatically synchronize cache
    if (Array.isArray(parsed) && parsed.length < defaultData.length) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return parsed;
  } catch (err) {
    console.error(`Failed to read collection ${key}:`, err);
    return defaultData;
  }
}

function saveCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to write collection ${key}:`, err);
  }
}

// Generate MongoDB-style ObjectId string
export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const machineAndPid = Math.floor(Math.random() * 0xffffffffff)
    .toString(16)
    .padStart(10, '0');
  const counter = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return timestamp + machineAndPid + counter;
}

export const MongoService = {
  // Reset all to clean seeds
  resetDatabase() {
    localStorage.setItem(STORAGE_KEYS.CURRICULUMS, JSON.stringify([SEED_CURRICULUM]));
    localStorage.setItem(STORAGE_KEYS.CURRICULUM_VERSIONS, JSON.stringify(SEED_CURRICULUM_VERSIONS));
    localStorage.setItem(STORAGE_KEYS.EXAM_SPECS, JSON.stringify(SEED_EXAM_SPECIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(SEED_TOPICS));
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_UNITS, JSON.stringify(SEED_KNOWLEDGE_UNITS));
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(SEED_LESSONS));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SEED_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.MOCK_EXAMS, JSON.stringify(SEED_MOCK_EXAMS));
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify([SEED_ROADMAP]));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STUDY_NOTES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EXAM_ATTEMPTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.WRITING_SUBMISSIONS, JSON.stringify([]));
  },

  // Subjects
  getSubjects(): SubjectDoc[] {
    return getCollection<SubjectDoc>(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
  },

  getSubjectById(subjectId: SubjectId): SubjectDoc | undefined {
    return this.getSubjects().find((s) => s.subjectId === subjectId);
  },

  // Topics
  getTopics(subjectId?: SubjectId): TopicDoc[] {
    const all = getCollection<TopicDoc>(STORAGE_KEYS.TOPICS, SEED_TOPICS);
    return subjectId ? all.filter((t) => t.subjectId === subjectId) : all;
  },

  saveTopic(topic: TopicDoc): TopicDoc {
    const topics = this.getTopics();
    const existingIndex = topics.findIndex((t) => t._id === topic._id);
    if (existingIndex >= 0) {
      topics[existingIndex] = { ...topic, updatedAt: new Date().toISOString() };
    } else {
      topics.push({
        ...topic,
        _id: topic._id || generateObjectId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    saveCollection(STORAGE_KEYS.TOPICS, topics);
    return topic;
  },

  deleteTopic(topicId: string): void {
    const topics = this.getTopics().filter((t) => t._id !== topicId);
    saveCollection(STORAGE_KEYS.TOPICS, topics);
  },

  // Knowledge Units
  getKnowledgeUnits(subjectId?: SubjectId, topicId?: string): KnowledgeUnitDoc[] {
    let units = getCollection<KnowledgeUnitDoc>(STORAGE_KEYS.KNOWLEDGE_UNITS, SEED_KNOWLEDGE_UNITS);
    if (subjectId) units = units.filter((u) => u.subjectId === subjectId);
    if (topicId) units = units.filter((u) => u.topicId === topicId);
    return units;
  },

  // Lessons
  getLessons(subjectId?: SubjectId, topicId?: string): LessonDoc[] {
    let list = getCollection<LessonDoc>(STORAGE_KEYS.LESSONS, SEED_LESSONS);
    if (subjectId) list = list.filter((l) => l.subjectId === subjectId);
    if (topicId) list = list.filter((l) => l.topicId === topicId);
    return list;
  },

  getLessonById(lessonId: string): LessonDoc | undefined {
    return this.getLessons().find((l) => l._id === lessonId);
  },

  saveLesson(lesson: LessonDoc): LessonDoc {
    const lessons = this.getLessons();
    const idx = lessons.findIndex((l) => l._id === lesson._id);
    if (idx >= 0) {
      lessons[idx] = { ...lesson, updatedAt: new Date().toISOString() };
    } else {
      lessons.push({
        ...lesson,
        _id: lesson._id || generateObjectId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    saveCollection(STORAGE_KEYS.LESSONS, lessons);
    return lesson;
  },

  // Questions
  getQuestions(subjectId?: SubjectId): QuestionDoc[] {
    const questions = getCollection<QuestionDoc>(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
    return subjectId ? questions.filter((q) => q.subjectId === subjectId) : questions;
  },

  getQuestionById(questionId: string): QuestionDoc | undefined {
    return this.getQuestions().find((q) => q._id === questionId);
  },

  saveQuestion(question: QuestionDoc): QuestionDoc {
    const questions = this.getQuestions();
    const idx = questions.findIndex((q) => q._id === question._id);
    if (idx >= 0) {
      questions[idx] = { ...question, updatedAt: new Date().toISOString() };
    } else {
      questions.push({
        ...question,
        _id: question._id || generateObjectId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    saveCollection(STORAGE_KEYS.QUESTIONS, questions);
    ApiService.saveQuestion(question).catch(() => {});
    return question;
  },

  deleteQuestion(id: string): void {
    const questions = this.getQuestions().filter((q) => q._id !== id);
    saveCollection(STORAGE_KEYS.QUESTIONS, questions);
    ApiService.deleteQuestion(id).catch(() => {});
  },

  // Mock Exams
  getMockExams(subjectId?: SubjectId): MockExamDoc[] {
    const exams = getCollection<MockExamDoc>(STORAGE_KEYS.MOCK_EXAMS, SEED_MOCK_EXAMS);
    return subjectId ? exams.filter((e) => e.subjectId === subjectId) : exams;
  },

  getMockExamById(id: string): MockExamDoc | undefined {
    return this.getMockExams().find((e) => e._id === id);
  },

  // User Profile
  getUserProfile(): UserProfileDoc {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
        return DEFAULT_USER_PROFILE;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  resetUserProfile(): UserProfileDoc {
    const empty: UserProfileDoc = {
      _id: generateObjectId(),
      fullName: '',
      email: '',
      candidateType: 'THI_SINH_TU_DO',
      examYear: 2027,
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
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(empty));
    return empty;
  },

  saveUserProfile(profile: Partial<UserProfileDoc>): UserProfileDoc {
    const current = this.getUserProfile();
    const updated: UserProfileDoc = {
      ...current,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    ApiService.saveUserProfile(updated).catch(() => {});
    return updated;
  },

  // Roadmaps
  getRoadmap(userId: string): RoadmapDoc {
    const list = getCollection<RoadmapDoc>(STORAGE_KEYS.ROADMAPS, [SEED_ROADMAP]);
    const found = list.find((r) => r.userId === userId);
    return found || SEED_ROADMAP;
  },

  saveRoadmap(roadmap: RoadmapDoc): void {
    const list = getCollection<RoadmapDoc>(STORAGE_KEYS.ROADMAPS, [SEED_ROADMAP]);
    const idx = list.findIndex((r) => r._id === roadmap._id);
    if (idx >= 0) {
      list[idx] = { ...roadmap, updatedAt: new Date().toISOString() };
    } else {
      list.push(roadmap);
    }
    saveCollection(STORAGE_KEYS.ROADMAPS, list);
    ApiService.saveRoadmap(roadmap).catch(() => {});
  },

  // Bookmarks
  getBookmarks(userId: string): BookmarkDoc[] {
    return getCollection<BookmarkDoc>(STORAGE_KEYS.BOOKMARKS, []).filter((b) => b.userId === userId);
  },

  toggleBookmark(item: Omit<BookmarkDoc, '_id' | 'createdAt'>): boolean {
    const bookmarks = getCollection<BookmarkDoc>(STORAGE_KEYS.BOOKMARKS, []);
    const idx = bookmarks.findIndex((b) => b.userId === item.userId && b.targetId === item.targetId);
    let isAdded = false;
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      saveCollection(STORAGE_KEYS.BOOKMARKS, bookmarks);
      isAdded = false; // Removed
    } else {
      bookmarks.push({
        ...item,
        _id: generateObjectId(),
        createdAt: new Date().toISOString(),
      });
      saveCollection(STORAGE_KEYS.BOOKMARKS, bookmarks);
      isAdded = true; // Added
    }
    ApiService.toggleBookmark(item).catch(() => {});
    return isAdded;
  },

  isBookmarked(userId: string, targetId: string): boolean {
    const bookmarks = this.getBookmarks(userId);
    return bookmarks.some((b) => b.targetId === targetId);
  },

  // Study Notes
  getStudyNotes(userId: string): StudyNoteDoc[] {
    return getCollection<StudyNoteDoc>(STORAGE_KEYS.STUDY_NOTES, []).filter((n) => n.userId === userId);
  },

  saveStudyNote(note: Omit<StudyNoteDoc, '_id' | 'createdAt' | 'updatedAt'> & { _id?: string }): StudyNoteDoc {
    const notes = getCollection<StudyNoteDoc>(STORAGE_KEYS.STUDY_NOTES, []);
    let targetNote: StudyNoteDoc;
    if (note._id) {
      const idx = notes.findIndex((n) => n._id === note._id);
      if (idx >= 0) {
        notes[idx] = {
          ...notes[idx],
          ...note,
          updatedAt: new Date().toISOString(),
        };
        saveCollection(STORAGE_KEYS.STUDY_NOTES, notes);
        ApiService.saveNote(notes[idx]).catch(() => {});
        return notes[idx];
      }
    }
    targetNote = {
      _id: generateObjectId(),
      userId: note.userId,
      subjectId: note.subjectId,
      targetId: note.targetId,
      title: note.title,
      content: note.content,
      highlightedText: note.highlightedText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(targetNote);
    saveCollection(STORAGE_KEYS.STUDY_NOTES, notes);
    ApiService.saveNote(targetNote).catch(() => {});
    return targetNote;
  },

  deleteStudyNote(noteId: string): void {
    const notes = this.getStudyNotes('').filter((n) => n._id !== noteId);
    saveCollection(STORAGE_KEYS.STUDY_NOTES, notes);
    ApiService.deleteNote(noteId).catch(() => {});
  },

  // Exam Attempts
  getExamAttempts(userId: string): ExamAttemptDoc[] {
    return getCollection<ExamAttemptDoc>(STORAGE_KEYS.EXAM_ATTEMPTS, []).filter((a) => a.userId === userId);
  },

  saveExamAttempt(attempt: Omit<ExamAttemptDoc, '_id'>): ExamAttemptDoc {
    const attempts = getCollection<ExamAttemptDoc>(STORAGE_KEYS.EXAM_ATTEMPTS, []);
    const newAttempt: ExamAttemptDoc = {
      ...attempt,
      _id: generateObjectId(),
    };
    attempts.unshift(newAttempt);
    saveCollection(STORAGE_KEYS.EXAM_ATTEMPTS, attempts);
    ApiService.saveExamAttempt(newAttempt).catch(() => {});

    // Update user estimated scores and weak topics based on attempt
    const profile = this.getUserProfile();
    const currentEst = { ...profile.currentEstimatedScores };
    const scaledScore = Math.min(10, Math.max(1, attempt.score));
    // Blended moving average
    currentEst[attempt.subjectId] = Number(((currentEst[attempt.subjectId] * 0.6) + (scaledScore * 0.4)).toFixed(1));

    // Update study time
    const updatedMinutes = profile.totalStudyMinutes + Math.ceil(attempt.timeSpentSeconds / 60);

    this.saveUserProfile({
      currentEstimatedScores: currentEst,
      totalStudyMinutes: updatedMinutes,
    });

    return newAttempt;
  },

  // Writing Submissions
  getWritingSubmissions(userId: string): WritingSubmissionDoc[] {
    return getCollection<WritingSubmissionDoc>(STORAGE_KEYS.WRITING_SUBMISSIONS, []).filter((s) => s.userId === userId);
  },

  saveWritingSubmission(submission: Omit<WritingSubmissionDoc, '_id' | 'createdAt' | 'updatedAt'>): WritingSubmissionDoc {
    const list = getCollection<WritingSubmissionDoc>(STORAGE_KEYS.WRITING_SUBMISSIONS, []);
    const newSub: WritingSubmissionDoc = {
      ...submission,
      _id: generateObjectId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newSub);
    saveCollection(STORAGE_KEYS.WRITING_SUBMISSIONS, list);
    ApiService.saveWritingSubmission(newSub).catch(() => {});
    return newSub;
  },

  // Curriculum & Versions
  getCurriculums(): CurriculumDoc[] {
    return getCollection<CurriculumDoc>(STORAGE_KEYS.CURRICULUMS, [SEED_CURRICULUM]);
  },

  getCurriculumVersions(): CurriculumVersionDoc[] {
    return getCollection<CurriculumVersionDoc>(STORAGE_KEYS.CURRICULUM_VERSIONS, SEED_CURRICULUM_VERSIONS);
  },

  getExamSpecifications(): ExamSpecificationDoc[] {
    return getCollection<ExamSpecificationDoc>(STORAGE_KEYS.EXAM_SPECS, SEED_EXAM_SPECIFICATIONS);
  },

  saveCurriculumVersion(ver: CurriculumVersionDoc): void {
    const list = this.getCurriculumVersions();
    const idx = list.findIndex((v) => v._id === ver._id);
    if (idx >= 0) {
      list[idx] = { ...ver, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...ver, _id: ver._id || generateObjectId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    saveCollection(STORAGE_KEYS.CURRICULUM_VERSIONS, list);
  },
};
