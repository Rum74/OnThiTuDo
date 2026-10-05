import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectId } from '../../types/database';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  BookMarked,
  Target,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { user, updateUser, setActiveTab, setOpenDiagnosticModal, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [examYear, setExamYear] = useState<number>(user.examYear || 2027);
  const [curriculum, setCurriculum] = useState<string>(user.curriculumCode || 'GDPT2018');
  const [candidateType, setCandidateType] = useState<
    'THI_SINH_TU_DO' | 'THI_LAI_DAI_HOC' | 'CAI_THIEN_DIEM' | 'MAT_GOC'
  >(user.candidateType || 'THI_SINH_TU_DO');
  const [enrolledSubjects, setEnrolledSubjects] = useState<SubjectId[]>(
    user.enrolledSubjects && user.enrolledSubjects.length > 0
      ? user.enrolledSubjects
      : ['van', 'su', 'dia']
  );
  const [targetScores, setTargetScores] = useState<Record<SubjectId, number>>({
    van: user.targetScores?.van || 7.5,
    su: user.targetScores?.su || 8.0,
    dia: user.targetScores?.dia || 8.0,
  });
  const [dailyMinutes, setDailyMinutes] = useState<number>(user.dailyStudyTimeMinutes || 60);

  const toggleSubject = (sub: SubjectId) => {
    if (enrolledSubjects.includes(sub)) {
      if (enrolledSubjects.length === 1) {
        showToast('Vui lòng chọn ít nhất một môn học', 'warning');
        return;
      }
      setEnrolledSubjects(enrolledSubjects.filter((s) => s !== sub));
    } else {
      setEnrolledSubjects([...enrolledSubjects, sub]);
    }
  };

  const handleFinish = (proceedToDiagnostic: boolean = false) => {
    updateUser({
      examYear,
      curriculumCode: curriculum,
      candidateType,
      enrolledSubjects,
      targetScores,
      dailyStudyTimeMinutes: dailyMinutes,
      hasCompletedOnboarding: true,
    });

    showToast('Thiết lập mục tiêu thành công!', 'success');

    if (proceedToDiagnostic) {
      setOpenDiagnosticModal(true);
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <span>Bước {step} trên 7</span>
          <span>{Math.round((step / 7) * 100)}% hoàn thành</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Năm thi */}
      {step === 1 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Bạn dự định thi tốt nghiệp THPT vào năm nào?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hệ thống sẽ cập nhật cấu trúc đề thi và ngân hàng câu hỏi bám sát năm thi bạn chọn.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[2026, 2027].map((year) => (
              <button
                key={year}
                onClick={() => setExamYear(year)}
                className={`p-6 rounded-xl border text-left transition-all ${
                  examYear === year
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold font-mono">{year}</span>
                  {examYear === year && <Check className="w-5 h-5 text-indigo-600" />}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {year === 2026 ? 'Kỳ thi Tốt nghiệp 2026' : 'Kỳ thi Tốt nghiệp 2027'}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Chương trình */}
      {step === 2 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Chương trình Giáo dục Phổ thông
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hiện nay kỳ thi tốt nghiệp THPT áp dụng chính thức theo Chương trình GDPT 2018.
            </p>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setCurriculum('GDPT2018')}
              className="p-5 rounded-xl border border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 flex items-start justify-between cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  Chương trình GDPT 2018 (Chuẩn hiện hành)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Đánh giá theo năng lực tư duy, đọc hiểu ngữ liệu mở, trắc nghiệm đúng/sai 4 ý và trắc nghiệm ngắn.
                </p>
              </div>
              <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 opacity-60 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chương trình Giáo dục khác (Nếu Bộ GD&ĐT có quy định bổ sung)
              </div>
              <p className="text-slate-500">
                Hệ thống tách biệt dữ liệu phiên bản độc lập để không trộn lẫn nội dung.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Mục tiêu ôn thi */}
      {step === 3 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Mục tiêu chính của bạn trong kỳ thi này là gì?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Giúp thuật toán cá nhân hoá mức độ ưu tiên trong Lộ trình học (Roadmap).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                id: 'THI_SINH_TU_DO',
                title: 'Thí sinh tự do xét tốt nghiệp',
                desc: 'Cần đỗ tốt nghiệp an toàn, tránh điểm liệt và củng cố căn bản',
              },
              {
                id: 'THI_LAI_DAI_HOC',
                title: 'Thi lại xét tuyển Đại học / Cao đẳng',
                desc: 'Cần điểm cao (7.5 - 9.0+) cho khối xét tuyển C00 hoặc liên quan',
              },
              {
                id: 'CAI_THIEN_DIEM',
                title: 'Cải thiện điểm số',
                desc: 'Đã nắm kiến thức nền, muốn luyện sâu các dạng câu hỏi vận dụng cao',
              },
              {
                id: 'MAT_GOC',
                title: 'Mất gốc / Quên kiến thức nhiều năm',
                desc: 'Cần bắt đầu lại từ kiến thức cốt lõi, ví dụ minh họa và giải thích chi tiết',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setCandidateType(opt.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  candidateType === opt.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  {opt.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Môn ôn */}
      {step === 4 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Chọn các môn bạn muốn ôn tập
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bạn có thể chọn 1, 2 hoặc cả 3 môn.
            </p>
          </div>

          {/* Important Regulatory Clarification */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý:</strong> Ngữ văn là môn bắt buộc trong kỳ thi tốt nghiệp THPT (cùng với môn Toán). Lịch sử và Địa lí là các môn tự chọn. Hãy chọn môn phù hợp với tổ hợp bạn dự định xét tốt nghiệp hoặc tuyển sinh.
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'van' as SubjectId,
                title: 'Ngữ văn',
                sub: 'Môn thi Bắt buộc (Tự luận 120 phút)',
                color: 'purple',
                desc: 'Rèn luyện đọc hiểu văn bản ngoài SGK, tiếng Việt ngữ cảnh, đoạn văn 200 chữ và bài văn thể loại.',
              },
              {
                id: 'su' as SubjectId,
                title: 'Lịch sử',
                sub: 'Môn thi Tự chọn (Trắc nghiệm định dạng mới 50 phút)',
                color: 'amber',
                desc: 'Phân tích chuỗi quan hệ nguyên nhân - kết quả, trắc nghiệm Đúng/Sai 4 ý và tư liệu lịch sử.',
              },
              {
                id: 'dia' as SubjectId,
                title: 'Địa lí',
                sub: 'Môn thi Tự chọn (Trắc nghiệm định dạng mới 50 phút)',
                color: 'emerald',
                desc: 'Xử lý bảng số liệu, Geography Lab nhận diện biểu đồ và vận dụng tự nhiên - kinh tế Việt Nam.',
              },
            ].map((sub) => {
              const isSelected = enrolledSubjects.includes(sub.id);
              return (
                <div
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {sub.title}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">· {sub.sub}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Mục tiêu điểm */}
      {step === 5 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Thiết lập mục tiêu điểm số từng môn
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mục tiêu điểm số trên thang điểm 10.0 để hệ thống phân bổ độ khó bài học.
            </p>
          </div>

          <div className="space-y-5">
            {enrolledSubjects.map((subId) => {
              const nameMap: Record<SubjectId, string> = {
                van: 'Ngữ văn',
                su: 'Lịch sử',
                dia: 'Địa lí',
              };
              const score = targetScores[subId] || 7.5;
              return (
                <div key={subId} className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{nameMap[subId]}</span>
                    <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                      {score.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.25"
                    value={score}
                    onChange={(e) =>
                      setTargetScores({
                        ...targetScores,
                        [subId]: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>5.0 (Cơ bản)</span>
                    <span>7.0 (Khá)</span>
                    <span>8.5 (Giỏi)</span>
                    <span>10.0 (Xuất sắc)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Thời gian học */}
      {step === 6 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Bạn có thể dành bao nhiêu thời gian học mỗi ngày?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thí sinh tự do thường vừa đi làm hoặc bận rộn; hệ thống sẽ chia nhỏ bài học phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { min: 30, label: '30 phút / ngày', desc: '1 bài học ngắn hoặc 1 chùm câu trắc nghiệm' },
              { min: 60, label: '60 phút / ngày', desc: 'Lý tưởng: 1 bài học + luyện tập chuyên sâu' },
              { min: 90, label: '90 phút / ngày', desc: 'Tiến độ nhanh: Ôn 2 môn xen kẽ mỗi tối' },
              { min: 120, label: '120 phút / ngày', desc: 'Tập trung cao độ cho giai đoạn nước rút' },
            ].map((opt) => (
              <button
                key={opt.min}
                onClick={() => setDailyMinutes(opt.min)}
                className={`p-5 rounded-xl border text-left transition-all ${
                  dailyMinutes === opt.min
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {opt.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button
              onClick={() => setStep(7)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 7: Lựa chọn Diagnostic Test */}
      {step === 7 && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl mx-auto flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sẵn sàng kiểm tra năng lực đầu vào?
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Làm bài Diagnostic Test (khoảng 5-8 phút) để hệ thống đo đạc chính xác lỗ hổng kiến thức và tự động tạo Lộ trình ôn thi tối ưu cho bạn.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleFinish(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Làm bài Diagnostic Test ngay
            </button>
            <button
              onClick={() => handleFinish(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Để sau, vào Dashboard trước
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
