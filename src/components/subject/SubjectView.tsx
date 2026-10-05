import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import { SubjectId, TopicDoc, LessonDoc } from '../../types/database';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Compass,
  FileText,
  Sparkles,
  ArrowRight,
  Info,
  Search,
  Bookmark,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const SubjectView: React.FC = () => {
  const { activeSubjectId, setActiveSubjectId, setSelectedLesson, startQuiz, setActiveTab, user } = useApp();

  const subjects = MongoService.getSubjects();
  const currentSubject = MongoService.getSubjectById(activeSubjectId) || subjects[0];
  const topics = MongoService.getTopics(activeSubjectId);
  const lessons = MongoService.getLessons(activeSubjectId);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = Array.from(new Set(topics.map((t) => t.category)));

  // Filter topics and lessons by category and search keyword
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const byCategory = selectedCategory === 'all' 
      ? topics 
      : topics.filter((t) => t.category === selectedCategory);

    if (!query) return byCategory;

    // Keep topics that match or have lessons that match
    return byCategory.filter((topic) => {
      const matchTopic = 
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query);

      const hasMatchingLessons = lessons.some(
        (l) =>
          l.topicId === topic._id &&
          (l.title.toLowerCase().includes(query) ||
            l.subtitle.toLowerCase().includes(query) ||
            l.coreKnowledge.some((k) => k.toLowerCase().includes(query)))
      );

      return matchTopic || hasMatchingLessons;
    });
  }, [topics, lessons, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Subject Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center gap-1 overflow-x-auto p-1">
          {subjects.map((sub) => {
            const isActive = sub.subjectId === activeSubjectId;
            const subLessonsCount = MongoService.getLessons(sub.subjectId).length;
            return (
              <button
                key={sub.subjectId}
                onClick={() => {
                  setActiveSubjectId(sub.subjectId);
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{sub.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 font-mono">
                  {subLessonsCount} bài
                </span>
                <span className="text-[10px] opacity-75">
                  {sub.isMandatoryNationalExam ? '· Bắt buộc' : '· Tự chọn'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3">
          <button
            onClick={() => startQuiz(activeSubjectId, undefined, true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Làm Mock Exam ({currentSubject.durationMinutes} phút)
          </button>
        </div>
      </div>

      {/* Subject Banner & Role Description */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentSubject.name} 12
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500">{currentSubject.badge}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 font-mono">{currentSubject.durationMinutes} phút</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full {lessons.length} bài học chuẩn CT GDPT 2018
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Chương trình Toàn diện Môn {currentSubject.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentSubject.roleExplanation}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Lời khuyên ôn thi thực chiến: </strong>
              {currentSubject.targetTips}
            </div>
          </div>

          {/* Interactive Subject Specific Tool Link */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3 text-xs">
            <div className="font-bold text-indigo-950 dark:text-indigo-200 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Công cụ Thực hành Môn {currentSubject.name}
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeSubjectId === 'van' && 'Writing Workspace: Luyện viết đoạn văn 200 chữ và tự soi chiếu rubric barem điểm Bộ GD&ĐT.'}
              {activeSubjectId === 'su' && 'Interactive Timeline: Xem quan hệ nhân - quả qua các mốc son 1945, 1954, 1975, 1986.'}
              {activeSubjectId === 'dia' && 'Geography Lab: Tự vẽ biểu đồ tương tác Recharts và phân tích chuyển dịch cơ cấu.'}
            </p>
            <button
              onClick={() => {
                if (activeSubjectId === 'van') setActiveTab('writing');
                else if (activeSubjectId === 'su') setActiveTab('timeline');
                else setActiveTab('lab');
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {activeSubjectId === 'van' && <FileText className="w-3.5 h-3.5" />}
              {activeSubjectId === 'su' && <Compass className="w-3.5 h-3.5" />}
              {activeSubjectId === 'dia' && <BarChart3 className="w-3.5 h-3.5" />}
              Mở Công cụ Thực hành
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tất cả chủ đề ({topics.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Realtime Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Tìm trong ${lessons.length} bài học môn ${currentSubject.name}...`}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Topics & Lessons Grid */}
      <div className="space-y-6">
        {filteredTopics.map((topic) => {
          const query = searchQuery.trim().toLowerCase();
          const topicLessons = lessons.filter((l) => {
            if (l.topicId !== topic._id) return false;
            if (!query) return true;
            return (
              l.title.toLowerCase().includes(query) ||
              l.subtitle.toLowerCase().includes(query) ||
              l.coreKnowledge.some((k) => k.toLowerCase().includes(query))
            );
          });

          return (
            <div
              key={topic._id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{topic.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>~{topic.estimatedMinutes} phút tổng lượng</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Nguồn: {topic.sourceType}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {topicLessons.length} bài học
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {topic.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {topic.description}
                  </p>
                </div>

                <button
                  onClick={() => startQuiz(activeSubjectId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  Luyện trắc nghiệm chuyên đề này <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lesson Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topicLessons.map((lesson) => {
                  const isBookmarked = user ? MongoService.isBookmarked(user._id, lesson._id) : false;

                  return (
                    <div
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {lesson.title}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isBookmarked && (
                            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          )}
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}p
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {lesson.subtitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="flex items-center gap-1 font-mono">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {lesson.coreKnowledge.length} ý cốt lõi · {lesson.examples.length} ví dụ thực tế
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          Học ngay →
                        </span>
                      </div>
                    </div>
                  );
                })}

                {topicLessons.length === 0 && (
                  <div className="col-span-full p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center py-6">
                    Không tìm thấy bài học nào phù hợp với từ khóa "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
            <p className="text-sm font-semibold">Không tìm thấy chuyên đề hoặc bài học nào khớp với từ khóa.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Xóa bộ lọc để hiển thị toàn bộ bài học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
