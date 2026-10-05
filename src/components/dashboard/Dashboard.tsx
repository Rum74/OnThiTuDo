import React from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import {
  Flame,
  Clock,
  Target,
  ArrowRight,
  BookOpen,
  Sparkles,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  BarChart3,
  Compass,
} from 'lucide-react';
import { SubjectId } from '../../types/database';

export const Dashboard: React.FC = () => {
  const {
    user,
    setActiveTab,
    setActiveSubjectId,
    startQuiz,
    setSelectedLesson,
    setOpenDiagnosticModal,
  } = useApp();

  const subjects = MongoService.getSubjects();
  const lessons = MongoService.getLessons();

  const todayTasks = [
    {
      id: 'task_van_1',
      subjectId: 'van' as SubjectId,
      title: 'Đọc hiểu Văn bản Nghị luận Xã hội hiện đại',
      duration: '20 phút',
      lessonId: 'les_van_01',
      tag: 'Ngữ văn',
      color: 'purple',
    },
    {
      id: 'task_su_1',
      subjectId: 'su' as SubjectId,
      title: 'Lịch sử: Nghệ thuật chớp thời cơ và phân tích tư liệu',
      duration: '25 phút',
      lessonId: 'les_su_01',
      tag: 'Lịch sử',
      color: 'amber',
    },
    {
      id: 'task_dia_1',
      subjectId: 'dia' as SubjectId,
      title: 'Địa lí: Phân tích biểu đồ và nhận xét bảng số liệu',
      duration: '20 phút',
      lessonId: 'les_dia_01',
      tag: 'Địa lí',
      color: 'emerald',
    },
  ];

  const handleStartLesson = (lessonId: string, subjectId: SubjectId) => {
    const lesson = MongoService.getLessonById(lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
      setActiveSubjectId(subjectId);
      setActiveTab('subject');
    }
  };

  const getMasteryBadge = (score: number) => {
    if (score < 40) return { label: 'Chưa nắm', color: 'text-rose-600 dark:text-rose-400' };
    if (score < 60) return { label: 'Đang học', color: 'text-amber-600 dark:text-amber-400' };
    if (score < 80) return { label: 'Khá', color: 'text-indigo-600 dark:text-indigo-400' };
    return { label: 'Thành thạo', color: 'text-emerald-600 dark:text-emerald-400' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Exam Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Chào mừng trở lại,</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user.fullName}
            </span>
            <span aria-hidden="true">·</span>
            <span>Năm thi {user.examYear}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bảng Điều Khiển Ôn Tập
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Học đúng kiến thức · Luyện đúng dạng · Tập trung vào các chủ đề còn yếu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <Flame className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-slate-400">Chuỗi học: </span>
              <strong className="text-slate-900 dark:text-white font-mono">{user.streakDays} ngày</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <Clock className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="text-slate-400">Tổng thời gian: </span>
              <strong className="text-slate-900 dark:text-white font-mono">{user.totalStudyMinutes} phút</strong>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('roadmap')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors whitespace-nowrap"
          >
            Lộ trình học <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Scores vs Estimated Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          const target = user.targetScores[sub.subjectId] || 8.0;
          const current = user.currentEstimatedScores[sub.subjectId] || 6.0;
          const progress = Math.min(100, Math.round((current / target) * 100));

          return (
            <div
              key={sub.subjectId}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {sub.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {sub.isMandatoryNationalExam ? '(Bắt buộc)' : '(Tự chọn)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{sub.examType}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveSubjectId(sub.subjectId);
                    setActiveTab('subject');
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Vào môn →
                </button>
              </div>

              {/* Score comparisons */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Ước tính hiện tại</div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    {current.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Mục tiêu đề ra</div>
                  <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {target.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Tiến độ đạt mục tiêu</span>
                  <span className="font-mono font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.subjectId === 'van'
                        ? 'bg-purple-600'
                        : sub.subjectId === 'su'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  onClick={() => startQuiz(sub.subjectId, undefined, false)}
                  className="text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  Luyện câu hỏi
                </button>
                <button
                  onClick={() => startQuiz(sub.subjectId, undefined, true)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Thi thử 50/120 phút
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Section: Việc cần làm hôm nay (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Việc cần làm hôm nay
              </h2>
              <p className="text-xs text-slate-500">
                Phân bổ đều theo thời lượng học hàng ngày của bạn (~{user.dailyStudyTimeMinutes} phút)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">3 nhiệm vụ</span>
          </div>

          <div className="space-y-3">
            {todayTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold ${
                        t.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : t.color === 'amber'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {t.tag}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.duration}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {t.title}
                  </div>
                </div>

                <button
                  onClick={() => handleStartLesson(t.lessonId, t.subjectId)}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Bắt đầu học
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Bạn nên ôn lại (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Bạn nên ôn lại
              </h2>
              <p className="text-xs text-slate-500">
                Phát hiện từ các câu trả lời sai và bài kiểm tra gần nhất
              </p>
            </div>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {(!user.weakTopics || user.weakTopics.length === 0) ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Chưa phát hiện lỗ hổng kiến thức nghiêm trọng
                </div>
                <p className="text-[11px] text-slate-500">
                  Làm bài Diagnostic Test hoặc thi thử Mock Exam để hệ thống tự động xác định các chủ đề cần củng cố và đưa vào đây.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setOpenDiagnosticModal(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100"
                  >
                    Làm bài Diagnostic Test ngay
                  </button>
                </div>
              </div>
            ) : (
              user.weakTopics.map((w, idx) => {
              const badge = getMasteryBadge(w.masteryScore);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        {w.subjectId === 'su' ? 'Lịch sử' : w.subjectId === 'van' ? 'Ngữ văn' : 'Địa lí'}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {w.topicTitle}
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold whitespace-nowrap ${badge.color}`}>
                      {badge.label} ({w.masteryScore}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {w.identifiedReason}
                  </p>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setActiveSubjectId(w.subjectId);
                        setActiveTab('subject');
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      Học lại ngay <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Specific EdTech Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div
          onClick={() => setActiveTab('lab')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all space-y-2"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            Geography Lab
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nhập số liệu, mô phỏng biểu đồ Cột, Đường, Tròn, Miền và luyện giải thích bảng số liệu.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('timeline')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 cursor-pointer transition-all space-y-2"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            History Timeline
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Khám phá các mốc 1945, 1954, 1975, 1986 qua chuỗi bối cảnh, nhân vật và tư liệu lịch sử.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('writing')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-all space-y-2"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            Writing Workspace
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Viết đoạn văn 200 chữ và bài nghị luận, tự chấm theo thang điểm Rubric chuẩn GDPT 2018.
          </p>
        </div>
      </div>
    </div>
  );
};
