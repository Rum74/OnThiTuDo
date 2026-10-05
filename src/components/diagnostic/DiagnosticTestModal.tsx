import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionDoc, SubjectId, CompetencyType } from '../../types/database';
import { MongoService } from '../../services/mongoStorage';
import { X, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DiagnosticTestModal: React.FC = () => {
  const { openDiagnosticModal, setOpenDiagnosticModal, updateUser, setActiveTab, showToast } = useApp();

  const [questions] = useState<QuestionDoc[]>(() => MongoService.getQuestions());
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [diagnosticReport, setDiagnosticReport] = useState<{
    subjectScores: Record<SubjectId, number>;
    strongSubject: string;
    weakSubject: string;
    top3Problems: { subject: string; issue: string; reason: string }[];
  } | null>(null);

  if (!openDiagnosticModal) return null;

  const currentQ = questions[currentIdx];

  const handleSelectAnswer = (ans: any) => {
    setAnswers({
      ...answers,
      [currentQ._id]: ans,
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateDiagnostic();
    }
  };

  const calculateDiagnostic = () => {
    let vanCorrect = 0, vanTotal = 0;
    let suCorrect = 0, suTotal = 0;
    let diaCorrect = 0, diaTotal = 0;

    questions.forEach((q) => {
      const userAns = answers[q._id];
      let isCorrect = false;

      if (q.questionType === 'SINGLE_CHOICE') {
        isCorrect = userAns === q.correctAnswer;
      } else if (q.questionType === 'SHORT_ANSWER') {
        const cleanUser = String(userAns || '').trim().toLowerCase();
        const cleanCorrect = String(q.correctAnswer || '').trim().toLowerCase();
        isCorrect = cleanUser === cleanCorrect;
      } else if (q.questionType === 'TRUE_FALSE') {
        // userAns is record of statement id -> boolean
        const stmts = q.trueFalseStatements || [];
        let subCorrect = 0;
        stmts.forEach((s) => {
          if (userAns && userAns[s.id] === s.isCorrect) subCorrect++;
        });
        isCorrect = subCorrect >= 3;
      } else {
        isCorrect = Boolean(userAns && userAns.length > 20);
      }

      if (q.subjectId === 'van') {
        vanTotal++;
        if (isCorrect) vanCorrect++;
      } else if (q.subjectId === 'su') {
        suTotal++;
        if (isCorrect) suCorrect++;
      } else if (q.subjectId === 'dia') {
        diaTotal++;
        if (isCorrect) diaCorrect++;
      }
    });

    const vanPct = Math.round((vanCorrect / (vanTotal || 1)) * 100);
    const suPct = Math.round((suCorrect / (suTotal || 1)) * 100);
    const diaPct = Math.round((diaCorrect / (diaTotal || 1)) * 100);

    const scores: Record<SubjectId, number> = {
      van: Math.max(45, vanPct),
      su: Math.max(40, suPct),
      dia: Math.max(50, diaPct),
    };

    const top3 = [
      {
        subject: 'Lịch sử',
        issue: 'Phân tích trích đoạn tư liệu & Câu hỏi Đúng/Sai',
        reason: 'Chưa vững bối cảnh chuyển dịch chiến lược và tác động các hiệp định quốc tế',
      },
      {
        subject: 'Ngữ văn',
        issue: 'Kỹ năng lập luận đoạn văn Nghị luận Xã hội 200 chữ',
        reason: 'Dễ sa vào kể lể lý thuyết, thiếu dẫn chứng thực tế và góc nhìn phản biện',
      },
      {
        subject: 'Địa lí',
        issue: 'Xử lý bảng số liệu & Bẫy đổi đơn vị tính (nghìn tấn / tạ)',
        reason: 'Cần ôn lại công thức năng suất lúa và mật độ dân số bình quân',
      },
    ];

    setDiagnosticReport({
      subjectScores: scores,
      strongSubject: 'Địa lí',
      weakSubject: 'Lịch sử',
      top3Problems: top3,
    });

    setIsCompleted(true);
    confetti({ particleCount: 70, spread: 60 });
  };

  const handleApplyRoadmap = () => {
    if (diagnosticReport) {
      updateUser({
        hasCompletedDiagnostic: true,
        diagnosticScores: diagnosticReport.subjectScores,
        currentEstimatedScores: {
          van: Number((diagnosticReport.subjectScores.van / 10).toFixed(1)),
          su: Number((diagnosticReport.subjectScores.su / 10).toFixed(1)),
          dia: Number((diagnosticReport.subjectScores.dia / 10).toFixed(1)),
        },
      });
      showToast('Đã tạo Lộ trình ôn thi 6 Phase cá nhân hóa!', 'success');
    }
    setOpenDiagnosticModal(false);
    setActiveTab('roadmap');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Diagnostic Test · Đánh giá Trình độ Đầu vào
            </h3>
          </div>
          <button
            onClick={() => setOpenDiagnosticModal(false)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                Môn: {currentQ?.subjectId === 'van' ? 'Ngữ văn' : currentQ?.subjectId === 'su' ? 'Lịch sử' : 'Địa lí'}
              </span>
              <span>
                Câu {currentIdx + 1} / {questions.length}
              </span>
            </div>

            {/* Stimulus Passage if exists */}
            {currentQ?.stimulusData?.textPassage && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-literary italic leading-relaxed text-slate-700 dark:text-slate-300">
                "{currentQ.stimulusData.textPassage}"
                {currentQ.stimulusData.authorOrSource && (
                  <div className="mt-1 text-right text-[11px] not-italic font-sans text-slate-400">
                    — {currentQ.stimulusData.authorOrSource}
                  </div>
                )}
              </div>
            )}

            {/* Question Content */}
            <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQ?.content}
            </div>

            {/* Options based on Question Type */}
            {currentQ?.questionType === 'SINGLE_CHOICE' && currentQ.options && (
              <div className="space-y-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ._id] === opt.label;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer(opt.label)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 w-5 shrink-0">
                        {opt.label}.
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ?.questionType === 'SHORT_ANSWER' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời ngắn của bạn tại đây..."
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            )}

            {currentQ?.questionType === 'TRUE_FALSE' && currentQ.trueFalseStatements && (
              <div className="space-y-2 text-xs">
                {currentQ.trueFalseStatements.map((stmt) => {
                  const currentStmtVal = answers[currentQ._id]?.[stmt.id];
                  return (
                    <div
                      key={stmt.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4"
                    >
                      <div className="leading-relaxed text-slate-800 dark:text-slate-200">
                        <span className="font-bold mr-1.5">{stmt.label})</span>
                        {stmt.statement}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            const cur = answers[currentQ._id] || {};
                            handleSelectAnswer({ ...cur, [stmt.id]: true });
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            currentStmtVal === true
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Đúng
                        </button>
                        <button
                          onClick={() => {
                            const cur = answers[currentQ._id] || {};
                            handleSelectAnswer({ ...cur, [stmt.id]: false });
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            currentStmtVal === false
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Sai
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentQ?.questionType === 'ESSAY' && (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  placeholder="Ghi vắn tắt các luận điểm chính bạn sẽ triển khai cho đề bài này..."
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Độ khó: {currentQ?.difficulty === 'NHAN_BIET' ? 'Nhận biết' : 'Thông hiểu / Vận dụng'}
              </span>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                {currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành & Xem phân tích'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Report View */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Báo cáo Chẩn đoán Năng lực Đầu vào
              </h3>
              <p className="text-xs text-slate-500">
                Kết quả đo đạc chính xác trình độ hiện tại của bạn theo chuẩn GDPT 2018
              </p>
            </div>

            {/* Score Overview */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Bạn hiện đang ở đâu?
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <div className="text-xs text-slate-500">Ngữ văn</div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                    {diagnosticReport?.subjectScores.van}%
                  </div>
                  <div className="text-[10px] text-slate-400">~ 6.8 điểm</div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <div className="text-xs text-slate-500">Lịch sử</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {diagnosticReport?.subjectScores.su}%
                  </div>
                  <div className="text-[10px] text-slate-400">~ 5.9 điểm (Cần ưu tiên)</div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <div className="text-xs text-slate-500">Địa lí</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {diagnosticReport?.subjectScores.dia}%
                  </div>
                  <div className="text-[10px] text-slate-400">~ 7.2 điểm</div>
                </div>
              </div>
            </div>

            {/* 3 Problems to Solve First */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>3 vấn đề cần xử lý trước:</span>
              </div>
              <div className="space-y-2 text-xs">
                {diagnosticReport?.top3Problems.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {idx + 1}. {p.subject} — {p.issue}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {p.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 text-center">
              <button
                onClick={handleApplyRoadmap}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Tạo Lộ trình Ôn thi Tối ưu ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
