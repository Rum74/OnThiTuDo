import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEED_GEO_DATASETS, GeoDatasetItem } from '../../data/seedData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  BarChart3,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const GeographyLab: React.FC = () => {
  const [datasets] = useState<GeoDatasetItem[]>(SEED_GEO_DATASETS);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0].id);
  const [selectedChartType, setSelectedChartType] = useState<'area' | 'bar' | 'line' | 'pie' | 'combination'>('area');
  const [userObservation, setUserObservation] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const currentDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  const handleDatasetChange = (id: string) => {
    setSelectedDatasetId(id);
    const ds = datasets.find((d) => d.id === id);
    if (ds) {
      setSelectedChartType(ds.recommendedChartType);
    }
    setShowExplanation(false);
    setUserObservation('');
  };

  // Prepare Pie Chart data from the latest year if pie is selected
  const latestDataPoint = currentDataset.data[currentDataset.data.length - 1];
  const pieData = Object.entries(latestDataPoint)
    .filter(([key]) => key !== 'year')
    .map(([key, value]) => ({
      name: key,
      value: Number(value),
    }));

  // Keys for Line / Area / Bar
  const dataKeys = Object.keys(currentDataset.data[0]).filter((k) => k !== 'year');

  const isRecommended = selectedChartType === currentDataset.recommendedChartType;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span>Module Địa lí</span>
            <span aria-hidden="true">·</span>
            <span>Geography Chart Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Phòng Thí Nghiệm Biểu Đồ & Dữ Liệu Địa Lí
          </h1>
          <p className="text-xs text-slate-500">
            Rèn luyện kỹ năng xử lý số liệu, nhận diện quy luật chuyển dịch cơ cấu và tránh bẫy vẽ sai dạng biểu đồ.
          </p>
        </div>

        {/* Dataset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Bộ số liệu mẫu:</span>
          <select
            value={selectedDatasetId}
            onChange={(e) => handleDatasetChange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
          >
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-Column Lab Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Chart Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  {currentDataset.title}
                </h2>
                <div className="text-xs text-slate-400">
                  Đơn vị: {currentDataset.unit} · Nguồn: {currentDataset.source}
                </div>
              </div>

              {/* Chart Type Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {(['area', 'bar', 'line', 'pie', 'combination'] as const).map((type) => {
                  const labelMap = {
                    area: 'Miền',
                    bar: 'Cột',
                    line: 'Đường',
                    pie: 'Tròn',
                    combination: 'Kết hợp',
                  };
                  const isCur = selectedChartType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedChartType(type)}
                      className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                        isCur
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {labelMap[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Validation Callout for Chart Choice */}
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                isRecommended
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {isRecommended ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong>{isRecommended ? 'Dạng biểu đồ tối ưu!' : 'Lưu ý sư phạm:'} </strong>
                {isRecommended
                  ? currentDataset.explanation
                  : `Dạng biểu đồ chuẩn nhất cho bảng số liệu này theo định dạng thi tốt nghiệp là biểu đồ ${
                      currentDataset.recommendedChartType === 'area'
                        ? 'Miền'
                        : currentDataset.recommendedChartType === 'combination'
                        ? 'Kết hợp Cột và Đường'
                        : 'Cột'
                    }. Lý do: ${currentDataset.explanation}`}
              </div>
            </div>

            {/* Dynamic Chart Render Container */}
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChartType === 'area' ? (
                  <AreaChart data={currentDataset.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    {dataKeys.map((key, i) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={COLORS[i % COLORS.length]}
                        fill={COLORS[i % COLORS.length]}
                        fillOpacity={0.6}
                      />
                    ))}
                  </AreaChart>
                ) : selectedChartType === 'bar' ? (
                  <BarChart data={currentDataset.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    {dataKeys.map((key, i) => (
                      <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                ) : selectedChartType === 'line' ? (
                  <LineChart data={currentDataset.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    {dataKeys.map((key, i) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                ) : selectedChartType === 'combination' ? (
                  <ComposedChart data={currentDataset.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" stroke="#888888" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#888888" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    {dataKeys[0] && (
                      <Bar yAxisId="left" dataKey={dataKeys[0]} fill="#6366F1" radius={[4, 4, 0, 0]} />
                    )}
                    {dataKeys[1] && (
                      <Line yAxisId="right" type="monotone" dataKey={dataKeys[1]} stroke="#10B981" strokeWidth={3} />
                    )}
                  </ComposedChart>
                ) : (
                  <PieChart>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Data Table & Geography Analysis Quiz (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Data Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Bảng số liệu chi tiết
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="p-2 font-semibold text-slate-800 dark:text-slate-200">Năm</th>
                    {dataKeys.map((k) => (
                      <th key={k} className="p-2 font-semibold text-slate-800 dark:text-slate-200">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentDataset.data.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-2 font-bold font-mono text-slate-800 dark:text-slate-200">
                        {row.year}
                      </td>
                      {dataKeys.map((k) => (
                        <td key={k} className="p-2 font-mono text-slate-600 dark:text-slate-300">
                          {row[k]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analysis Question */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
                Câu hỏi thực hành phân tích số liệu:
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentDataset.analysisQuestion}
              </p>
            </div>

            <textarea
              rows={3}
              placeholder="Gõ nhận xét hoặc giải thích của bạn vào đây trước khi mở đáp án..."
              value={userObservation}
              onChange={(e) => setUserObservation(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              {showExplanation ? 'Ẩn hướng dẫn giải' : 'Kiểm tra đáp án & Hướng giải thích'}
            </button>

            {showExplanation && (
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-300">
                  Đáp án chuẩn nhận xét:
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {currentDataset.correctAnswer}
                </p>
                <div className="pt-1 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-emerald-100 dark:border-emerald-900">
                  <strong>Phân tích bản chất: </strong>
                  {currentDataset.detailedAnalysis}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
