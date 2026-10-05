import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApiService, ParsedWordQuestion } from '../../services/api';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  BookOpen,
  ArrowRight,
  Database,
  X,
  Layers,
  HelpCircle,
  ListFilter,
  Check,
} from 'lucide-react';
import { SubjectId, ContentSourceType } from '../../types/database';

interface WordExamImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export const WordExamImporter: React.FC<WordExamImporterProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const { showToast, activeSubjectId } = useApp();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'template'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Target metadata for saving to MongoDB
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(activeSubjectId || 'su');
  const [examYear, setExamYear] = useState<number>(2027);
  const [sourceType, setSourceType] = useState<ContentSourceType>('PRACTICE');
  const [sourceCitation, setSourceCitation] = useState('Đề thi khảo sát chất lượng tốt nghiệp THPT');

  // Parsed questions state
  const [parsedQuestions, setParsedQuestions] = useState<ParsedWordQuestion[]>([]);
  const [parsedFileName, setParsedFileName] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.name.endsWith('.docx') && !f.name.endsWith('.doc')) {
        setError('Vui lòng chọn file định dạng Microsoft Word (.docx hoặc .doc)');
        return;
      }
      setFile(f);
      setError('');
    }
  };

  const handleParseFile = async () => {
    if (!file) {
      setError('Vui lòng chọn file Word (.docx) trước khi phân tích.');
      return;
    }

    setLoading(true);
    setError('');
    setSavedSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const result = await ApiService.importWordExam({
            fileBase64: base64,
            fileName: file.name,
          });

          if (result.questions.length === 0) {
            setError(
              'Không nhận diện được câu hỏi nào trong file Word. Vui lòng kiểm tra định dạng hoặc xem Tab "Mẫu chuẩn Word".'
            );
          } else {
            setParsedQuestions(result.questions);
            setParsedFileName(result.fileName);
            showToast(`Đã nhận diện thành công ${result.questions.length} câu hỏi từ file Word!`, 'success');
          }
        } catch (err: any) {
          setError(err.message || 'Lỗi khi giải mã file Word.');
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Không thể đọc file từ thiết bị.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleParseText = async () => {
    if (!rawText.trim()) {
      setError('Vui lòng dán nội dung văn bản đề thi từ Word vào khung bên dưới.');
      return;
    }

    setLoading(true);
    setError('');
    setSavedSuccess(false);

    try {
      const result = await ApiService.importWordExam({
        rawText,
        fileName: 'Văn bản Word dán trực tiếp',
      });

      if (result.questions.length === 0) {
        setError('Không nhận diện được câu hỏi nào. Hãy chắc chắn có từ khóa như "Câu 1.", "A.", "B.", "C.", "D."');
      } else {
        setParsedQuestions(result.questions);
        setParsedFileName('Nội dung đề thi từ Word');
        showToast(`Đã trích xuất thành công ${result.questions.length} câu hỏi!`, 'success');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi trích xuất câu hỏi từ văn bản.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (parsedQuestions.length === 0) return;

    setIsSavingToDb(true);
    try {
      const res = await ApiService.batchInsertQuestions({
        subjectId: selectedSubject,
        curriculumVersionYear: examYear,
        sourceType,
        sourceCitation,
        questions: parsedQuestions.map((q, idx) => ({
          ...q,
          topicId: `top_${selectedSubject}_01`,
          relatedKnowledgeUnitTitle: `Đề thi Word: ${parsedFileName}`,
          sourceCitation: `${sourceCitation} (${parsedFileName || 'Word Import'})`,
        })),
      });

      setSavedSuccess(true);
      showToast(`Đã lưu thành công ${res.count} câu hỏi vào CSDL MongoDB!`, 'success');
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err: any) {
      setError(`Lỗi lưu vào CSDL MongoDB: ${err.message}`);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const sampleTemplateText = `Câu 1. (Nhận biết - 4 phương án)
Theo quy định của Hiệp định Sơ bộ ngày 6-3-1946, quân đội Pháp được ra miền Bắc Việt Nam thay thế quân đội nào sau đây?
A. Quân Anh.
B. Quân Trung Hoa Dân quốc.
C. Quân Nhật.
D. Quân Mỹ.
Đáp án: B
Lời giải: Hiệp định Sơ bộ (6-3-1946) cho phép 15.000 quân Pháp ra miền Bắc thay thế quân đội Trung Hoa Dân quốc giải giáp quân Nhật.

Câu 2. (Thông hiểu - Đúng/Sai 4 ý GDPT 2018)
Đọc đoạn tư liệu sau đây về thắng lợi của Cách mạng tháng Tám năm 1945:
"Cách mạng tháng Tám năm 1945 là một sự kiện lịch sử vĩ đại, đã đập tan ách thống trị của thực dân Pháp và phát xít Nhật, lật đổ chế độ quân chủ chuyên chế hàng nghìn năm, lập nên nước Việt Nam Dân chủ Cộng hòa."
a) Cách mạng tháng Tám năm 1945 đã lật đổ hoàn toàn cả phát xít Nhật và chế độ phong kiến.
b) Nước Việt Nam Dân chủ Cộng hòa là nhà nước công nông đầu tiên ở Đông Nam Á.
c) Thắng lợi này chủ yếu dựa vào sự giúp đỡ trực tiếp của quân Đồng minh ngoài biên giới.
d) Sự lãnh đạo sáng suốt của Đảng Cộng sản Đông Dương là nhân tố quyết định nhất của thắng lợi.
Đáp án: a - Đúng, b - Đúng, c - Sai, d - Đúng
Lời giải: 
- Ý a đúng vì đã lật đổ thực dân Pháp, phát xít Nhật và vua Bảo Đại thoái vị.
- Ý b đúng theo tính chất nhà nước dân chủ nhân dân đầu tiên trong khu vực.
- Ý c sai vì sức mạnh nội lực của khối đại đoàn kết toàn dân là nhân tố chủ yếu, quyết định nhất.
- Ý d đúng vì đường lối chỉ đạo đúng đắn của Đảng và Hồ Chí Minh là nhân tố giữ vai trò quyết định.`;

  const copySampleToClipboard = () => {
    navigator.clipboard.writeText(sampleTemplateText);
    showToast('Đã sao chép định dạng mẫu Word vào clipboard!', 'info');
  };

  const filteredQuestions = parsedQuestions.filter((q) => {
    if (filterType === 'ALL') return true;
    return q.questionType === filterType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Import Đề Thi từ File Word (.docx)</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  MongoDB Direct
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                Tự động nhận diện cấu trúc GDPT 2018: Trắc nghiệm 4 lựa chọn, Đúng/Sai 4 ý, Trả lời ngắn & Lời giải.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-2 gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Tải lên file Word (.docx)
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Dán văn bản trực tiếp
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'template'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Xem Cấu trúc Mẫu Word chuẩn
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 text-center transition-colors bg-zinc-50 dark:bg-zinc-850">
                <input
                  type="file"
                  id="word-file-input"
                  accept=".docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="word-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      {file ? file.name : 'Kéo thả hoặc nhấp để chọn file Word đề thi (.docx)'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Hỗ trợ định dạng Microsoft Word OpenXML (.docx). Tối đa 25MB.
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-colors">
                    {file ? 'Chọn file khác' : 'Chọn file từ máy tính'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleParseFile}
                  disabled={!file || loading}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Trích xuất câu hỏi từ file Word</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Direct Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Dán nội dung đề thi (sao chép từ file Word):
                </label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Dán nội dung các câu hỏi tại đây... Ví dụ:&#10;Câu 1. ...&#10;A. ...&#10;B. ...&#10;C. ...&#10;D. ...&#10;Đáp án: A&#10;Lời giải: ..."
                  className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setRawText(sampleTemplateText)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Điền văn bản mẫu thử nghiệm
                </button>
                <button
                  onClick={handleParseText}
                  disabled={!rawText.trim() || loading}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Phân tích văn bản</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Template Instructions */}
          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                    Cấu trúc văn bản Word chuẩn được hệ thống hỗ trợ:
                  </h4>
                  <button
                    onClick={copySampleToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mẫu</span>
                  </button>
                </div>
                <pre className="text-[11px] leading-relaxed font-mono p-3 rounded-xl bg-zinc-900 text-zinc-200 overflow-x-auto">
                  {sampleTemplateText}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                    1. Trắc nghiệm 4 lựa chọn
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    Bắt đầu bằng "Câu X.", các phương án A., B., C., D. và dòng "Đáp án: X".
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    2. Đúng / Sai 4 ý (GDPT 2018)
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    Gồm đoạn tư liệu dẫn và 4 phát biểu a), b), c), d). Kèm đáp án "a - Đúng, b - Sai...".
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                    3. Lời giải chi tiết
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    Hỗ trợ dòng "Lời giải:" hoặc "Hướng dẫn giải:" để thí sinh xem sau khi nộp bài.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PARSED RESULTS SECTION */}
          {parsedQuestions.length > 0 && (
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                      Đã trích xuất: {parsedQuestions.length} câu hỏi hợp lệ
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Nguồn file: <span className="font-medium text-zinc-800 dark:text-zinc-200">{parsedFileName}</span>
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterType('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      filterType === 'ALL'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    Tất cả ({parsedQuestions.length})
                  </button>
                  <button
                    onClick={() => setFilterType('SINGLE_CHOICE')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      filterType === 'SINGLE_CHOICE'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    4 Phương án ({parsedQuestions.filter((q) => q.questionType === 'SINGLE_CHOICE').length})
                  </button>
                  <button
                    onClick={() => setFilterType('TRUE_FALSE')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      filterType === 'TRUE_FALSE'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    Đúng / Sai 4 ý ({parsedQuestions.filter((q) => q.questionType === 'TRUE_FALSE').length})
                  </button>
                </div>
              </div>

              {/* Metadata selection for saving */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Môn thi gán vào CSDL
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  >
                    <option value="van">Ngữ văn</option>
                    <option value="su">Lịch sử</option>
                    <option value="dia">Địa lí</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Năm áp dụng
                  </label>
                  <select
                    value={examYear}
                    onChange={(e) => setExamYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  >
                    <option value={2026}>Kỳ thi 2026</option>
                    <option value={2027}>Kỳ thi 2027</option>
                    <option value={2028}>Kỳ thi 2028</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Phân loại nguồn
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as ContentSourceType)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  >
                    <option value="OFFICIAL">Chính thức (Bộ GD&ĐT)</option>
                    <option value="EDITORIAL">Ban chuyên môn thẩm định</option>
                    <option value="PRACTICE">Đề thi khảo sát / Trường chuyên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Trích dẫn nguồn
                  </label>
                  <input
                    type="text"
                    value={sourceCitation}
                    onChange={(e) => setSourceCitation(e.target.value)}
                    placeholder="VD: Đề thi thử THPT Chuyên"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium dark:text-white"
                  />
                </div>
              </div>

              {/* Questions List Preview */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                          Câu {idx + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.questionType === 'TRUE_FALSE'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {q.questionType === 'TRUE_FALSE' ? 'ĐÚNG / SAI 4 Ý' : '4 PHƯƠNG ÁN LỰA CHỌN'}
                        </span>
                      </div>
                      {q.correctAnswer && (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          Đáp án: {q.correctAnswer}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium mb-3 whitespace-pre-line">
                      {q.content}
                    </p>

                    {/* True/False Statements */}
                    {q.questionType === 'TRUE_FALSE' && q.trueFalseStatements && (
                      <div className="space-y-1.5 pl-3 border-l-2 border-amber-400 mb-2">
                        {q.trueFalseStatements.map((stmt, sIdx) => (
                          <div key={sIdx} className="text-xs flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                            <span>
                              <span className="font-bold uppercase mr-1">{stmt.label})</span>
                              {stmt.statement}
                            </span>
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                stmt.isCorrect
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700'
                              }`}
                            >
                              {stmt.isCorrect ? 'ĐÚNG' : 'SAI'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Single choice options */}
                    {q.questionType === 'SINGLE_CHOICE' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-3 border-l-2 border-blue-400 mb-2">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`text-xs p-1.5 rounded-lg flex items-center gap-1.5 ${
                              q.correctAnswer === opt.label
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                                : 'text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            <span className="font-bold">{opt.label}.</span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.explanation && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-xl italic">
                        💡 Lời giải: {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Save Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-zinc-500">
                  {savedSuccess ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Đã lưu vào CSDL MongoDB thành công!
                    </span>
                  ) : (
                    <span>Sẵn sàng lưu {parsedQuestions.length} câu hỏi vào kho đề MongoDB.</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setParsedQuestions([]);
                      setFile(null);
                      setRawText('');
                    }}
                    className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
                  >
                    Xóa kết quả
                  </button>
                  <button
                    onClick={handleSaveToDatabase}
                    disabled={isSavingToDb || savedSuccess}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isSavingToDb ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>{savedSuccess ? 'Đã lưu vào MongoDB' : 'Lưu vào CSDL MongoDB'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
