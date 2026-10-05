import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEED_HISTORY_TIMELINE, HistoryEventItem } from '../../data/seedData';
import {
  Compass,
  Calendar,
  Users,
  FileText,
  HelpCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
} from 'lucide-react';

export const HistoryTimeline: React.FC = () => {
  const { startQuiz } = useApp();

  const [events] = useState<HistoryEventItem[]>(SEED_HISTORY_TIMELINE);
  const [selectedEvent, setSelectedEvent] = useState<HistoryEventItem | null>(events[0]);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'VIET_NAM' | 'THE_GIOI'>('ALL');
  const [eraFilter, setEraFilter] = useState<'ALL' | '1945_1954' | '1954_1975' | '1975_NAY'>('ALL');

  const filteredEvents = events.filter((e) => {
    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
    if (eraFilter !== 'ALL' && e.era !== eraFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span>Module Lịch sử</span>
            <span aria-hidden="true">·</span>
            <span>Interactive History Timeline</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dòng Thời Gian Tương Tác Lịch Sử Hiện Đại
          </h1>
          <p className="text-xs text-slate-500">
            Học theo chuỗi tư duy Nhân - Quả: Khám phá bối cảnh, diễn biến, ý nghĩa và trích đoạn tư liệu từ các mốc 1945, 1954, 1975 đến 1986.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                categoryFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setCategoryFilter('VIET_NAM')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                categoryFilter === 'VIET_NAM'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Lịch sử Việt Nam
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Timeline Scroll List (5 cols) + Event Detail Panel (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Timeline Spine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Danh sách sự kiện trọng điểm</span>
            <span className="font-mono text-slate-400">{filteredEvents.length} mốc lịch sử</span>
          </div>

          <div className="relative border-l-2 border-amber-200 dark:border-amber-900/60 ml-4 pl-6 space-y-6">
            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`relative cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-sm ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  {/* Timeline Dot */}
                  <span
                    className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                      isSelected
                        ? 'bg-amber-500 border-white dark:border-slate-900 ring-4 ring-amber-200 dark:ring-amber-950'
                        : 'bg-white dark:bg-slate-900 border-amber-400'
                    }`}
                  />

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                      {evt.year} {evt.exactDate && `(${evt.exactDate})`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {evt.category === 'VIET_NAM' ? 'Lịch sử VN' : 'Thế giới'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {evt.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed History Event Panel */}
        <div className="lg:col-span-7">
          {selectedEvent ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-base">
                    Năm {selectedEvent.year}
                  </span>
                  {selectedEvent.exactDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Ngày {selectedEvent.exactDate}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {selectedEvent.sourceType}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {selectedEvent.summary}
                </p>
              </div>

              {/* Bối cảnh lịch sử */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  1. Bối cảnh lịch sử
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-literary italic">
                  "{selectedEvent.context}"
                </div>
              </div>

              {/* Nguyên nhân & Tiền đề */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  2. Nguyên nhân & Tiền đề quan trọng
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedEvent.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nhân vật liên quan */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  3. Nhân vật lịch sử tiêu biểu
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedEvent.keyFigures.map((fig, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {fig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kết quả & Ý nghĩa */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  4. Kết quả & Ý nghĩa lịch sử
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedEvent.resultsAndSignificance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action to Practice */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Luyện dạng câu hỏi tư liệu liên quan đến mốc {selectedEvent.year}
                </span>
                <button
                  onClick={() => startQuiz('su')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  Luyện trắc nghiệm Sử <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
              Chọn một sự kiện từ dòng thời gian bên trái để xem phân tích chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
