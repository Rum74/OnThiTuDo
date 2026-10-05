import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LessonDoc, SubjectId } from '../../types/database';
import { MongoService } from '../../services/mongoStorage';
import {
  X,
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  StickyNote,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const LessonDetailModal: React.FC = () => {
  const { selectedLesson, setSelectedLesson, user, showToast, setActiveTab, startQuiz } = useApp();

  const [activeTab, setModalTab] = useState<'content' | 'practice' | 'note'>('content');
  const [noteContent, setNoteContent] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (!selectedLesson) return false;
    return MongoService.isBookmarked(user._id, selectedLesson._id);
  });

  if (!selectedLesson) return null;

  const toggleBookmark = () => {
    const isNowSaved = MongoService.toggleBookmark({
      userId: user._id,
      itemType: 'LESSON',
      targetId: selectedLesson._id,
      subjectId: selectedLesson.subjectId,
      title: selectedLesson.title,
      subtitle: selectedLesson.subtitle,
    });
    setIsBookmarked(isNowSaved);
    showToast(isNowSaved ? 'Đã lưu vào Thư viện cá nhân' : 'Đã bỏ lưu bài học', 'info');
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      showToast('Nội dung ghi chú không được để trống', 'warning');
      return;
    }
    MongoService.saveStudyNote({
      userId: user._id,
      subjectId: selectedLesson.subjectId,
      targetId: selectedLesson._id,
      title: `Ghi chú: ${selectedLesson.title}`,
      content: noteContent,
    });
    showToast('Đã lưu ghi chú học tập!', 'success');
    setNoteContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {selectedLesson.subjectId === 'van'
                  ? 'Ngữ văn'
                  : selectedLesson.subjectId === 'su'
                  ? 'Lịch sử'
                  : 'Địa lí'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedLesson.estimatedMinutes} phút
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {selectedLesson.sourceType}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {selectedLesson.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedLesson.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleBookmark}
              aria-label="Lưu bài học"
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-200 dark:border-indigo-800'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedLesson(null)}
              aria-label="Đóng"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setModalTab('content')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Nội dung cốt lõi
          </button>
          <button
            onClick={() => setModalTab('practice')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'practice'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ví dụ & Phân tích
          </button>
          <button
            onClick={() => setModalTab('note')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'note'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ghi chú bài học
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-xs sm:text-sm">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Core Knowledge */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Kiến thức Cốt lõi Cần nắm vững
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {selectedLesson.coreKnowledge.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deep Analysis */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="font-semibold text-slate-900 dark:text-white text-xs">
                  Phân tích Chuyên sâu & Bẫy Thí sinh Tự do hay gặp:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedLesson.deepAnalysis}
                </p>
              </div>

              {/* Interactive Tool Banner if Available */}
              {selectedLesson.interactiveLabType === 'geo_chart_lab' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                      Bài học có tích hợp Geography Lab
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Thực hành vẽ và phân tích biểu đồ trực tiếp
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLesson(null);
                      setActiveTab('lab');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Vào Lab ngay
                  </button>
                </div>
              )}

              {selectedLesson.interactiveLabType === 'history_timeline' && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                      Bài học có tích hợp History Timeline
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400">
                      Khám phá chuỗi sự kiện và tư liệu lịch sử
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLesson(null);
                      setActiveTab('timeline');
                    }}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Mở Timeline
                  </button>
                </div>
              )}

              {selectedLesson.interactiveLabType === 'writing_workspace' && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-purple-900 dark:text-purple-300 text-xs">
                      Bài học có tích hợp Writing Workspace
                    </div>
                    <div className="text-[11px] text-purple-700 dark:text-purple-400">
                      Luyện viết đoạn văn 200 chữ và chấm điểm theo Rubric
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLesson(null);
                      setActiveTab('writing');
                    }}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Mở Workspace
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Ví dụ Thực tế & Hướng dẫn Phân tích
              </h3>
              {selectedLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
                >
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    Ngữ liệu / Đề bài minh họa:
                  </div>
                  <p className="p-3 bg-white dark:bg-slate-900 rounded-lg text-xs text-slate-700 dark:text-slate-300 font-literary italic">
                    {ex.prompt}
                  </p>
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Phân tích hướng giải:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{ex.sampleAnalysis}</p>
                  </div>
                  <div className="text-xs p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded text-indigo-900 dark:text-indigo-200">
                    <strong>Bài học rút ra: </strong> {ex.keyTakeaway}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'note' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-500" />
                Sổ tay Ghi chú Cá nhân
              </h3>
              <p className="text-xs text-slate-500">
                Ghi lại các ý cần lưu tâm, công thức dễ nhầm hoặc mốc thời gian đặc biệt để ôn tập nhanh.
              </p>
              <textarea
                rows={5}
                placeholder="Nhập ghi chú cho bài học này..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Lưu Ghi Chú
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-slate-400 text-[11px]">
            Nguồn: {selectedLesson.sourceCitation}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedLesson(null);
                startQuiz(selectedLesson.subjectId);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
            >
              Luyện câu hỏi bài này <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
