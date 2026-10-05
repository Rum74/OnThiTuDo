/**
 * Official Curriculum & Specification Seeder for OnThiTuDo
 * Populates real curriculum frameworks, exam specifications, syllabus topics,
 * lessons, and questions according to CT GDPT 2018.
 *
 * NOTE: User data, exam attempts, writing submissions, and notes are NOT seeded,
 * ensuring clean production state with zero mock user data.
 */

import { db } from './database.js';
import bcrypt from 'bcryptjs';
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
  SEED_HISTORY_TIMELINE,
  SEED_GEO_DATASETS,
} from '../src/data/seedData.js';

export async function seedOfficialCurriculumIfEmpty(): Promise<void> {
  const curriculumCount = await db.curriculums.countDocuments();
  if (curriculumCount === 0) {
    console.log('[Seeder] Initializing official GDPT 2018 curriculum and syllabus...');
    await db.curriculums.insertOne(SEED_CURRICULUM);
    await db.curriculumVersions.insertMany(SEED_CURRICULUM_VERSIONS);
    await db.examSpecifications.insertMany(SEED_EXAM_SPECIFICATIONS);
    await db.subjects.insertMany(SEED_SUBJECTS);
    await db.topics.insertMany(SEED_TOPICS);
    await db.knowledgeUnits.insertMany(SEED_KNOWLEDGE_UNITS);
    await db.lessons.insertMany(SEED_LESSONS);
    await db.questions.insertMany(SEED_QUESTIONS);
    await db.mockExams.insertMany(SEED_MOCK_EXAMS);
    await db.historyEvents.insertMany(SEED_HISTORY_TIMELINE);
    await db.geoDatasets.insertMany(SEED_GEO_DATASETS);
    console.log('[Seeder] Official curriculum initialized successfully.');
  } else {
    // If database already has curriculum but lessons count is less than or differs from full syllabus, sync the complete lessons
    const existingLessonsCount = await db.lessons.countDocuments();
    if (existingLessonsCount !== SEED_LESSONS.length) {
      console.log(`[Seeder] Upgrading curriculum to full lessons (${existingLessonsCount} -> ${SEED_LESSONS.length})...`);
      await db.topics.clear();
      await db.topics.insertMany(SEED_TOPICS);
      await db.knowledgeUnits.clear();
      await db.knowledgeUnits.insertMany(SEED_KNOWLEDGE_UNITS);
      await db.lessons.clear();
      await db.lessons.insertMany(SEED_LESSONS);
      console.log('[Seeder] Full curriculum lessons synchronized successfully into MongoDB collections.');
    }
  }

  // Seed default test accounts if users collection is empty
  const userCount = await db.users.countDocuments();
  if (userCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const passHashUser = await bcrypt.hash('123456', salt);
    const passHashAdmin = await bcrypt.hash('admin123', salt);

    const testCandidate = await db.users.insertOne({
      _id: 'usr_candidate_01',
      email: 'thissinh@onthitudo.vn',
      passwordHash: passHashUser,
      fullName: 'Thí sinh Minh Khang',
      candidateType: 'THI_SINH_TU_DO',
      examYear: 2027,
      role: 'CANDIDATE',
      token: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.userProfiles.insertOne({
      _id: testCandidate._id,
      fullName: testCandidate.fullName,
      email: testCandidate.email,
      candidateType: testCandidate.candidateType,
      examYear: testCandidate.examYear,
      curriculumCode: 'GDPT2018',
      enrolledSubjects: ['van', 'su', 'dia'],
      targetScores: { van: 7.5, su: 8.0, dia: 8.0 },
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

    await db.users.insertOne({
      _id: 'usr_admin_01',
      email: 'admin@onthitudo.vn',
      passwordHash: passHashAdmin,
      fullName: 'Quản trị viên Hệ thống',
      candidateType: 'ADMIN',
      examYear: 2027,
      role: 'ADMIN',
      token: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('[Seeder] Seeded default test candidate and admin user accounts.');
  }
}
