/**
 * MongoDB Document Types and Application Interfaces
 * Structure aligned with MongoDB BSON/Document standards.
 */

export type SubjectId = 'van' | 'su' | 'dia';

export type ContentSourceType = 'OFFICIAL' | 'EDITORIAL' | 'PRACTICE' | 'DEMO';

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'TRUE_FALSE' // 4 sub-statements as in GDPT 2018 format
  | 'SHORT_ANSWER'
  | 'READING_COMPREHENSION'
  | 'ESSAY';

export type DifficultyLevel = 'NHAN_BIET' | 'THONG_HIEU' | 'VAN_DUNG' | 'VAN_DUNG_CAO';

export type CompetencyType =
  | 'RECOGNITION' // Nhận biết kiến thức
  | 'COMPREHENSION' // Thông hiểu bản chất
  | 'SOURCE_ANALYSIS' // Phân tích tư liệu lịch sử / văn bản
  | 'CHART_DATA_SKILL' // Kỹ năng bảng số liệu / biểu đồ / Atlat
  | 'CRITICAL_ARGUMENT' // Lập luận / nghị luận / đánh giá
  | 'APPLICATION'; // Vận dụng thực tiễn

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

// MongoDB Document: curriculums
export interface CurriculumDoc {
  _id: string; // Mongo ObjectId string
  code: string; // e.g. "GDPT2018"
  name: string; // "Chương trình Giáo dục Phổ thông 2018"
  description: string;
  sourceType: ContentSourceType;
  sourceReference: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: curriculum_versions
export interface CurriculumVersionDoc {
  _id: string;
  curriculumId: string; // reference to CurriculumDoc._id
  versionYear: number; // 2026, 2027
  title: string;
  notes: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: exam_specifications
export interface ExamSpecificationDoc {
  _id: string;
  curriculumVersionId: string;
  code: string; // e.g. "THPT_2026_VAN_SU_DIA"
  year: number;
  description: string;
  subjectsMeta: {
    subjectId: SubjectId;
    isMandatoryInNationalExam: boolean; // Văn: true (with Toán), Sử/Địa: false (electives)
    totalQuestions: number;
    durationMinutes: number;
    scoringScale: number; // 10.0
    structureNote: string;
  }[];
  sourceType: ContentSourceType;
  officialDocumentRef?: string;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: subjects
export interface SubjectDoc {
  _id: string;
  subjectId: SubjectId;
  name: string; // "Ngữ văn", "Lịch sử", "Địa lí"
  badge: string;
  accentColor: string; // 'purple' | 'amber' | 'emerald'
  bannerImage: string;
  examType: 'Tự luận' | 'Trắc nghiệm định dạng mới';
  durationMinutes: number;
  isMandatoryNationalExam: boolean; // Ngữ văn is mandatory, Sử/Địa are elective
  roleExplanation: string;
  targetTips: string;
  order: number;
}

// MongoDB Document: topics
export interface TopicDoc {
  _id: string;
  subjectId: SubjectId;
  curriculumVersionYear: number;
  title: string;
  category: string; // e.g., "Đọc hiểu", "Lịch sử Việt Nam 1945-1975", "Địa lí các ngành kinh tế"
  description: string;
  order: number;
  estimatedMinutes: number;
  status: ContentStatus;
  sourceType: ContentSourceType;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: knowledge_units
export interface KnowledgeUnitDoc {
  _id: string;
  topicId: string;
  subjectId: SubjectId;
  code: string; // e.g. "SU_1945_01"
  title: string;
  summary: string;
  keyPoints: string[];
  commonMisconceptions: string[]; // Các bẫy sai sót thí sinh tự do hay gặp
  order: number;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: learning_objectives
export interface LearningObjectiveDoc {
  _id: string;
  knowledgeUnitId: string;
  subjectId: SubjectId;
  description: string;
  competency: CompetencyType;
  targetLevel: DifficultyLevel;
}

// MongoDB Document: lessons
export interface LessonDoc {
  _id: string;
  topicId: string;
  knowledgeUnitId: string;
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  coreKnowledge: string[]; // Gạch đầu dòng kiến thức cốt lõi
  examples: {
    prompt: string;
    sampleAnalysis: string;
    keyTakeaway: string;
  }[];
  deepAnalysis: string;
  interactiveLabType?: 'history_timeline' | 'geo_chart_lab' | 'writing_workspace' | 'none';
  status: ContentStatus;
  sourceType: ContentSourceType;
  sourceCitation: string;
  createdAt: string;
  updatedAt: string;
}

// Sub-interface for True/False questions (GDPT 2018 4-item style)
export interface TrueFalseStatement {
  id: string;
  label: string; // a, b, c, d
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

// MongoDB Document: questions
export interface QuestionDoc {
  _id: string;
  subjectId: SubjectId;
  curriculumVersionYear: number;
  examYear?: number;
  topicId: string;
  knowledgeUnitId: string;
  competency: CompetencyType;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  content: string; // Text or stimulus text
  stimulusData?: {
    textPassage?: string; // Đoạn trích văn học / đoạn tư liệu sử / văn bản nghị luận
    authorOrSource?: string;
    dataTable?: {
      headers: string[];
      rows: (string | number)[][];
    };
    chartConfig?: {
      type: 'bar' | 'line' | 'pie' | 'area';
      unit: string;
      title: string;
    };
  };
  options?: {
    id: string;
    label: string; // A, B, C, D
    text: string;
  }[];
  correctAnswer?: string; // e.g. "A" or short text answer
  trueFalseStatements?: TrueFalseStatement[]; // for TRUE_FALSE
  essayRubric?: {
    maxScore: number;
    criteria: {
      name: string;
      weight: number;
      guide: string;
    }[];
  };
  explanation: string;
  relatedKnowledgeUnitTitle: string;
  sourceType: ContentSourceType;
  sourceCitation: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: mock_exams
export interface MockExamDoc {
  _id: string;
  title: string;
  subjectId: SubjectId;
  curriculumVersionYear: number;
  year: number;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  questionIds: string[];
  sourceType: ContentSourceType;
  sourceCitation: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: users (profile & study config)
export interface UserProfileDoc {
  _id: string;
  fullName: string;
  email: string;
  candidateType: 'THI_SINH_TU_DO' | 'THI_LAI_DAI_HOC' | 'CAI_THIEN_DIEM' | 'MAT_GOC';
  examYear: number; // 2026, 2027
  curriculumCode: string; // "GDPT2018"
  enrolledSubjects: SubjectId[]; // ['van', 'su', 'dia']
  targetScores: Record<SubjectId, number>; // e.g. { van: 7.5, su: 8.0, dia: 8.0 }
  currentEstimatedScores: Record<SubjectId, number>;
  dailyStudyTimeMinutes: number; // 30, 60, 90, 120
  streakDays: number;
  totalStudyMinutes: number;
  hasCompletedOnboarding: boolean;
  hasCompletedDiagnostic: boolean;
  diagnosticScores?: Record<SubjectId, number>;
  weakTopics: {
    topicId: string;
    subjectId: SubjectId;
    topicTitle: string;
    masteryScore: number; // 0-100
    identifiedReason: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: roadmaps (personalized phases)
export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  subtitle: string;
  objective: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercentage: number;
  estimatedWeeks: number;
  actionItems: {
    id: string;
    subjectId: SubjectId;
    title: string;
    type: 'LESSON' | 'PRACTICE' | 'EXAM' | 'LAB';
    targetRefId: string;
    isCompleted: boolean;
  }[];
}

export interface RoadmapDoc {
  _id: string;
  userId: string;
  examYear: number;
  generatedDate: string;
  phases: RoadmapPhase[];
  updatedAt: string;
}

// MongoDB Document: bookmarks
export interface BookmarkDoc {
  _id: string;
  userId: string;
  itemType: 'LESSON' | 'QUESTION' | 'TIMELINE' | 'TOPIC';
  targetId: string;
  subjectId: SubjectId;
  title: string;
  subtitle?: string;
  note?: string;
  createdAt: string;
}

// MongoDB Document: study_notes
export interface StudyNoteDoc {
  _id: string;
  userId: string;
  subjectId: SubjectId;
  targetId: string; // lesson or question id
  title: string;
  content: string;
  highlightedText?: string;
  createdAt: string;
  updatedAt: string;
}

// MongoDB Document: exam_attempts
export interface ExamAttemptDoc {
  _id: string;
  userId: string;
  examId?: string;
  isDiagnostic: boolean;
  subjectId: SubjectId;
  score: number; // scaled to 10.0 or percentage
  maxScore: number;
  correctCount: number;
  totalCount: number;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    userAnswer: any;
    isCorrect: boolean;
    competency: CompetencyType;
    topicId: string;
  }[];
  competencyStats: Record<CompetencyType, { correct: number; total: number }>;
  topicStats: Record<string, { topicTitle: string; correct: number; total: number }>;
  weakTopicsIdentified: string[];
  recommendedLessons: string[];
  submittedAt: string;
}

// MongoDB Document: writing_submissions (Ngữ văn workspace)
export interface WritingSubmissionDoc {
  _id: string;
  userId: string;
  promptTitle: string;
  promptType: 'NGHI_LUAN_XA_HOI' | 'NGHI_LUAN_VAN_HOC' | 'DOC_HIEU_VIET_DOAN';
  passageContext?: string;
  content: string;
  wordCount: number;
  timeSpentMinutes: number;
  selfRubricScores: {
    criterionName: string;
    maxScore: number;
    userScore: number;
    note: string;
  }[];
  totalScore: number;
  createdAt: string;
  updatedAt: string;
}
