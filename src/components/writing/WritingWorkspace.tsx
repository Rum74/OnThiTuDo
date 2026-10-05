import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import { WritingSubmissionDoc } from '../../types/database';
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Send,
  History,
  Info,
} from 'lucide-react';

const RUBRIC_CRITERIA = [
  { id: 'crit_form', name: '1. Đảm bảo cấu trúc đoạn văn / bài văn', maxScore: 0.25, guide: 'Đúng hình thức 01 đoạn văn hoàn chỉnh (không xuống dòng tùy tiện) hoặc bố cục bài văn 3 phần rõ ràng.' },
  { id: 'crit_topic', name: '2. Xác định đúng vấn đề cần nghị luận', maxScore: 0.25, guide: 'Xác định trúng vấn đề trọng tâm, không lạc đề hay mở rộng lan man.' },
  { id: 'crit_argument', name: '3. Triển khai luận điểm và lập luận', maxScore: 1.0, guide: 'Hệ thống luận điểm sáng rõ; kết hợp nhuần nhuyễn giải thích, phân tích, chứng minh, bình luận; dẫn chứng thực tế xác thực.' },
  { id: 'crit_spelling', name: '4. Chính tả, ngữ pháp và dùng từ', maxScore: 0.25, guide: 'Không mắc lỗi chính tả, diễn đạt mạch lạc, từ ngữ giàu sức gợi biểu cảm.' },
  { id: 'crit_creative', name: '5. Sáng tạo và liên hệ bài học bản thân', maxScore: 0.25, guide: 'Có suy nghĩ sâu sắc, góc nhìn riêng mới mẻ và bài học hành động thiết thực cho người trẻ.' },
];

export const WritingWorkspace: React.FC = () => {
  const { user, showToast } = useApp();

  const [promptType, setPromptType] = useState<'NGHI_LUAN_XA_HOI' | 'NGHI_LUAN_VAN_HOC'>('NGHI_LUAN_XA_HOI');
  const [essayContent, setEssayContent] = useState<string>('');
  const [history, setHistory] = useState<WritingSubmissionDoc[]>(() => MongoService.getWritingSubmissions(user._id));
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    crit_form: 0.25,
    crit_topic: 0.25,
    crit_argument: 0.75,
    crit_spelling: 0.25,
    crit_creative: 0.25,
  });

  const promptText =
    promptType === 'NGHI_LUAN_XA_HOI'
      ? 'Từ góc nhìn của một thí sinh tự do nỗ lực tự học, hãy viết một đoạn văn (khoảng 200 chữ) bàn về giá trị của tính tự kỷ luật và lòng kiên định trên con đường chinh phục mục tiêu.'
      : 'Phân tích mạch cảm xúc và chiều sâu triết lý nhân sinh của tác giả trong một tác phẩm văn học hiện đại bạn tâm đắc nhất.';

  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;

  // Auto-save draft in localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_essay_${promptType}`);
    if (savedDraft) setEssayContent(savedDraft);
  }, [promptType]);

  const handleContentChange = (text: string) => {
    setEssayContent(text);
    localStorage.setItem(`draft_essay_${promptType}`, text);
  };

  const calculateTotalScore = () => {
    return Object.values(rubricScores).reduce((a, b) => a + b, 0);
  };

  const handleSubmitEssay = () => {
    if (wordCount < 30) {
      showToast('Bài viết quá ngắn. Vui lòng viết tối thiểu 50 chữ trước khi lưu', 'warning');
      return;
    }

    const total = calculateTotalScore();

    const submission = MongoService.saveWritingSubmission({
      userId: user._id,
      promptTitle: promptType === 'NGHI_LUAN_XA_HOI' ? 'Nghị luận xã hội: Tính tự kỷ luật' : 'Nghị luận văn học: Triết lý nhân sinh',
      promptType,
      content: essayContent,
      wordCount,
      timeSpentMinutes: Math.max(10, Math.round(wordCount / 20)),
      selfRubricScores: RUBRIC_CRITERIA.map((c) => ({
        criterionName: c.name,
        maxScore: c.maxScore,
        userScore: rubricScores[c.id] || 0,
        note: c.guide,
      })),
      totalScore: Number(total.toFixed(2)),
    });

    setHistory([submission, ...history]);
    showToast('Đã lưu bài viết và kết quả tự soi chiếu Rubric!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <span>Module Ngữ văn</span>
            <span aria-hidden="true">·</span>
            <span>Writing Workspace & Rubric Evaluator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Không Gian Luyện Viết Nghị Luận & Tự Chấm Rubric
          </h1>
          <p className="text-xs text-slate-500">
            Không học vẹt văn mẫu. Rèn luyện cấu trúc lập luận độc lập và tự soi chiếu bài viết theo 5 tiêu chí Rubric chuẩn của Bộ GD&ĐT.
          </p>
        </div>

        {/* Prompt Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setPromptType('NGHI_LUAN_XA_HOI')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              promptType === 'NGHI_LUAN_XA_HOI'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Nghị luận Xã hội (200 chữ)
          </button>
          <button
            onClick={() => setPromptType('NGHI_LUAN_VAN_HOC')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              promptType === 'NGHI_LUAN_VAN_HOC'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Nghị luận Văn học
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Editor (7 cols) + Rubric Scorer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Writing Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-200/60 dark:border-purple-900/40 text-xs">
              <span className="font-bold text-purple-950 dark:text-purple-300 block mb-1">
                Đề bài thực hành:
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-literary italic text-sm">
                "{promptText}"
              </p>
            </div>

            <div className="relative">
              <textarea
                rows={14}
                value={essayContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Bắt đầu viết bài của bạn tại đây... Hãy chú ý lập luận rõ ràng, sử dụng dẫn chứng thực tế xác thực..."
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-literary leading-relaxed text-slate-900 dark:text-slate-100"
              />

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
                <div className="flex items-center gap-4">
                  <span className="font-mono">
                    Số từ: <strong className="text-slate-900 dark:text-white">{wordCount}</strong> từ
                  </span>
                  {promptType === 'NGHI_LUAN_XA_HOI' && (
                    <span className={`text-[11px] ${wordCount >= 180 && wordCount <= 250 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                      (Khuyến nghị: 180 - 220 từ)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">Đã tự động lưu nháp</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitEssay}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Lưu bài viết & Hoàn tất tự chấm
              </button>
            </div>
          </div>

          {/* Submission History */}
          {history.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                Lịch sử bài viết đã lưu ({history.length})
              </h3>
              <div className="space-y-2">
                {history.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.promptTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.wordCount} từ · {item.timeSpentMinutes} phút · {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                      {item.totalScore} / 2.0đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Rubric Evaluation Matrix */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Khung Rubric Chấm Điểm
                </h3>
                <p className="text-[11px] text-slate-400">
                  Chuẩn hóa theo thang điểm thi Tốt nghiệp THPT 2018
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Tổng điểm tự đánh giá</div>
                <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                  {calculateTotalScore().toFixed(2)} / 2.00
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {RUBRIC_CRITERIA.map((criterion) => {
                const currentScore = rubricScores[criterion.id] ?? criterion.maxScore;
                return (
                  <div
                    key={criterion.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{criterion.name}</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {currentScore} / {criterion.maxScore}
                      </span>
                    </div>

                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      {criterion.guide}
                    </p>

                    {/* Step buttons for score adjustment */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[0, criterion.maxScore / 2, criterion.maxScore].map((val) => (
                        <button
                          key={val}
                          onClick={() =>
                            setRubricScores({
                              ...rubricScores,
                              [criterion.id]: Number(val.toFixed(2)),
                            })
                          }
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            currentScore === Number(val.toFixed(2))
                              ? 'bg-purple-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {val === 0 ? 'Chưa đạt (0đ)' : val === criterion.maxScore ? 'Tối đa' : 'Một phần'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý tính trung thực: </strong> Hệ thống hỗ trợ khung tiêu chuẩn chấm minh bạch để bạn rèn luyện năng lực tự đánh giá. Không có hệ thống AI nào có thể thay thế hoàn toàn cảm quan văn học và thẩm định tư tưởng của giáo viên chấm thi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
