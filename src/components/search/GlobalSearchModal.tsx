import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import { Search, X, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { SubjectId } from '../../types/database';

export const GlobalSearchModal: React.FC = () => {
  const {
    openSearchModal,
    setOpenSearchModal,
    setSelectedLesson,
    setActiveTab,
    setActiveSubjectId,
    startQuiz,
  } = useApp();

  const [query, setQuery] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | SubjectId>('ALL');

  if (!openSearchModal) return null;

  const allLessons = MongoService.getLessons();
  const allTopics = MongoService.getTopics();
  const allQuestions = MongoService.getQuestions();

  const cleanQ = query.trim().toLowerCase();

  const matchedLessons = cleanQ
    ? allLessons.filter(
        (l) =>
          (subjectFilter === 'ALL' || l.subjectId === subjectFilter) &&
          (l.title.toLowerCase().includes(cleanQ) ||
            l.subtitle.toLowerCase().includes(cleanQ) ||
            l.coreKnowledge.some((k) => k.toLowerCase().includes(cleanQ)))
      )
    : [];

  const matchedTopics = cleanQ
    ? allTopics.filter(
        (t) =>
          (subjectFilter === 'ALL' || t.subjectId === subjectFilter) &&
          (t.title.toLowerCase().includes(cleanQ) || t.description.toLowerCase().includes(cleanQ))
      )
    : [];

  const matchedQuestions = cleanQ
    ? allQuestions.filter(
        (q) =>
          (subjectFilter === 'ALL' || q.subjectId === subjectFilter) &&
          (q.content.toLowerCase().includes(cleanQ) || q.explanation.toLowerCase().includes(cleanQ))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Tìm kiếm bài học, chuyên đề, sự kiện lịch sử, công thức địa lí..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={() => setOpenSearchModal(false)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400">Phân loại môn:</span>
          {(['ALL', 'van', 'su', 'dia'] as const).map((sub) => {
            const labelMap = { ALL: 'Tất cả', van: 'Ngữ văn', su: 'Lịch sử', dia: 'Địa lí' };
            const isCur = subjectFilter === sub;
            return (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isCur
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {labelMap[sub]}
              </button>
            );
          })}
        </div>

        {/* Results Body */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-4">
          {!cleanQ && (
            <div className="text-center py-8 text-xs text-slate-400">
              Nhập từ khóa như: "Cách mạng tháng Tám", "Nghị luận xã hội", "Biểu đồ miền", "Điện Biên Phủ"...
            </div>
          )}

          {cleanQ && matchedLessons.length === 0 && matchedTopics.length === 0 && matchedQuestions.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              Không tìm thấy kết quả phù hợp với từ khóa "{query}".
            </div>
          )}

          {/* Lessons */}
          {matchedLessons.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bài học liên quan ({matchedLessons.length})
              </div>
              {matchedLessons.map((l) => (
                <div
                  key={l._id}
                  onClick={() => {
                    setSelectedLesson(l);
                    setActiveSubjectId(l.subjectId);
                    setOpenSearchModal(false);
                    setActiveTab('subject');
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                        {l.subjectId === 'van' ? 'Ngữ văn' : l.subjectId === 'su' ? 'Lịch sử' : 'Địa lí'}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-400">{l.estimatedMinutes} phút</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {l.title}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* Topics */}
          {matchedTopics.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chuyên đề ({matchedTopics.length})
              </div>
              {matchedTopics.map((t) => (
                <div
                  key={t._id}
                  onClick={() => {
                    setActiveSubjectId(t.subjectId);
                    setOpenSearchModal(false);
                    setActiveTab('subject');
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {t.title}
                  </div>
                  <div className="text-[11px] text-slate-500">{t.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Questions */}
          {matchedQuestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Câu hỏi trắc nghiệm ({matchedQuestions.length})
              </div>
              {matchedQuestions.map((q) => (
                <div
                  key={q._id}
                  onClick={() => {
                    setActiveSubjectId(q.subjectId);
                    setOpenSearchModal(false);
                    startQuiz(q.subjectId);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs space-y-1"
                >
                  <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {q.content}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    Giải thích: {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
