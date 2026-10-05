/**
 * Frontend API Client for OnThiTuDo
 * Seamlessly talks to Express backend & MongoDB database via `/api/*`.
 */

import {
  UserProfileDoc,
  SubjectDoc,
  TopicDoc,
  KnowledgeUnitDoc,
  LessonDoc,
  QuestionDoc,
  MockExamDoc,
  RoadmapDoc,
  BookmarkDoc,
  StudyNoteDoc,
  ExamAttemptDoc,
  WritingSubmissionDoc,
  CurriculumVersionDoc,
  ExamSpecificationDoc,
  SubjectId,
  ContentSourceType,
} from '../types/database';

const TOKEN_KEY = 'onthitudo_auth_token';

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = `API error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) {
        errorDetail = errJson.error;
      }
    } catch {
      errorDetail = `${res.status} ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    fullName: string;
    candidateType: string;
    examYear: number;
    role: 'ADMIN' | 'CANDIDATE';
  };
  profile: UserProfileDoc;
}

export interface ParsedWordQuestion {
  content: string;
  questionType: 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: { id: string; label: string; text: string }[];
  correctAnswer?: string;
  trueFalseStatements?: { id: string; label: string; statement: string; isCorrect: boolean; explanation: string }[];
  explanation: string;
  difficulty: 'NHAN_BIET' | 'THONG_HIEU' | 'VAN_DUNG';
}

export interface WordImportResult {
  fileName: string;
  totalCount: number;
  questions: ParsedWordQuestion[];
  rawExtractedLength: number;
}

export const ApiService = {
  // Authentication
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    candidateType?: string;
    examYear?: number;
  }): Promise<AuthResponse> {
    const res = await apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredAuthToken(res.token);
    return res;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredAuthToken(res.token);
    return res;
  },

  async getMe(): Promise<AuthResponse | null> {
    try {
      const res = await apiFetch<AuthResponse | null>('/api/auth/me');
      return res;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setStoredAuthToken(null);
    }
  },

  // System & Database status
  async getDatabaseStatus(): Promise<{ isMongoConnected: boolean; databaseEngine: string; uri: string }> {
    try {
      return await apiFetch('/api/database/status');
    } catch {
      return { isMongoConnected: false, databaseEngine: 'MongoDB-Compatible Document Store', uri: 'data/db' };
    }
  },

  async resetDatabase(): Promise<void> {
    await apiFetch('/api/database/reset', { method: 'POST' });
  },

  // Word / Docx Exam Import
  async importWordExam(data: { rawText?: string; fileBase64?: string; fileName?: string }): Promise<WordImportResult> {
    return await apiFetch<WordImportResult>('/api/questions/import-word', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async batchInsertQuestions(data: {
    subjectId: SubjectId;
    topicId?: string;
    curriculumVersionYear?: number;
    sourceType?: ContentSourceType;
    sourceCitation?: string;
    questions: any[];
  }): Promise<{ success: boolean; count: number; inserted: QuestionDoc[] }> {
    return await apiFetch<{ success: boolean; count: number; inserted: QuestionDoc[] }>(
      '/api/questions/batch-insert',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // User Profile
  async getUserProfile(): Promise<UserProfileDoc | null> {
    try {
      return await apiFetch<UserProfileDoc | null>('/api/user/profile');
    } catch (e) {
      console.warn('Could not fetch user profile from API:', e);
      return null;
    }
  },

  async saveUserProfile(profile: Partial<UserProfileDoc>): Promise<UserProfileDoc> {
    return await apiFetch<UserProfileDoc>('/api/user/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  // Subjects
  async getSubjects(): Promise<SubjectDoc[]> {
    try {
      return await apiFetch<SubjectDoc[]>('/api/subjects');
    } catch {
      return [];
    }
  },

  // Topics
  async getTopics(subjectId?: SubjectId): Promise<TopicDoc[]> {
    try {
      const url = subjectId ? `/api/topics?subjectId=${subjectId}` : '/api/topics';
      return await apiFetch<TopicDoc[]>(url);
    } catch {
      return [];
    }
  },

  async saveTopic(topic: Partial<TopicDoc>): Promise<TopicDoc> {
    return await apiFetch<TopicDoc>('/api/topics', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  },

  async deleteTopic(id: string): Promise<void> {
    await apiFetch(`/api/topics/${id}`, { method: 'DELETE' });
  },

  // Lessons
  async getLessons(subjectId?: SubjectId, topicId?: string): Promise<LessonDoc[]> {
    try {
      const params = new URLSearchParams();
      if (subjectId) params.append('subjectId', subjectId);
      if (topicId) params.append('topicId', topicId);
      return await apiFetch<LessonDoc[]>(`/api/lessons?${params.toString()}`);
    } catch {
      return [];
    }
  },

  async getLessonById(id: string): Promise<LessonDoc | null> {
    try {
      return await apiFetch<LessonDoc>(`/api/lessons/${id}`);
    } catch {
      return null;
    }
  },

  // Questions
  async getQuestions(subjectId?: SubjectId): Promise<QuestionDoc[]> {
    try {
      const url = subjectId ? `/api/questions?subjectId=${subjectId}` : '/api/questions';
      return await apiFetch<QuestionDoc[]>(url);
    } catch {
      return [];
    }
  },

  async saveQuestion(question: Partial<QuestionDoc>): Promise<QuestionDoc> {
    return await apiFetch<QuestionDoc>('/api/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  },

  async deleteQuestion(id: string): Promise<void> {
    await apiFetch(`/api/questions/${id}`, { method: 'DELETE' });
  },

  // Mock Exams
  async getMockExams(subjectId?: SubjectId): Promise<MockExamDoc[]> {
    try {
      const url = subjectId ? `/api/mock-exams?subjectId=${subjectId}` : '/api/mock-exams';
      return await apiFetch<MockExamDoc[]>(url);
    } catch {
      return [];
    }
  },

  // Roadmaps
  async getRoadmap(userId: string): Promise<RoadmapDoc | null> {
    try {
      return await apiFetch<RoadmapDoc | null>(`/api/roadmaps/${userId}`);
    } catch {
      return null;
    }
  },

  async saveRoadmap(roadmap: Partial<RoadmapDoc>): Promise<RoadmapDoc> {
    return await apiFetch<RoadmapDoc>('/api/roadmaps', {
      method: 'POST',
      body: JSON.stringify(roadmap),
    });
  },

  // Exam Attempts
  async getExamAttempts(userId: string): Promise<ExamAttemptDoc[]> {
    try {
      return await apiFetch<ExamAttemptDoc[]>(`/api/exam-attempts/${userId}`);
    } catch {
      return [];
    }
  },

  async saveExamAttempt(attempt: Partial<ExamAttemptDoc>): Promise<ExamAttemptDoc> {
    return await apiFetch<ExamAttemptDoc>('/api/exam-attempts', {
      method: 'POST',
      body: JSON.stringify(attempt),
    });
  },

  // Writing Submissions
  async getWritingSubmissions(userId: string): Promise<WritingSubmissionDoc[]> {
    try {
      return await apiFetch<WritingSubmissionDoc[]>(`/api/writing-submissions/${userId}`);
    } catch {
      return [];
    }
  },

  async saveWritingSubmission(submission: Partial<WritingSubmissionDoc>): Promise<WritingSubmissionDoc> {
    return await apiFetch<WritingSubmissionDoc>('/api/writing-submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  },

  // Bookmarks
  async getBookmarks(userId: string): Promise<BookmarkDoc[]> {
    try {
      return await apiFetch<BookmarkDoc[]>(`/api/bookmarks/${userId}`);
    } catch {
      return [];
    }
  },

  async toggleBookmark(item: any): Promise<{ saved: boolean }> {
    return await apiFetch<{ saved: boolean }>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  // Notes
  async getNotes(userId: string): Promise<StudyNoteDoc[]> {
    try {
      return await apiFetch<StudyNoteDoc[]>(`/api/notes/${userId}`);
    } catch {
      return [];
    }
  },

  async saveNote(note: Partial<StudyNoteDoc>): Promise<StudyNoteDoc> {
    return await apiFetch<StudyNoteDoc>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  async deleteNote(id: string): Promise<void> {
    await apiFetch(`/api/notes/${id}`, { method: 'DELETE' });
  },

  // Curriculum Versions
  async getCurriculumVersions(): Promise<CurriculumVersionDoc[]> {
    try {
      return await apiFetch<CurriculumVersionDoc[]>('/api/curriculum-versions');
    } catch {
      return [];
    }
  },

  async saveCurriculumVersion(ver: Partial<CurriculumVersionDoc>): Promise<CurriculumVersionDoc> {
    return await apiFetch<CurriculumVersionDoc>('/api/curriculum-versions', {
      method: 'POST',
      body: JSON.stringify(ver),
    });
  },

  // Exam Specifications
  async getExamSpecifications(): Promise<ExamSpecificationDoc[]> {
    try {
      return await apiFetch<ExamSpecificationDoc[]>('/api/exam-specifications');
    } catch {
      return [];
    }
  },
};
