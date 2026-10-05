import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Calendar,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Database,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setOpenAuthModal,
    authModalMode,
    login,
    register,
    showToast,
    dbStatus,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [candidateType, setCandidateType] = useState('THI_SINH_TU_DO');
  const [examYear, setExamYear] = useState<number>(2027);

  // Sync mode with prop
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMessage('');
  }, [authModalMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        }
        await login(email, password);
        showToast('Đăng nhập thành công! Chào mừng bạn quay trở lại.', 'success');
        setOpenAuthModal(false);
      } else {
        if (!fullName.trim()) {
          throw new Error('Vui lòng nhập Họ và tên của bạn.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Vui lòng nhập địa chỉ Email hợp lệ.');
        }
        if (password.length < 6) {
          throw new Error('Mật khẩu cần tối thiểu 6 ký tự để bảo mật.');
        }
        await register({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          candidateType,
          examYear,
        });
        showToast('Đăng ký tài khoản thành công! Hãy bắt đầu thiết lập lộ trình.', 'success');
        setOpenAuthModal(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (demoEmail: string, demoPass: string, demoName: string) => {
    if (mode === 'login') {
      setEmail(demoEmail);
      setPassword(demoPass);
    } else {
      setEmail(demoEmail);
      setPassword(demoPass);
      setFullName(demoName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-6 py-6 text-white relative">
          <button
            onClick={() => setOpenAuthModal(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Nền tảng EdTech Thí sinh tự do
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-sm text-emerald-100 mt-1">
            {mode === 'login'
              ? 'Tiếp tục lộ trình ôn thi tốt nghiệp THPT theo chuẩn CT GDPT 2018.'
              : 'Xác định điểm yếu, học đúng dạng và theo dõi tiến độ thi tốt nghiệp.'}
          </p>

          {/* Database indicator */}
          <div className="mt-3 inline-flex items-center gap-2 text-xs bg-black/20 px-3 py-1 rounded-full text-emerald-200">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSDL: {dbStatus.isMongoConnected ? 'MongoDB Server' : 'MongoDB Document Engine'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-sm font-semibold text-center transition-all ${
              mode === 'login'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-sm font-semibold text-center transition-all ${
              mode === 'register'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Đăng ký thí sinh
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <span className="text-rose-500 font-bold text-sm">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Họ và tên thí sinh <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Lê Minh Trí"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thissinhtudo@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Năm dự thi
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <select
                        value={examYear}
                        onChange={(e) => setExamYear(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value={2026}>Kỳ thi 2026</option>
                        <option value={2027}>Kỳ thi 2027</option>
                        <option value={2028}>Kỳ thi 2028</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Chương trình
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <div className="w-full pl-9 pr-2 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        GDPT 2018
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Đối tượng thí sinh
                  </label>
                  <select
                    value={candidateType}
                    onChange={(e) => setCandidateType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="THI_SINH_TU_DO">Thí sinh tự do (đã tốt nghiệp năm trước)</option>
                    <option value="THI_LAI_DAI_HOC">Thi lại để cải thiện điểm xét tuyển Đại học</option>
                    <option value="MAT_GOC_KIEN_THUC">Mất gốc / Quên kiến thức cần lấy lại căn bản</option>
                    <option value="TU_HOC_KHONG_GIAO_VIEN">Tự học độc lập (không có giáo viên theo sát)</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Đăng nhập ngay' : 'Đăng ký & Bắt đầu'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick accounts for reviewer / fast testing */}
          <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider text-center">
              Hoặc dùng tài khoản mẫu để trải nghiệm nhanh:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('thissinh@onthitudo.vn', '123456', 'Thí sinh Minh Khang')}
                className="py-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 text-xs font-medium text-left transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Thí sinh tự do</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@onthitudo.vn', 'admin123', 'Quản trị viên Hệ thống')}
                className="py-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 text-xs font-medium text-left transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">Admin / Giáo viên</span>
              </button>
            </div>
          </div>

          {/* Security footnote */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bảo mật chuẩn BSON / Bcrypt. Lưu trữ CSDL MongoDB.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
