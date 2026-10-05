import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import { QuestionDoc, ExamAttemptDoc, CompetencyType } from '../../types/database';
import {
  Clock,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  RotateCcw,
  Sparkles,
  BarChart2,
  Layers,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizPlayer: React.FC = () => {
  const { quizConfig, exitQuiz, user, setLastAttempt, setActiveTab, setSelectedLesson, showToast } = useApp();

  const isExamMode = quizConfig?.isExamMode ?? false;
  const subjectId = quizConfig?.subjectId ?? 'van';

  const [questions, setQuestions] = useState<QuestionDoc[]>(() => {
    const list = MongoService.getQuestions(subjectId);
    return list.length > 0 ? list : MongoService.getQuestions();
  });

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [attemptReport, setAttemptReport] = useState<ExamAttemptDoc | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Countdown timer for Exam Mode
  const totalSeconds = subjectId === 'van' ? 120 * 60 : 50 * 60;
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(totalSeconds);

  useEffect(() => {
    if (!isExamMode || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamMode, isSubmitted]);

  const currentQ = questions[currentIdx];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (ans: any) => {
    setAnswers({
      ...answers,
      [currentQ._id]: ans,
    });
  };

  const toggleMarkReview = (qId: string) => {
    setMarkedForReview({
      ...markedForReview,
      [qId]: !markedForReview[qId],
    });
  };

  const handleSubmitExam = () => {
    setShowConfirmModal(false);
    let correctCount = 0;
    const answerDetails: any[] = [];
    const compStats: Record<string, { correct: number; total: number }> = {};
    const topicStats: Record<string, { topicTitle: string; correct: number; total: number }> = {};
    const weakTopics: string[] = [];

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
        const stmts = q.trueFalseStatements || [];
        let subCorrect = 0;
        stmts.forEach((s) => {
          if (userAns && userAns[s.id] === s.isCorrect) subCorrect++;
        });
        // Full score if all 4 right, partial if 3 right
        isCorrect = subCorrect >= 3;
      } else {
        isCorrect = Boolean(userAns && userAns.length > 20);
      }

      if (isCorrect) correctCount++;

      answerDetails.push({
        questionId: q._id,
        userAnswer: userAns,
        isCorrect,
        competency: q.competency,
        topicId: q.topicId,
      });

      // Stats by Competency
      if (!compStats[q.competency]) {
        compStats[q.competency] = { correct: 0, total: 0 };
      }
      compStats[q.competency].total++;
      if (isCorrect) compStats[q.competency].correct++;

      // Stats by Topic
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = {
          topicTitle: q.relatedKnowledgeUnitTitle || 'Chuyên đề',
          correct: 0,
          total: 0,
        };
      }
      topicStats[q.topicId].total++;
      if (isCorrect) topicStats[q.topicId].correct++;
      else {
        if (!weakTopics.includes(q.topicId)) weakTopics.push(q.topicId);
      }
    });

    const scaledScore = Number(((correctCount / (questions.length || 1)) * 10).toFixed(1));

    const savedAttempt = MongoService.saveExamAttempt({
      userId: user._id,
      examId: quizConfig?.examId,
      isDiagnostic: false,
      subjectId,
      score: scaledScore,
      maxScore: 10.0,
      correctCount,
      totalCount: questions.length,
      timeSpentSeconds: totalSeconds - timeLeftSeconds,
      answers: answerDetails,
      competencyStats: compStats as any,
      topicStats: topicStats as any,
      weakTopicsIdentified: weakTopics,
      recommendedLessons: ['les_van_01', 'les_su_01', 'les_dia_01'],
      submittedAt: new Date().toISOString(),
    });

    setAttemptReport(savedAttempt);
    setLastAttempt(savedAttempt);
    setIsSubmitted(true);
    confetti({ particleCount: 80, spread: 70 });
  };

  // RENDER POST-EXAM ANALYTICS REPORT
  if (isSubmitted && attemptReport) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kết Quả Bài Thi · Phân Tích Năng Lực
          </h2>
          <p className="text-xs text-slate-500">
            Môn {subjectId === 'van' ? 'Ngữ văn' : subjectId === 'su' ? 'Lịch sử' : 'Địa lí'} · Thời gian làm: {Math.ceil(attemptReport.timeSpentSeconds / 60)} phút
          </p>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] text-slate-400">Điểm quy đổi</div>
              <div className="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {attemptReport.score}
              </div>
              <div className="text-[10px] text-slate-400">Thang 10.0</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] text-slate-400">Số câu đúng</div>
              <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {attemptReport.correctCount}/{attemptReport.totalCount}
              </div>
              <div className="text-[10px] text-slate-400">
                {Math.round((attemptReport.correctCount / attemptReport.totalCount) * 100)}% chính xác
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] text-slate-400">Thời gian làm</div>
              <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
                {formatTimer(attemptReport.timeSpentSeconds)}
              </div>
              <div className="text-[10px] text-slate-400">Tốc độ trung bình</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[11px] text-slate-400">Ước tính mới</div>
              <div className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {user.currentEstimatedScores[subjectId]}
              </div>
              <div className="text-[10px] text-slate-400">Cập nhật hồ sơ</div>
            </div>
          </div>
        </div>

        {/* Competency & Topic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competency Stats */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              Năng lực Thể hiện
            </h3>
            <div className="space-y-3">
              {Object.entries(attemptReport.competencyStats).map(([comp, stats]) => {
                const pct = Math.round((stats.correct / (stats.total || 1)) * 100);
                const compNameMap: Record<string, string> = {
                  RECOGNITION: 'Nhận biết kiến thức',
                  COMPREHENSION: 'Thông hiểu bản chất',
                  SOURCE_ANALYSIS: 'Phân tích tư liệu lịch sử / văn bản',
                  CHART_DATA_SKILL: 'Kỹ năng bảng số liệu & Biểu đồ',
                  CRITICAL_ARGUMENT: 'Lập luận & Nghị luận',
                  APPLICATION: 'Vận dụng kiến thức',
                };
                return (
                  <div key={comp} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">
                        {compNameMap[comp] || comp}
                      </span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {stats.correct}/{stats.total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Recommendations: Bạn nên học tiếp */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Bạn nên học tiếp
            </h3>
            <p className="text-xs text-slate-500">
              Hệ thống đã tự động lọc các chuyên đề bạn bị trừ điểm để đưa vào kế hoạch ôn luyện:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  1. Ôn lại: Phân tích tư liệu & Kỹ năng làm câu hỏi Đúng/Sai
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Luyện tập 10 câu hỏi Đúng/Sai theo chuẩn GDPT 2018
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  2. Khắc phục bẫy tính toán và nhận xét biểu đồ
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Vào Geography Lab thực hành vẽ biểu đồ miền và kết hợp
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => exitQuiz()}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Về Dashboard
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setTimeLeftSeconds(totalSeconds);
                  setCurrentIdx(0);
                  setAnswers({});
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Làm lại bài thi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER LEARNING & EXAM PLAYER
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar for Quiz */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={exitQuiz}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {subjectId === 'van' ? 'Ngữ văn' : subjectId === 'su' ? 'Lịch sử' : 'Địa lí'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{isExamMode ? 'Chế độ Thi Thử (Mock Exam)' : 'Chế độ Luyện Tập'}</span>
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {isExamMode ? 'Đề Thi Thử Tốt Nghiệp THPT' : 'Luyện Câu Hỏi Theo Chuyên Đề'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isExamMode && (
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeLeftSeconds < 300
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
          )}

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* Main Split Layout: Question Card (8 cols) + Navigator (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Câu {currentIdx + 1} / {questions.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {currentQ?.questionType === 'SINGLE_CHOICE'
                    ? 'Nhiều phương án lựa chọn'
                    : currentQ?.questionType === 'TRUE_FALSE'
                    ? 'Đúng / Sai 4 ý'
                    : currentQ?.questionType === 'SHORT_ANSWER'
                    ? 'Trả lời ngắn'
                    : 'Tự luận'}
                </span>
              </div>

              <button
                onClick={() => toggleMarkReview(currentQ._id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  markedForReview[currentQ._id]
                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{markedForReview[currentQ._id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}</span>
              </button>
            </div>

            {/* Stimulus Passage / Data Table */}
            {currentQ?.stimulusData?.textPassage && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-literary italic leading-relaxed text-slate-700 dark:text-slate-300">
                "{currentQ.stimulusData.textPassage}"
                {currentQ.stimulusData.authorOrSource && (
                  <div className="mt-1 text-right text-[11px] not-italic font-sans text-slate-400">
                    — {currentQ.stimulusData.authorOrSource}
                  </div>
                )}
              </div>
            )}

            {currentQ?.stimulusData?.dataTable && (
              <div className="overflow-x-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      {currentQ.stimulusData.dataTable.headers.map((h, i) => (
                        <th key={i} className="p-2 font-semibold text-slate-800 dark:text-slate-200">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQ.stimulusData.dataTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800/60">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2 text-slate-600 dark:text-slate-300 font-mono">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Question Text */}
            <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQ?.content}
            </div>

            {/* Option Input Fields */}
            {currentQ?.questionType === 'SINGLE_CHOICE' && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ._id] === opt.label;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer(opt.label)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
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
                  placeholder="Nhập câu trả lời ngắn (chữ hoặc số)..."
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

            {/* In Learning Mode: Show instant explanation after answer is selected */}
            {!isExamMode && answers[currentQ?._id] && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Giải thích & Kiến thức liên quan:
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Đáp án đúng: {currentQ?.correctAnswer || 'Xem hướng dẫn'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQ?.explanation}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const lesson = MongoService.getLessonById('les_su_01');
                      if (lesson) setSelectedLesson(lesson);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Học lại kiến thức: {currentQ?.relatedKnowledgeUnitTitle} →
                  </button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Câu trước
              </button>

              <button
                disabled={currentIdx === questions.length - 1}
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition-colors"
              >
                Câu tiếp theo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigator Grid (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Danh sách câu hỏi
              </h3>
              <span className="text-[11px] text-slate-400">
                Đã làm: {Object.keys(answers).length}/{questions.length}
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600" /> Đã làm
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded border border-slate-300 dark:border-slate-600" /> Chưa làm
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Đánh dấu
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded ring-2 ring-indigo-500" /> Đang xem
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q._id] !== undefined;
                const isMarked = markedForReview[q._id];
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg font-mono text-xs font-semibold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold'
                        : isMarked
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                        : isAnswered
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                Nộp bài & Xem kết quả
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Xác nhận nộp bài thi?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Bạn đã hoàn thành <strong>{Object.keys(answers).length}</strong> trên tổng số{' '}
              <strong>{questions.length}</strong> câu hỏi.
              {questions.length - Object.keys(answers).length > 0 && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                  Vẫn còn {questions.length - Object.keys(answers).length} câu chưa được chọn đáp án!
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Làm tiếp
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
