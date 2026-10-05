import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, BookOpen, Scale, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
      {/* Important Disclaimer Notice Bar */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 py-3.5 px-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        <div className="max-w-7xl mx-auto flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Lưu ý quan trọng về Cấu trúc Kỳ thi Tốt nghiệp THPT: </span>
            Theo phương án tổ chức thi tốt nghiệp THPT từ năm 2025 của Bộ GD&ĐT, chỉ có <strong>Ngữ văn</strong> và <strong>Toán</strong> là hai môn thi bắt buộc. <strong>Lịch sử</strong> và <strong>Địa lí</strong> là các môn tự chọn trong tổ hợp xét tuyển. Nền tảng OnThiTuDo chuyên sâu hỗ trợ ôn tập bộ ba môn <strong>Văn – Sử – Địa</strong> cho thí sinh tự do, người thi lại và cải thiện điểm.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="text-base font-bold text-slate-900 dark:text-white">
              OnThiTuDo
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nền tảng EdTech chuyên biệt dành cho thí sinh tự do ôn thi tốt nghiệp THPT theo Chương trình GDPT 2018. Học đúng kiến thức, luyện đúng dạng, cá nhân hoá lộ trình.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              CT GDPT 2018 · Phiên bản ôn thi 2026 - 2027
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Môn ôn tập
            </div>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('subject')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Ngữ văn (Môn bắt buộc cùng Toán)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('subject')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Lịch sử (Môn tự chọn)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('subject')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Địa lí (Môn tự chọn)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Công cụ tự học
            </div>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('lab')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Geography Chart Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Interactive History Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('writing')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Writing Workspace & Rubric
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Lộ trình 6 Phase Cá nhân hóa
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Tiêu chuẩn dữ liệu
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mọi nội dung giáo dục đều được gắn nhãn nguồn minh bạch:
              <br />
              <strong className="text-emerald-600 dark:text-emerald-400">OFFICIAL</strong>: Văn bản quy phạm pháp luật, SGK chính thức.
              <br />
              <strong className="text-indigo-600 dark:text-indigo-400">EDITORIAL</strong>: Biên soạn theo định dạng đề tham khảo.
              <br />
              <strong className="text-amber-600 dark:text-amber-400">PRACTICE / DEMO</strong>: Ngân hàng câu hỏi thực hành mô phỏng.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026-2027 OnThiTuDo. Hệ thống hỗ trợ ôn tập độc lập cho thí sinh tự do.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Hệ thống Quản trị / Database MongoDB
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
