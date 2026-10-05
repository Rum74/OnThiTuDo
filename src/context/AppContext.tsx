import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfileDoc,
  SubjectId,
  LessonDoc,
  ExamAttemptDoc,
} from '../types/database';
import { MongoService } from '../services/mongoStorage';
import { ApiService, AuthResponse } from '../services/api';

interface AppContextType {
  user: UserProfileDoc;
  currentUser: AuthResponse['user'] | null;
  isLoggedIn: boolean;
  updateUser: (profile: Partial<UserProfileDoc>) => void;
  activeTab:
    | 'landing'
    | 'onboarding'
    | 'dashboard'
    | 'subject'
    | 'quiz'
    | 'roadmap'
    | 'lab'
    | 'timeline'
    | 'writing'
    | 'library'
    | 'admin';
  setActiveTab: (tab: any) => void;
  activeSubjectId: SubjectId;
  setActiveSubjectId: (sub: SubjectId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  openDiagnosticModal: boolean;
  setOpenDiagnosticModal: (open: boolean) => void;
  openSearchModal: boolean;
  setOpenSearchModal: (open: boolean) => void;
  selectedLesson: LessonDoc | null;
  setSelectedLesson: (lesson: LessonDoc | null) => void;
  quizConfig: {
    subjectId: SubjectId;
    examId?: string;
    isExamMode: boolean;
  } | null;
  startQuiz: (subjectId: SubjectId, examId?: string, isExamMode?: boolean) => void;
  exitQuiz: () => void;
  lastAttempt: ExamAttemptDoc | null;
  setLastAttempt: (attempt: ExamAttemptDoc | null) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Authentication & Session
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setOpenAuthModal: (open: boolean, mode?: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    candidateType?: string;
    examYear?: number;
  }) => Promise<void>;
  logout: () => Promise<void>;

  // Word Exam Importer
  wordImportModalOpen: boolean;
  setWordImportModalOpen: (open: boolean) => void;

  // Database System Status
  dbStatus: { isMongoConnected: boolean; databaseEngine: string; uri: string };
  refreshDbStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthResponse['user'] | null>(null);
  const [user, setUser] = useState<UserProfileDoc>(() => MongoService.getUserProfile());
  const [activeTab, setActiveTab] = useState<AppContextType['activeTab']>('landing');
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>('van');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('onthitudo_dark_mode') === 'true';
  });
  const [openDiagnosticModal, setOpenDiagnosticModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDoc | null>(null);
  const [quizConfig, setQuizConfig] = useState<{
    subjectId: SubjectId;
    examId?: string;
    isExamMode: boolean;
  } | null>(null);
  const [lastAttempt, setLastAttempt] = useState<ExamAttemptDoc | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Auth state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Word import modal state
  const [wordImportModalOpen, setWordImportModalOpen] = useState(false);

  // Database status
  const [dbStatus, setDbStatus] = useState<{ isMongoConnected: boolean; databaseEngine: string; uri: string }>({
    isMongoConnected: false,
    databaseEngine: 'MongoDB Engine',
    uri: 'mongodb://127.0.0.1:27017/onthitudo',
  });

  const refreshDbStatus = async () => {
    try {
      const status = await ApiService.getDatabaseStatus();
      setDbStatus(status);
    } catch {
      // ignore
    }
  };

  // Initial check on mount
  useEffect(() => {
    refreshDbStatus();

    // Check active login session from API
    ApiService.getMe()
      .then((me) => {
        if (me && me.user) {
          setCurrentUser(me.user);
          if (me.profile) {
            setUser(me.profile);
            MongoService.saveUserProfile(me.profile);
            if (me.profile.hasCompletedOnboarding) {
              setActiveTab('dashboard');
            } else {
              setActiveTab('onboarding');
            }
          }
        } else {
          // Check if local user completed onboarding
          const localProf = MongoService.getUserProfile();
          if (localProf && localProf.email && localProf.hasCompletedOnboarding) {
            setActiveTab('dashboard');
          } else {
            setActiveTab('landing');
          }
        }
      })
      .catch(() => {
        setActiveTab('landing');
      });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('onthitudo_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('onthitudo_dark_mode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateUser = (data: Partial<UserProfileDoc>) => {
    const updated = MongoService.saveUserProfile(data);
    setUser(updated);
    // Also sync to backend MongoDB
    ApiService.saveUserProfile(data).catch(() => {});
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const setOpenAuthModal = (open: boolean, mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(open);
  };

  const login = async (email: string, pass: string) => {
    const res = await ApiService.login(email, pass);
    setCurrentUser(res.user);
    if (res.profile) {
      setUser(res.profile);
      MongoService.saveUserProfile(res.profile);
      if (res.profile.hasCompletedOnboarding) {
        setActiveTab('dashboard');
      } else {
        setActiveTab('onboarding');
      }
    } else {
      setActiveTab('dashboard');
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    candidateType?: string;
    examYear?: number;
  }) => {
    const res = await ApiService.register(data);
    setCurrentUser(res.user);
    if (res.profile) {
      setUser(res.profile);
      MongoService.saveUserProfile(res.profile);
    }
    setActiveTab('onboarding');
  };

  const logout = async () => {
    await ApiService.logout();
    setCurrentUser(null);
    const cleanUser = MongoService.resetUserProfile();
    setUser(cleanUser);
    setActiveTab('landing');
    showToast('Đã đăng xuất tài khoản thành công.', 'info');
  };

  const startQuiz = (subjectId: SubjectId, examId?: string, isExamMode: boolean = false) => {
    setQuizConfig({ subjectId, examId, isExamMode });
    setActiveTab('quiz');
  };

  const exitQuiz = () => {
    setQuizConfig(null);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentUser,
        isLoggedIn: !!currentUser,
        updateUser,
        activeTab,
        setActiveTab,
        activeSubjectId,
        setActiveSubjectId,
        darkMode,
        toggleDarkMode,
        openDiagnosticModal,
        setOpenDiagnosticModal,
        openSearchModal,
        setOpenSearchModal,
        selectedLesson,
        setSelectedLesson,
        quizConfig,
        startQuiz,
        exitQuiz,
        lastAttempt,
        setLastAttempt,
        toast,
        showToast,
        authModalOpen,
        authModalMode,
        setOpenAuthModal,
        login,
        register,
        logout,
        wordImportModalOpen,
        setWordImportModalOpen,
        dbStatus,
        refreshDbStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
