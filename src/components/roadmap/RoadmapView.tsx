import React from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService } from '../../services/mongoStorage';
import { RoadmapPhase } from '../../types/database';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  Play,
  RotateCcw,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { user, setActiveTab, setSelectedLesson, setActiveSubjectId, startQuiz, setOpenDiagnosticModal } = useApp();

  const roadmap = MongoService.getRoadmap(user._id);

  const handleAction = (item: any) => {
    setActiveSubjectId(item.subjectId);
    if (item.type === 'LESSON') {
      const lesson = MongoService.getLessonById(item.targetRefId);
      if (lesson) {
        setSelectedLesson(lesson);
        setActiveTab('subject');
      }
    } else if (item.type === 'LAB') {
      setActiveTab('lab');
    } else if (item.type === 'EXAM') {
      startQuiz(item.subjectId, item.targetRefId, true);
    } else {
      startQuiz(item.subjectId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <span>Cá nhân hóa theo năng lực</span>
            <span aria-hidden="true">·</span>
            <span>Năm thi {user.examYear}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lộ Trình Ôn Thi 6 Phase Chuẩn EdTech
          </h1>
          <p className="text-xs text-slate-500">
            Sinh tự động từ mục tiêu điểm ({user.targetScores.van} Văn · {user.targetScores.su} Sử · {user.targetScores.dia} Địa) và kết quả Diagnostic Test đầu vào.
          </p>
        </div>

        <button
          onClick={() => setOpenDiagnosticModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Đo lại năng lực (Diagnostic Test)
        </button>
      </div>

      {/* 6 Phases Timeline List */}
      <div className="space-y-6">
        {roadmap.phases.map((phase) => {
          const isCurrent = phase.status === 'IN_PROGRESS';
          const isCompleted = phase.status === 'COMPLETED';

          return (
            <div
              key={phase.phaseNumber}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-md ring-1 ring-indigo-600/30'
                  : isCompleted
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      PHASE 0{phase.phaseNumber}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isCurrent ? 'Đang thực hiện' : isCompleted ? 'Đã hoàn thành' : 'Kế hoạch tiếp theo'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {phase.title}
                  </h2>
                  <p className="text-xs text-slate-500">{phase.subtitle}</p>
                </div>

                <div className="text-right sm:min-w-36">
                  <div className="text-[11px] text-slate-400 mb-1">
                    Tiến độ hoàn thành: <strong className="text-slate-900 dark:text-white font-mono">{phase.progressPercentage}%</strong>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${phase.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action items inside this phase */}
              <div className="pt-4 space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Mục tiêu cụ thể: {phase.objective} (~{phase.estimatedWeeks} tuần)
                </div>

                <div className="space-y-2">
                  {phase.actionItems.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            act.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span
                          className={`font-semibold uppercase tracking-wider ${
                            act.subjectId === 'van'
                              ? 'text-purple-600 dark:text-purple-400'
                              : act.subjectId === 'su'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {act.subjectId === 'van' ? 'Văn' : act.subjectId === 'su' ? 'Sử' : 'Địa'}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className={`font-medium ${act.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {act.title}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAction(act)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                          act.isCompleted
                            ? 'text-slate-500 hover:text-slate-800 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                            : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                        }`}
                      >
                        {act.isCompleted ? 'Học lại' : 'Vào học ngay'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
