import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MongoService, generateObjectId } from '../../services/mongoStorage';
import { ApiService } from '../../services/api';
import {
  QuestionDoc,
  TopicDoc,
  CurriculumVersionDoc,
  ExamSpecificationDoc,
  SubjectId,
  QuestionType,
  DifficultyLevel,
  CompetencyType,
  ContentSourceType,
  ContentStatus,
} from '../../types/database';
import {
  Database,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Sparkles,
  Check,
  X,
  FileText,
  Layers,
  ArrowRight,
  Server,
  Activity,
} from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const { showToast, setWordImportModalOpen } = useApp();

  const [activeTab, setActiveTab] = useState<'questions' | 'topics' | 'versions' | 'specs' | 'db_raw'>('questions');

  const [questions, setQuestions] = useState<QuestionDoc[]>(() => MongoService.getQuestions());
  const [topics, setTopics] = useState<TopicDoc[]>(() => MongoService.getTopics());
  const [versions, setVersions] = useState<CurriculumVersionDoc[]>(() => MongoService.getCurriculumVersions());
  const [specs, setSpecs] = useState<ExamSpecificationDoc[]>(() => MongoService.getExamSpecifications());
  const [dbStatus, setDbStatus] = useState<{ isMongoConnected: boolean; databaseEngine: string; uri: string } | null>(null);

  const reloadData = () => {
    setQuestions(MongoService.getQuestions());
    setTopics(MongoService.getTopics());
    setVersions(MongoService.getCurriculumVersions());
    setSpecs(MongoService.getExamSpecifications());
    ApiService.getDatabaseStatus().then(setDbStatus).catch(() => {});
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Simple state for creating a new question
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuestionDoc> | null>(null);

  // Simple state for new curriculum version
  const [newVersionYear, setNewVersionYear] = useState<number>(2028);
  const [newVersionTitle, setNewVersionTitle] = useState<string>('Kỳ thi Tốt nghiệp THPT 2028');

  const handleSaveQuestion = () => {
    if (!editingQuestion || !editingQuestion.content?.trim()) {
      showToast('Nội dung câu hỏi không được để trống', 'warning');
      return;
    }

    const questionToSave: QuestionDoc = {
      _id: editingQuestion._id || generateObjectId(),
      subjectId: editingQuestion.subjectId || 'van',
      curriculumVersionYear: editingQuestion.curriculumVersionYear || 2027,
      topicId: editingQuestion.topicId || (topics[0]?._id ?? 'top_van_01'),
      knowledgeUnitId: editingQuestion.knowledgeUnitId || 'ku_van_01',
      competency: editingQuestion.competency || 'RECOGNITION',
      questionType: editingQuestion.questionType || 'SINGLE_CHOICE',
      difficulty: editingQuestion.difficulty || 'NHAN_BIET',
      content: editingQuestion.content,
      options: editingQuestion.options || [
        { id: '1', label: 'A', text: 'Phương án A' },
        { id: '2', label: 'B', text: 'Phương án B' },
        { id: '3', label: 'C', text: 'Phương án C' },
        { id: '4', label: 'D', text: 'Phương án D' },
      ],
      correctAnswer: editingQuestion.correctAnswer || 'A',
      explanation: editingQuestion.explanation || 'Giải thích chuẩn theo đáp án.',
      relatedKnowledgeUnitTitle: editingQuestion.relatedKnowledgeUnitTitle || 'Kiến thức cốt lõi',
      sourceType: editingQuestion.sourceType || 'PRACTICE',
      sourceCitation: editingQuestion.sourceCitation || 'Ngân hàng đề thi tham khảo',
      status: editingQuestion.status || 'PUBLISHED',
      createdAt: editingQuestion.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MongoService.saveQuestion(questionToSave);
    setQuestions(MongoService.getQuestions());
    setEditingQuestion(null);
    showToast('Đã lưu câu hỏi vào cơ sở dữ liệu MongoDB!', 'success');
  };

  const handleDeleteQuestion = (id: string) => {
    MongoService.deleteQuestion(id);
    setQuestions(MongoService.getQuestions());
    showToast('Đã xóa câu hỏi', 'info');
  };

  const handleAddVersion = () => {
    const newVer: CurriculumVersionDoc = {
      _id: generateObjectId(),
      curriculumId: 'curr_gdpt2018',
      versionYear: newVersionYear,
      title: newVersionTitle,
      notes: 'Phiên bản bổ sung không phá vỡ dữ liệu các năm cũ.',
      isCurrent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MongoService.saveCurriculumVersion(newVer);
    setVersions(MongoService.getCurriculumVersions());
    showToast(`Đã thêm Version ${newVersionYear}`, 'success');
  };

  const handleResetDb = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục cơ sở dữ liệu về dữ liệu gốc mặc định?')) {
      MongoService.resetDatabase();
      setQuestions(MongoService.getQuestions());
      setTopics(MongoService.getTopics());
      setVersions(MongoService.getCurriculumVersions());
      setSpecs(MongoService.getExamSpecifications());
      showToast('Đã khôi phục dữ liệu gốc thành công!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <span>Quản trị Hệ thống EdTech</span>
            <span aria-hidden="true">·</span>
            <span>MongoDB Collections Manager</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin CMS & Curriculum Versioning
          </h1>
          <p className="text-xs text-slate-500">
            Quản trị ngân hàng câu hỏi, phiên bản chương trình GDPT, quy cách cấu trúc kỳ thi và phân loại nguồn tư liệu minh bạch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {dbStatus && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className={`w-2 h-2 rounded-full ${dbStatus.isMongoConnected ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {dbStatus.databaseEngine}
              </span>
            </div>
          )}

          <button
            onClick={handleResetDb}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'questions'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Ngân hàng câu hỏi ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'topics'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Chuyên đề ({topics.length})
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'versions'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Phiên bản GDPT ({versions.length})
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'specs'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Quy cách Đề thi ({specs.length})
        </button>
      </div>

      {/* Tab: QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Danh sách câu hỏi trong MongoDB Collection: `questions`
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWordImportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Import file Word (.docx)
              </button>
              <button
                onClick={() =>
                  setEditingQuestion({
                    subjectId: 'van',
                    questionType: 'SINGLE_CHOICE',
                    difficulty: 'NHAN_BIET',
                    competency: 'RECOGNITION',
                    sourceType: 'PRACTICE',
                    status: 'PUBLISHED',
                    content: '',
                    correctAnswer: 'A',
                    explanation: '',
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Thêm câu hỏi mới
              </button>
            </div>
          </div>

          {/* Edit/Create Modal in Place */}
          {editingQuestion && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {editingQuestion._id ? 'Chỉnh sửa câu hỏi' : 'Tạo mới câu hỏi'}
                </h3>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Môn học</label>
                  <select
                    value={editingQuestion.subjectId || 'van'}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, subjectId: e.target.value as SubjectId })
                    }
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg"
                  >
                    <option value="van">Ngữ văn</option>
                    <option value="su">Lịch sử</option>
                    <option value="dia">Địa lí</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Định dạng câu hỏi</label>
                  <select
                    value={editingQuestion.questionType || 'SINGLE_CHOICE'}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        questionType: e.target.value as QuestionType,
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg"
                  >
                    <option value="SINGLE_CHOICE">Nhiều lựa chọn (Single Choice)</option>
                    <option value="TRUE_FALSE">Đúng / Sai 4 ý (GDPT 2018)</option>
                    <option value="SHORT_ANSWER">Trả lời ngắn</option>
                    <option value="ESSAY">Tự luận kèm rubric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Nguồn nội dung</label>
                  <select
                    value={editingQuestion.sourceType || 'PRACTICE'}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        sourceType: e.target.value as ContentSourceType,
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg"
                  >
                    <option value="OFFICIAL">OFFICIAL (Chính thức)</option>
                    <option value="EDITORIAL">EDITORIAL (Biên soạn chuẩn)</option>
                    <option value="PRACTICE">PRACTICE (Luyện tập)</option>
                    <option value="DEMO">DEMO (Mô phỏng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Nội dung câu hỏi</label>
                <textarea
                  rows={3}
                  value={editingQuestion.content || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, content: e.target.value })
                  }
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border rounded-lg"
                  placeholder="Nhập nội dung câu hỏi..."
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Đáp án đúng</label>
                <input
                  type="text"
                  value={editingQuestion.correctAnswer || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                  }
                  className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg"
                  placeholder="Ví dụ: A hoặc từ khóa ngắn..."
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Giải thích chi tiết</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                  }
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border rounded-lg"
                  placeholder="Giải thích vì sao chọn đáp án này..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 border rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Lưu vào Database
                </button>
              </div>
            </div>
          )}

          {/* Questions Table */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="p-3">Môn</th>
                  <th className="p-3">Định dạng</th>
                  <th className="p-3">Nội dung câu hỏi</th>
                  <th className="p-3">Độ khó</th>
                  <th className="p-3">Nguồn</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="p-3 font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                      {q.subjectId}
                    </td>
                    <td className="p-3 text-slate-500">{q.questionType}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-white max-w-md line-clamp-1">
                      {q.content}
                    </td>
                    <td className="p-3 text-slate-500">{q.difficulty}</td>
                    <td className="p-3">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {q.sourceType}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: TOPICS */}
      {activeTab === 'topics' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">
            Danh sách chuyên đề theo môn học
          </h2>
          <div className="space-y-3">
            {topics.map((t) => (
              <div
                key={t._id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                      {t.subjectId}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{t.category}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {t.title}
                  </div>
                  <p className="text-slate-500 mt-1">{t.description}</p>
                </div>
                <span className="text-slate-400 font-mono">~{t.estimatedMinutes} phút</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: CURRICULUM VERSIONS */}
      {activeTab === 'versions' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Curriculum Versioning System (Không hard-code vào Frontend)
            </h2>
            <p className="text-xs text-slate-500">
              Khi cấu trúc thi thay đổi trong tương lai, Admin có thể tạo phiên bản mới mà không làm hỏng dữ liệu các khóa trước.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border text-xs">
            <input
              type="number"
              value={newVersionYear}
              onChange={(e) => setNewVersionYear(parseInt(e.target.value))}
              className="p-2 border rounded-lg w-28 bg-white dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={newVersionTitle}
              onChange={(e) => setNewVersionTitle(e.target.value)}
              className="p-2 border rounded-lg flex-1 bg-white dark:bg-slate-900"
              placeholder="Tên phiên bản kỳ thi..."
            />
            <button
              onClick={handleAddVersion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 whitespace-nowrap"
            >
              Thêm Version Mới
            </button>
          </div>

          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver._id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      Năm {ver.versionYear}
                    </span>
                    {ver.isCurrent && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
                        Áp dụng hiện hành
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-1">
                    {ver.title}
                  </div>
                  <p className="text-slate-500">{ver.notes}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  {new Date(ver.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: EXAM SPECIFICATIONS */}
      {activeTab === 'specs' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">
            Quy cách Cấu trúc Đề thi Tốt nghiệp THPT (Exam Specifications)
          </h2>
          <div className="space-y-4">
            {specs.map((sp) => (
              <div
                key={sp._id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {sp.code} (Năm {sp.year})
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {sp.sourceType}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{sp.description}</p>
                <div className="text-[11px] text-slate-400">
                  Căn cứ pháp lý: {sp.officialDocumentRef}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {sp.subjectsMeta.map((m) => (
                    <div
                      key={m.subjectId}
                      className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <div className="font-bold uppercase text-slate-900 dark:text-white">
                        {m.subjectId === 'van' ? 'Ngữ văn' : m.subjectId === 'su' ? 'Lịch sử' : 'Địa lí'}
                      </div>
                      <div className="text-slate-500">
                        {m.isMandatoryInNationalExam ? 'Bắt buộc cùng Toán' : 'Tự chọn'}
                      </div>
                      <div className="text-slate-500 font-mono">
                        {m.totalQuestions} câu · {m.durationMinutes} phút
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{m.structureNote}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
