import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveTab,
    setOpenDiagnosticModal,
    setOpenAuthModal,
    setWordImportModalOpen,
    isLoggedIn,
    dbStatus,
  } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Important Clarification Banner */}
      <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 py-2.5 px-4 text-xs text-indigo-950 dark:text-indigo-200 text-center font-medium">
        Kỳ thi Tốt nghiệp THPT: Ngữ văn là môn thi bắt buộc (cùng với Toán) · Lịch sử và Địa lí là các môn tự chọn · OnThiTuDo tập trung hỗ trợ bộ 3 môn Văn - Sử - Địa cho thí sinh tự do.
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 pt-12 pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                <span>Chương trình GDPT 2018</span>
                <span aria-hidden="true">·</span>
                <span>Dành riêng cho Thí sinh Tự do & Thi lại</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[10px] text-emerald-800 dark:text-emerald-200">
                  CSDL: MongoDB
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
                ÔN THI TỐT NGHIỆP THPT
              </h1>

              <div className="text-2xl sm:text-3xl font-semibold text-slate-700 dark:text-slate-200 font-literary">
                Văn • Sử • Địa
              </div>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Học đúng kiến thức. Luyện đúng dạng. Biết chính xác mình đang yếu ở đâu.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setOpenDiagnosticModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl shadow-sm transition-all hover:shadow-emerald-500/20 whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Kiểm tra trình độ đầu vào
                </button>

                {isLoggedIn ? (
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all whitespace-nowrap cursor-pointer"
                  >
                    Vào Bảng điều khiển học tập
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setOpenAuthModal(true, 'register')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all whitespace-nowrap cursor-pointer"
                  >
                    Bắt đầu ôn thi (Đăng ký)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setWordImportModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-all whitespace-nowrap cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Import đề Word (.docx)
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cá nhân hóa theo năng lực</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Định dạng câu hỏi mới GDPT 2018</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Không học vẹt văn mẫu</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800 aspect-[16/11]">
                <img
                  src="/src/assets/images/hero_thpt_study_1790866936923.jpg"
                  alt="Không gian học tập ôn thi tốt nghiệp THPT Văn Sử Địa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium">
                  <div className="font-semibold text-sm">Lộ trình Ôn thi Độc lập cho Thí sinh Tự do</div>
                  <div className="text-slate-200 text-xs">Vá lỗ hổng · Luyện kỹ năng · Thi thử áp lực thật</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Vì sao nên học theo lộ trình? */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              01. Dành riêng cho đối tượng đặc thù
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              Vì sao thí sinh tự do cần một lộ trình ôn tập khác biệt?
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Khác với học sinh lớp 12 trên lớp có giáo viên kèm cặp hàng ngày, thí sinh tự do thường gặp khó khăn: quên kiến thức, mất phương hướng trước ma trận kiến thức GDPT 2018 mới, và dễ sa đà vào việc đọc thụ động tài liệu PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                1
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Learn What You Need
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Không bắt bạn học tuần tự từ bài 1 đến hết sách. Hệ thống kiểm tra trước để xác định chính xác kiến thức nào bạn đã vững, kiến thức nào bị rỗng để bù đắp ngay.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                2
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Đúng định dạng đề thi mới
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Làm quen từ sớm với câu hỏi trắc nghiệm Đúng/Sai 4 lệnh (vốn có cách chấm điểm lũy tiến 0.1 - 0.25 - 0.5 - 1.0 điểm) và câu hỏi trắc nghiệm ngắn, không bị bỡ ngỡ trong phòng thi.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                3
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Không biến thành kho PDF thụ động
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mỗi bài học đều đi kèm tương tác: phòng thí nghiệm biểu đồ Địa lí, dòng thời gian tương tác môn Sử, và không gian luyện viết Văn theo tiêu chuẩn Rubric khách quan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Diagnostic Test */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  02. Diagnostic Test
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
                  Kiểm tra Trình độ Đầu vào: Bạn đang ở đâu trên thang điểm?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Không đơn thuần cho ra một con số điểm tổng quát. Bài Diagnostic Test đa chiều phân tách rõ: bạn yếu ở năng lực nhận biết, thông hiểu, phân tích tư liệu hay kỹ năng biểu đồ. Sau bài thi, hệ thống lập tức đề xuất <strong>3 vấn đề cần xử lý trước</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setOpenDiagnosticModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Làm bài Test Đầu vào ngay
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-xs space-y-3">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Ví dụ báo cáo chẩn đoán:</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Ngữ văn</span>
                      <span className="font-semibold">6.8 / 10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Lịch sử (Điểm yếu: Phân tích tư liệu)</span>
                      <span className="font-semibold text-amber-600">5.9 / 10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '59%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Địa lí</span>
                      <span className="font-semibold">7.2 / 10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500">
                  → Tự động kích hoạt Phase 1: Vá lỗ hổng
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Học Văn */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                03. Module Ngữ văn · Môn bắt buộc
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Đọc hiểu Ngữ liệu Mở & Viết Luận theo Rubric
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Đề thi tốt nghiệp THPT theo GDPT 2018 sử dụng ngữ liệu ngoài SGK. Nền tảng rèn luyện cho bạn phương pháp đọc hiểu đa thể loại (văn học, nghị luận, thông tin), nhận diện tiếng Việt trong ngữ cảnh và không gian viết bài Writing Workspace tự soi chiếu theo 7 tiêu chí Rubric chuẩn.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab('writing');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Mở Writing Workspace & Rubric
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
                <div className="text-xs font-semibold text-purple-900 dark:text-purple-300">
                  Cấu trúc rèn luyện Ngữ văn:
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
                    <span className="font-semibold block text-slate-900 dark:text-white">Đọc hiểu:</span>
                    Văn học, nghị luận xã hội, thông tin đời sống
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
                    <span className="font-semibold block text-slate-900 dark:text-white">Tiếng Việt:</span>
                    Tu từ nghệ thuật, liên kết đoạn, ngữ nghĩa
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
                    <span className="font-semibold block text-slate-900 dark:text-white">Nghị luận Xã hội:</span>
                    Đoạn văn 200 chữ, lập luận và dẫn chứng
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
                    <span className="font-semibold block text-slate-900 dark:text-white">Nghị luận Văn học:</span>
                    Phân tích đặc trưng thể loại và hình tượng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Học Sử */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="p-6 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-3">
                <div className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                  Dòng thời gian tương tác Lịch sử Việt Nam & Thế giới:
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-700 dark:text-amber-400">1945</span> · Cách mạng Tháng Tám
                    </div>
                    <span className="text-slate-500">Nghệ thuật chớp thời cơ</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-700 dark:text-amber-400">1954</span> · Chiến dịch Điện Biên Phủ
                    </div>
                    <span className="text-slate-500">Đánh chắc, tiến chắc</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-700 dark:text-amber-400">1975</span> · Đại thắng Mùa Xuân
                    </div>
                    <span className="text-slate-500">Giải phóng miền Nam</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                04. Module Lịch sử · Môn tự chọn
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Tư duy Lịch sử & Xử lý Trích đoạn Tư liệu
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Không học thuộc lòng số liệu máy móc. Học Lịch sử qua chuỗi quan hệ Nhân - Quả, bối cảnh không gian thời gian và luyện chùm câu hỏi Đúng/Sai từ các đoạn trích sử liệu thực tế.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Khám phá Interactive Timeline Sử
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Học Địa */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                05. Module Địa lí · Môn tự chọn
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Geography Lab & Nhận diện Biểu đồ
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Geography Lab cho phép bạn trực tiếp nhập bảng số liệu, chọn loại biểu đồ (Cột, Đường, Tròn, Miền, Kết hợp), quan sát biểu đồ trực quan và kiểm tra khả năng nhận xét quy luật chuyển dịch cơ cấu.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('lab')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Mở Geography Lab
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-3">
                <div className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Quy luật Nhận diện Biểu đồ cốt lõi:
                </div>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded border border-emerald-100 dark:border-emerald-900/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Biểu đồ Tròn:</span> Thể hiện quy mô và cơ cấu với thời gian ≤ 3 năm hoặc so sánh giữa các đối tượng.
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded border border-emerald-100 dark:border-emerald-900/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Biểu đồ Miền:</span> Thể hiện sự chuyển dịch cơ cấu qua chuỗi thời gian liên tục từ 4 năm trở lên.
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded border border-emerald-100 dark:border-emerald-900/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Biểu đồ Đường:</span> Thể hiện tốc độ tăng trưởng, chỉ số phát triển với đơn vị tính là %.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 & 7: Luyện đề & Phân tích kết quả */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              06 & 07. Luyện đề & Phân tích
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Mock Exam Áp lực Phòng thi & Phân tích Điểm yếu
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
              Đồng hồ đếm ngược, tự động lưu câu trả lời, không gợi ý đáp án trong lúc làm bài. Nộp bài xong, bạn nhận ngay báo cáo chi tiết theo từng chủ đề và năng lực.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-base">
                Exam Mode Chuẩn phòng thi
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Tối ưu giao diện thi tập trung: Question Navigator 28 câu, đánh dấu câu cần xem lại, xác nhận nộp bài an toàn không sợ mất bài thi.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
                <span>50 phút (Sử/Địa) · 120 phút (Văn)</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-base">
                Học lại ngay Điểm Yếu
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Hệ thống tự động gom câu làm sai vào Ngân hàng câu sai cá nhân (My Library) và dẫn trực tiếp nút "Học lại kiến thức này".
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>Tự động cập nhật ước tính điểm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Learning Roadmap 6 Phases */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              08. Learning Roadmap
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Lộ trình 6 Phase Cá nhân hóa
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
              Được sinh tự động dựa trên: Mục tiêu điểm · Năm thi · Thời gian học mỗi ngày · Kết quả kiểm tra đầu vào.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { num: 'P1', title: 'Vá lỗ hổng', desc: 'Xử lý kiến thức mất gốc', status: 'Đang học' },
              { num: 'P2', title: 'Xây nền tảng', desc: 'Hệ thống hóa toàn diện', status: 'Tiếp theo' },
              { num: 'P3', title: 'Luyện dạng câu', desc: 'Đúng/Sai, Trả lời ngắn', status: 'Kế hoạch' },
              { num: 'P4', title: 'Luyện chuyên đề', desc: 'Vận dụng cao, liên môn', status: 'Kế hoạch' },
              { num: 'P5', title: 'Mock Exam', desc: 'Thi thử bấm giờ thực tế', status: 'Kế hoạch' },
              { num: 'P6', title: 'Ôn điểm yếu', desc: 'Tổng ôn nước rút', status: 'Kế hoạch' },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5"
              >
                <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {p.num}
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">{p.title}</div>
                <div className="text-slate-500 dark:text-slate-400 leading-tight">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              09. Câu hỏi thường gặp
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Giải đáp thắc mắc cho Thí sinh Tự do
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                1. Tôi đã tốt nghiệp nhiều năm trước theo chương trình cũ, giờ thi lại theo CT GDPT 2018 có bỡ ngỡ không?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                Chương trình GDPT 2018 chú trọng đánh giá năng lực tư duy chứ không yêu cầu học thuộc lòng máy móc như trước. Nền tảng OnThiTuDo xây dựng các bài học kiến thức cốt lõi và hướng dẫn phương pháp giải từng dạng câu hỏi mới, giúp bạn nhanh chóng làm chủ cách thi mới.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                2. Tại sao website tập trung vào 3 môn Văn - Sử - Địa? Cả 3 môn này có phải đều bắt buộc không?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                Không. Theo quy định của Bộ GD&ĐT, chỉ có <strong>Ngữ văn</strong> và <strong>Toán</strong> là môn thi bắt buộc. Lịch sử và Địa lí là các môn tự chọn. Website chuyên sâu bộ 3 môn Khoa học Xã hội (Văn - Sử - Địa) để phục vụ tốt nhất các khối xét tuyển truyền thống (như C00 và các tổ hợp liên quan) cho thí sinh tự do.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                3. Tôi chỉ có 30 - 60 phút mỗi tối để tự học, liệu có kịp tiến độ ôn thi không?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                Hoàn toàn kịp. Trong bước Onboarding, hệ thống cho phép bạn chọn thời gian học mỗi ngày (30, 60, 90 hoặc 120 phút). Lộ trình học sẽ tự động phân bổ: 1 bài đọc hiểu hoặc 1 chùm câu hỏi tư liệu ngắn vừa vặn với thời gian thực tế của bạn.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            {isLoggedIn ? (
              <button
                onClick={() => setActiveTab('onboarding')}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
              >
                Thiết lập Lộ trình Ôn thi Ngay
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setOpenAuthModal(true, 'register')}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
              >
                Đăng ký Tài khoản & Nhận Lộ trình Cá nhân
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
