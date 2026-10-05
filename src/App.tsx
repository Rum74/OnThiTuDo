import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Dashboard } from './components/dashboard/Dashboard';
import { SubjectView } from './components/subject/SubjectView';
import { QuizPlayer } from './components/quiz/QuizPlayer';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { GeographyLab } from './components/lab/GeographyLab';
import { HistoryTimeline } from './components/timeline/HistoryTimeline';
import { WritingWorkspace } from './components/writing/WritingWorkspace';
import { MyLibrary } from './components/library/MyLibrary';
import { AdminCMS } from './components/admin/AdminCMS';
import { DiagnosticTestModal } from './components/diagnostic/DiagnosticTestModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { LessonDetailModal } from './components/subject/LessonDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { WordExamImporter } from './components/admin/WordExamImporter';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    toast,
    wordImportModalOpen,
    setWordImportModalOpen,
  } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'onboarding' && <OnboardingFlow />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'subject' && <SubjectView />}
        {activeTab === 'quiz' && <QuizPlayer />}
        {activeTab === 'roadmap' && <RoadmapView />}
        {activeTab === 'lab' && <GeographyLab />}
        {activeTab === 'timeline' && <HistoryTimeline />}
        {activeTab === 'writing' && <WritingWorkspace />}
        {activeTab === 'library' && <MyLibrary />}
        {activeTab === 'admin' && <AdminCMS />}
      </main>

      <Footer />
      <MobileNav />

      {/* Global Modals */}
      <AuthModal />
      <WordExamImporter
        isOpen={wordImportModalOpen}
        onClose={() => setWordImportModalOpen(false)}
      />
      <DiagnosticTestModal />
      <GlobalSearchModal />
      <LessonDetailModal />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 border border-zinc-700 dark:border-zinc-300">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 dark:text-amber-600" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 dark:text-sky-600" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
