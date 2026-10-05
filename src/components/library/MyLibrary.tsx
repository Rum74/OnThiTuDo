import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import { BookmarkDoc, StudyNoteDoc } from '../../types/database';
import {
  Bookmark,
  StickyNote,
  AlertTriangle,
  BookOpen,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const MyLibrary: React.FC = () => {
  const { user, setSelectedLesson, setActiveTab, setActiveSubjectId, showToast, startQuiz } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'notes' | 'mistakes'>('bookmarks');

  const [bookmarks, setBookmarks] = useState<BookmarkDoc[]>(() => MongoService.getBookmarks(user._id));
  const [notes, setNotes] = useState<StudyNoteDoc[]>(() => MongoService.getStudyNotes(user._id));

  const examAttempts = MongoService.getExamAttempts(user._id);
  const incorrectAttempts: { id: string; subjectId: any; topic: string; error: string }[] = [];

  examAttempts.forEach((attempt) => {
    attempt.answers.forEach((ans) => {
      if (!ans.isCorrect) {
        const q = MongoService.getQuestionById(ans.questionId);
        if (q && !incorrectAttempts.some((it) => it.id === q._id)) {
          incorrectAttempts.push({
            id: q._id,
            subjectId: q.subjectId,
            topic: q.relatedKnowledgeUnitTitle || 'Câu hỏi trắc nghiệm',
            error: `Đã chọn sai dạng câu hỏi ${
              q.questionType === 'SINGLE_CHOICE'
                ? 'Nhiều lựa chọn'
                : q.questionType === 'TRUE_FALSE'
                ? 'Đúng/Sai 4 ý'
                : 'Trả lời ngắn'
            }`,
          });
        }
      }
    });
  });

  const handleDeleteNote = (id: string) => {
    MongoService.deleteStudyNote(id);
    setNotes(notes.filter((n) => n._id !== id));
    showToast('Đã xóa ghi chú', 'info');
  };

  const handleOpenBookmark = (bm: BookmarkDoc) => {
    setActiveSubjectId(bm.subjectId);
    if (bm.itemType === 'LESSON') {
      const lesson = MongoService.getLessonById(bm.targetId);
      if (lesson) {
        setSelectedLesson(lesson);
        setActiveTab('subject');
      }
    } else {
      startQuiz(bm.subjectId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <span>Không gian cá nhân</span>
            <span aria-hidden="true">·</span>
            <span>Tài khoản thí sinh</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Thư Viện & Sổ Tay Học Tập (My Library)
          </h1>
          <p className="text-xs text-slate-500">
            Nơi lưu trữ bài học đã đánh dấu, ghi chú cá nhân và các câu hỏi đã làm sai cần ôn tập lại.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'bookmarks'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Đã lưu ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'notes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Ghi chú ({notes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('mistakes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSubTab === 'mistakes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Ngân hàng câu sai ({incorrectAttempts.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                Chưa có mục đánh dấu nào
              </div>
              <p className="text-xs text-slate-500">
                Khi học bài hoặc làm câu hỏi trắc nghiệm, bấm biểu tượng chiếc cờ hoặc bookmark để lưu vào đây.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((b) => (
                <div
                  key={b._id}
                  onClick={() => handleOpenBookmark(b)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold uppercase ${
                        b.subjectId === 'van'
                          ? 'text-purple-600 dark:text-purple-400'
                          : b.subjectId === 'su'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {b.subjectId === 'van' ? 'Ngữ văn' : b.subjectId === 'su' ? 'Lịch sử' : 'Địa lí'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {b.title}
                  </h3>
                  {b.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{b.subtitle}</p>}
                  <div className="pt-1 flex items-center justify-end text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Mở lại bài →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <StickyNote className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                Chưa có ghi chú nào
              </div>
              <p className="text-xs text-slate-500">
                Bạn có thể ghi chú trực tiếp trong lúc học bất kỳ bài học nào.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((n) => (
                <div
                  key={n._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {n.title}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(n._id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {n.content}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    {new Date(n.updatedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'mistakes' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Nguyên tắc sửa sai: </strong> Thí sinh tự do tiến bộ nhanh nhất khi làm lại đúng các câu hỏi mình từng chọn sai. Khi bạn làm đúng lại 2 lần liên tiếp, câu hỏi sẽ được gỡ khỏi danh sách này.
            </div>
          </div>

          {incorrectAttempts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                Không có câu hỏi làm sai nào trong danh sách
              </div>
              <p className="text-xs text-slate-500">
                Khi bạn làm bài luyện tập hoặc thi thử Mock Exam, các câu trả lời sai sẽ tự động được đưa vào đây để bạn rèn luyện lại cho đến khi thành thạo.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incorrectAttempts.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                        {m.subjectId === 'van' ? 'Ngữ văn' : m.subjectId === 'su' ? 'Lịch sử' : 'Địa lí'}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {m.topic}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Ghi nhận: {m.error}</p>
                  </div>

                  <button
                    onClick={() => startQuiz(m.subjectId)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Luyện lại câu này
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
