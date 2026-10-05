import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Moon,
  Sun,
  Sparkles,
  BookOpen,
  FileText,
  User,
  LogOut,
  Database,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    darkMode,
    toggleDarkMode,
    setOpenSearchModal,
    setOpenDiagnosticModal,
    currentUser,
    isLoggedIn,
    setOpenAuthModal,
    logout,
    setWordImportModalOpen,
    dbStatus,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'TS';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Database status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'landing')}
            className="text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:opacity-90 transition-opacity whitespace-nowrap text-left"
          >
            <span className="text-emerald-600 dark:text-emerald-400">OnThi</span>TuDo
          </button>

          {/* Database Live Status Indicator */}
          <div
            title={`CSDL: ${dbStatus.databaseEngine} (${dbStatus.uri})`}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
          >
            <Database className="w-3 h-3 text-emerald-500" />
            <span>MongoDB {dbStatus.isMongoConnected ? 'Live' : 'Active'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                : ''
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('subject')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'subject'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                : ''
            }`}
          >
            Văn • Sử • Địa
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'roadmap'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                : ''
            }`}
          >
            Lộ trình
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'lab'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                : ''
            }`}
          >
            Geo Lab
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'timeline'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                : ''
            }`}
          >
            Timeline Sử
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'library'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                : ''
            }`}
          >
            Thư viện
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap py-1 ${
              activeTab === 'admin'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-500'
                : ''
            }`}
          >
            Admin CMS
          </button>
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-2">
          {/* Quick Import Word exam button */}
          <button
            onClick={() => setWordImportModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Import Đề Word</span>
          </button>

          {/* Search modal trigger */}
          <button
            onClick={() => setOpenSearchModal(true)}
            aria-label="Tìm kiếm nội dung"
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Chuyển chế độ sáng tối"
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Diagnostic test button */}
          <button
            onClick={() => setOpenDiagnosticModal(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-xl transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnostic Test</span>
          </button>

          {/* Auth section */}
          {isLoggedIn && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700/80"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  {getInitials(currentUser.fullName)}
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block truncate max-w-[110px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                    {currentUser.role === 'ADMIN' ? 'Admin' : 'Thí sinh tự do'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <GraduationCap className="w-3 h-3" />
                      <span>Kỳ thi {currentUser.examYear} • GDPT 2018</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Hồ sơ thí sinh & Bảng điểm</span>
                  </button>

                  <button
                    onClick={() => setWordImportModalOpen(true)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Import đề thi từ file Word</span>
                  </button>

                  {currentUser.role === 'ADMIN' && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Quản trị CSDL MongoDB</span>
                    </button>
                  )}

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>

                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenAuthModal(true, 'login')}
                className="px-3.5 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setOpenAuthModal(true, 'register')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Đăng ký ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
