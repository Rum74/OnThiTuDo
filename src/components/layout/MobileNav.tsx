import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, BookOpen, PenTool, TrendingUp, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'subject', label: 'Học bài', icon: BookOpen },
    { id: 'quiz', label: 'Luyện đề', icon: PenTool },
    { id: 'roadmap', label: 'Tiến độ', icon: TrendingUp },
    { id: 'library', label: 'Tài khoản', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
