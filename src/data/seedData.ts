/**
 * Seed Data for OnThiTuDo
 * Explicitly marked with sources: OFFICIAL / EDITORIAL / PRACTICE / DEMO.
 * Built for CT GDPT 2018 THPT Exam Preparation (Văn - Sử - Địa).
 */

import {
  CurriculumDoc,
  CurriculumVersionDoc,
  ExamSpecificationDoc,
  SubjectDoc,
  TopicDoc,
  KnowledgeUnitDoc,
  LessonDoc,
  QuestionDoc,
  MockExamDoc,
  UserProfileDoc,
  RoadmapDoc,
  ContentSourceType,
} from '../types/database';
import {
  FULL_CURRICULUM_TOPICS,
  FULL_CURRICULUM_KNOWLEDGE_UNITS,
  FULL_CURRICULUM_LESSONS,
} from './curriculumLessons';

export const SEED_CURRICULUM: CurriculumDoc = {
  _id: 'curr_gdpt2018',
  code: 'GDPT2018',
  name: 'Chương trình Giáo dục Phổ thông 2018',
  description: 'Chương trình GDPT mới theo định hướng phát triển phẩm chất và năng lực người học.',
  sourceType: 'OFFICIAL',
  sourceReference: 'Thông tư 32/2018/TT-BGDĐT của Bộ Giáo dục và Đào tạo',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
};

export const SEED_CURRICULUM_VERSIONS: CurriculumVersionDoc[] = [
  {
    _id: 'ver_2026',
    curriculumId: 'curr_gdpt2018',
    versionYear: 2026,
    title: 'Kỳ thi Tốt nghiệp THPT 2026 (CT GDPT 2018)',
    notes: 'Áp dụng định dạng cấu trúc đề thi mới với 3 phần câu hỏi cho các môn trắc nghiệm.',
    isCurrent: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'ver_2027',
    curriculumId: 'curr_gdpt2018',
    versionYear: 2027,
    title: 'Kỳ thi Tốt nghiệp THPT 2027 (CT GDPT 2018)',
    notes: 'Kỳ thi tốt nghiệp THPT theo phương án thi 2 môn bắt buộc (Toán, Văn) + 2 môn tự chọn.',
    isCurrent: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
];

export const SEED_EXAM_SPECIFICATIONS: ExamSpecificationDoc[] = [
  {
    _id: 'spec_thpt_current',
    curriculumVersionId: 'ver_2027',
    code: 'THPT_2027_SPEC',
    year: 2027,
    description: 'Quy cách cấu trúc đề thi Tốt nghiệp THPT theo phương án hiện hành của Bộ GD&ĐT.',
    subjectsMeta: [
      {
        subjectId: 'van',
        isMandatoryInNationalExam: true, // Ngữ văn là môn bắt buộc cùng với Toán
        totalQuestions: 2, // Phần I: Đọc hiểu (4.0đ) & Phần II: Làm văn (6.0đ)
        durationMinutes: 120,
        scoringScale: 10.0,
        structureNote: 'Thi tự luận 120 phút. Ngữ liệu mới ngoài SGK, kiểm tra năng lực đọc hiểu và viết.',
      },
      {
        subjectId: 'su',
        isMandatoryInNationalExam: false, // Môn tự chọn
        totalQuestions: 28, // Phần I: 24 câu trắc nghiệm nhiều lựa chọn + Phần II: 4 câu đúng/sai (16 ý)
        durationMinutes: 50,
        scoringScale: 10.0,
        structureNote: 'Môn tự chọn. Trắc nghiệm định dạng mới: Phần I (24 câu nhiều lựa chọn) + Phần II (4 câu đúng/sai).',
      },
      {
        subjectId: 'dia',
        isMandatoryInNationalExam: false, // Môn tự chọn
        totalQuestions: 28,
        durationMinutes: 50,
        scoringScale: 10.0,
        structureNote: 'Môn tự chọn. Trắc nghiệm định dạng mới: Phần I (24 câu nhiều lựa chọn) + Phần II (4 câu đúng/sai) + Bảng số liệu & biểu đồ.',
      },
    ],
    sourceType: 'OFFICIAL',
    officialDocumentRef: 'Quyết định 4068/QĐ-BGDĐT phê duyệt Phương án tổ chức Kỳ thi và công nhận tốt nghiệp THPT từ năm 2025',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
];

export const SEED_SUBJECTS: SubjectDoc[] = [
  {
    _id: 'sub_van',
    subjectId: 'van',
    name: 'Ngữ văn',
    badge: 'Môn thi Bắt buộc (cùng với Toán)',
    accentColor: 'purple',
    bannerImage: '/src/assets/images/subject_van_lit_1790866951601.jpg',
    examType: 'Tự luận',
    durationMinutes: 120,
    isMandatoryNationalExam: true,
    roleExplanation: 'Ngữ văn là 1 trong 2 môn thi bắt buộc của kỳ thi Tốt nghiệp THPT (Toán & Ngữ văn). Đề thi tự luận 120 phút với ngữ liệu mở, đòi hỏi tư duy phân tích và diễn đạt độc lập thay vì ghi nhớ máy móc văn mẫu.',
    targetTips: 'Tránh học vẹt văn mẫu. Nắm chắc phương pháp đọc hiểu thể loại và kỹ năng lập luận nghị luận xã hội/văn học theo chuẩn rubric GDPT 2018.',
    order: 1,
  },
  {
    _id: 'sub_su',
    subjectId: 'su',
    name: 'Lịch sử',
    badge: 'Môn thi Tự chọn',
    accentColor: 'amber',
    bannerImage: '/src/assets/images/subject_su_history_1790866964605.jpg',
    examType: 'Trắc nghiệm định dạng mới',
    durationMinutes: 50,
    isMandatoryNationalExam: false,
    roleExplanation: 'Lịch sử là môn tự chọn trong tổ hợp xét tuyển/tốt nghiệp. Đề thi gồm trắc nghiệm nhiều phương án lựa chọn và dạng câu hỏi Đúng/Sai dựa trên tư liệu lịch sử.',
    targetTips: 'Học theo chuỗi tư duy nhân - quả, liên hệ bối cảnh không gian thời gian thay vì cố nhồi nhét mốc sự kiện đơn lẻ. Đặc biệt chú trọng kỹ năng phân tích trích đoạn tư liệu.',
    order: 2,
  },
  {
    _id: 'sub_dia',
    subjectId: 'dia',
    name: 'Địa lí',
    badge: 'Môn thi Tự chọn',
    accentColor: 'emerald',
    bannerImage: '/src/assets/images/subject_dia_geography_1790866981872.jpg',
    examType: 'Trắc nghiệm định dạng mới',
    durationMinutes: 50,
    isMandatoryNationalExam: false,
    roleExplanation: 'Địa lí là môn tự chọn. Đề thi đánh giá năng lực thực hành địa lí: đọc hiểu bản đồ/Atlat, tính toán bảng số liệu và nhận dạng phân tích biểu đồ.',
    targetTips: 'Làm chủ các công thức tính toán địa lí (mật độ dân số, năng suất, bình quân đầu người, cơ cấu %) và quy luật nhận diện dạng biểu đồ đặc trưng.',
    order: 3,
  },
];

export const SEED_TOPICS: TopicDoc[] = FULL_CURRICULUM_TOPICS;

export const SEED_KNOWLEDGE_UNITS: KnowledgeUnitDoc[] = FULL_CURRICULUM_KNOWLEDGE_UNITS;

export const SEED_LESSONS: LessonDoc[] = FULL_CURRICULUM_LESSONS;

export const SEED_QUESTIONS: QuestionDoc[] = [
  // NGỮ VĂN - SINGLE_CHOICE (Đọc hiểu)
  {
    _id: 'q_van_01',
    subjectId: 'van',
    curriculumVersionYear: 2027,
    topicId: 'top_van_01',
    knowledgeUnitId: 'ku_van_01',
    competency: 'RECOGNITION',
    questionType: 'SINGLE_CHOICE',
    difficulty: 'NHAN_BIET',
    stimulusData: {
      textPassage: `“Thời gian là dòng sông chảy xiết, không bao giờ quay trở lại. Nhưng những gì bạn gieo trồng bên bờ sông của cuộc đời – lòng nhân ái, sự nỗ lực bền bỉ và trách nhiệm với cộng đồng – sẽ nở hoa và tỏa hương qua năm tháng.”`,
      authorOrSource: 'Trích "Bài học từ sự tĩnh lặng", NXB Tri Thức',
    },
    content: 'Xác định phương thức biểu đạt chính được sử dụng trong đoạn trích trên.',
    options: [
      { id: 'opt_1', label: 'A', text: 'Tự sự' },
      { id: 'opt_2', label: 'B', text: 'Nghị luận' },
      { id: 'opt_3', label: 'C', text: 'Thuyết minh' },
      { id: 'opt_4', label: 'D', text: 'Miêu tả' },
    ],
    correctAnswer: 'B',
    explanation: 'Đoạn trích bộc lộ luận điểm, bàn luận về ý nghĩa của lối sống trách nhiệm và nhân ái trước sự trôi chảy của thời gian, nhằm thuyết phục người đọc. Do đó phương thức biểu đạt chính là Nghị luận.',
    relatedKnowledgeUnitTitle: 'Xác định Phương thức biểu đạt & Phong cách ngôn ngữ',
    sourceType: 'PRACTICE',
    sourceCitation: 'Đề luyện đọc hiểu định dạng chuẩn GDPT 2018',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // NGỮ VĂN - SHORT_ANSWER (Nhận diện biện pháp tu từ)
  {
    _id: 'q_van_02',
    subjectId: 'van',
    curriculumVersionYear: 2027,
    topicId: 'top_van_02',
    knowledgeUnitId: 'ku_van_01',
    competency: 'COMPREHENSION',
    questionType: 'SHORT_ANSWER',
    difficulty: 'THONG_HIEU',
    stimulusData: {
      textPassage: `“Thời gian là dòng sông chảy xiết, không bao giờ quay trở lại.”`,
      authorOrSource: 'Trích ngữ liệu đọc hiểu',
    },
    content: 'Chỉ ra biện pháp tu từ ngữ nghĩa nổi bật được sử dụng trong câu văn trên (Điền tên biện pháp tu từ vào ô trống).',
    correctAnswer: 'so sánh',
    explanation: 'Câu văn sử dụng biện pháp tu từ So sánh ("Thời gian là dòng sông chảy xiết") với từ so sánh là "là", giúp cụ thể hóa khái niệm trừu tượng "thời gian" thành hình ảnh trực quan sinh động.',
    relatedKnowledgeUnitTitle: 'Tiếng Việt trong Ngữ cảnh & Biện pháp Tu từ',
    sourceType: 'PRACTICE',
    sourceCitation: 'Ngân hàng câu hỏi Tiếng Việt ứng dụng',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // NGỮ VĂN - ESSAY (Nghị luận xã hội kèm rubric)
  {
    _id: 'q_van_03',
    subjectId: 'van',
    curriculumVersionYear: 2027,
    topicId: 'top_van_03',
    knowledgeUnitId: 'ku_van_02',
    competency: 'CRITICAL_ARGUMENT',
    questionType: 'ESSAY',
    difficulty: 'VAN_DUNG',
    stimulusData: {
      textPassage: `“Người duy nhất có thể ngăn cản bạn tiến về phía trước chính là sự do dự trong tâm trí bạn.”`,
      authorOrSource: 'Trích danh ngôn phát triển bản thân',
    },
    content: 'Từ câu nói trong phần đọc hiểu, hãy viết một đoạn văn (khoảng 200 chữ) trình bày suy nghĩ của bạn về sự cần thiết của lòng dũng cảm vượt qua nỗi sợ thất bại ở người trẻ hôm nay.',
    essayRubric: {
      maxScore: 2.0,
      criteria: [
        { name: 'Yêu cầu về hình thức đoạn văn', weight: 0.25, guide: 'Đảm bảo đúng hình thức 01 đoạn văn, dung lượng khoảng 200 chữ, không tách đoạn.' },
        { name: 'Xác định đúng vấn đề cần nghị luận', weight: 0.25, guide: 'Xác định rõ ràng: Sự cần thiết của lòng dũng cảm vượt qua nỗi sợ thất bại.' },
        { name: 'Triển khai luận điểm và lập luận', weight: 1.0, guide: 'Giải thích nỗi sợ thất bại; phân tích lý do cần vượt qua (giúp bứt phá giới hạn, tích lũy bài học); dẫn chứng xác thực; phản đề.' },
        { name: 'Chính tả, dùng từ, đặt câu', weight: 0.25, guide: 'Không mắc lỗi chính tả, diễn đạt mạch lạc, dùng từ chuẩn xác.' },
        { name: 'Sáng tạo và liên hệ bản thân', weight: 0.25, guide: 'Có góc nhìn cá nhân sâu sắc, bài học hành động thực tế thiết thực.' },
      ],
    },
    explanation: 'Đoạn văn 200 chữ cần tuân thủ cấu trúc lập luận chặt chẽ: Nêu vấn đề -> Giải thích -> Bàn luận tác dụng của lòng dũng cảm -> Dẫn chứng thực tế -> Phản đề hiện tượng chùn bước -> Bài học hành động.',
    relatedKnowledgeUnitTitle: 'Mô hình Lập luận Đoạn văn Nghị luận Xã hội 200 chữ',
    sourceType: 'EDITORIAL',
    sourceCitation: 'Thiết kế theo chuẩn định dạng đề thi Tốt nghiệp THPT GDPT 2018',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // LỊCH SỬ - SINGLE_CHOICE
  {
    _id: 'q_su_01',
    subjectId: 'su',
    curriculumVersionYear: 2027,
    topicId: 'top_su_02',
    knowledgeUnitId: 'ku_su_01',
    competency: 'RECOGNITION',
    questionType: 'SINGLE_CHOICE',
    difficulty: 'NHAN_BIET',
    content: 'Trong Cách mạng tháng Tám năm 1945 ở Việt Nam, sự kiện nào sau đây đánh dấu thời cơ ngàn năm có một bắt đầu xuất hiện trên thực tế?',
    options: [
      { id: 'opt_1', label: 'A', text: 'Mặt trận Việt Minh ra đời tại Pác Bó (Cao Bằng)' },
      { id: 'opt_2', label: 'B', text: 'Nhật Bản tuyên bố đầu hàng Đồng minh không điều kiện' },
      { id: 'opt_3', label: 'C', text: 'Hội nghị toàn quốc của Đảng họp tại Tân Trào' },
      { id: 'opt_4', label: 'D', text: 'Vua Bảo Đại tuyên bố thoái vị tại Huế' },
    ],
    correctAnswer: 'B',
    explanation: 'Ngày 15/8/1945, Nhật hoàng tuyên bố đầu hàng Đồng minh không điều kiện. Sự kiện này khiến quân phiệt Nhật ở Đông Dương hoàn toàn tê liệt, mở ra thời cơ khởi nghĩa thuận lợi nhất.',
    relatedKnowledgeUnitTitle: 'Thời cơ Cách mạng Tháng Tám năm 1945',
    sourceType: 'OFFICIAL',
    sourceCitation: 'Kiến thức chuẩn Lịch sử lớp 12 GDPT 2018',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // LỊCH SỬ - TRUE_FALSE (Định dạng GDPT 2018: 4 ý a, b, c, d)
  {
    _id: 'q_su_02',
    subjectId: 'su',
    curriculumVersionYear: 2027,
    topicId: 'top_su_03',
    knowledgeUnitId: 'ku_su_02',
    competency: 'SOURCE_ANALYSIS',
    questionType: 'TRUE_FALSE',
    difficulty: 'THONG_HIEU',
    stimulusData: {
      textPassage: `“Điện Biên Phủ là tập đoàn cứ điểm mạnh nhất Đông Dương của quân viễn chinh Pháp, được mệnh danh là 'pháo đài bất khả xâm phạm'. Tại đây, Bộ Tổng Tư lệnh Quân đội nhân dân Việt Nam đã quyết định chuyển phương châm tác chiến từ 'đánh nhanh, thắng nhanh' sang 'đánh chắc, tiến chắc'. Quyết định này đã bảo toàn lực lượng và đưa chiến dịch đến toàn thắng ngày 7/5/1954.”`,
      authorOrSource: 'Trích Lịch sử Quân sự Việt Nam tập 10, NXB Quân đội Nhân dân',
    },
    content: 'Đọc đoạn tư liệu trên và đánh giá tính Đúng hoặc Sai cho mỗi nhận định sau:',
    trueFalseStatements: [
      {
        id: 'tf_1',
        label: 'a',
        statement: 'Điện Biên Phủ là tập đoàn cứ điểm đã được vạch ra ngay từ đầu trong bản Kế hoạch Nava gốc tháng 5/1953.',
        isCorrect: false,
        explanation: 'Sai. Trong kế hoạch Nava ban đầu, Điện Biên Phủ không hề có tên; chỉ sau khi ta mở các đòn tiến công chiến lược Đông - Xuân 1953 - 1954 buộc Nava phải điều quân lên Tây Bắc xây dựng Điện Biên Phủ.',
      },
      {
        id: 'tf_2',
        label: 'b',
        statement: 'Việc chuyển phương châm tác chiến sang "đánh chắc, tiến chắc" là quyết định mang tính nghệ thuật quân sự quyết định thắng lợi của chiến dịch.',
        isCorrect: true,
        explanation: 'Đúng. Đây là quyết định lịch sử khó khăn nhất trong cuộc đời chỉ huy của Đại tướng Võ Nguyên Giáp, giúp ta tránh tổn thất và đập tan từng cứ điểm của địch.',
      },
      {
        id: 'tf_3',
        label: 'c',
        statement: 'Chiến thắng Điện Biên Phủ đã trực tiếp buộc thực dân Pháp phải ký kết Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh ở Đông Dương.',
        isCorrect: true,
        explanation: 'Đúng. Chiến thắng quân sự Điện Biên Phủ giáng đòn quyết định vào ý chí xâm lược của Pháp, tạo cơ sở thực tế trên bàn đàm phán Giơ-ne-vơ.',
      },
      {
        id: 'tf_4',
        label: 'd',
        statement: 'Chiến dịch Điện Biên Phủ kết thúc thắng lợi đồng nghĩa với việc toàn bộ đất nước Việt Nam đã hoàn toàn được thống nhất về mặt lãnh thổ.',
        isCorrect: false,
        explanation: 'Sai. Sau năm 1954, đất nước ta tạm thời bị chia cắt làm hai miền theo vĩ tuyến 17; miền Bắc được giải phóng còn miền Nam tiếp tục cuộc đấu tranh giải phóng dân tộc.',
      },
    ],
    explanation: 'Cấu trúc câu hỏi Đúng/Sai GDPT 2018 đòi hỏi phân tích từng mệnh đề dựa vào tư liệu và kiến thức nền tảng lịch sử.',
    relatedKnowledgeUnitTitle: 'Chiến dịch Điện Biên Phủ 1954: Nghệ thuật quân sự đỉnh cao',
    sourceType: 'EDITORIAL',
    sourceCitation: 'Mô phỏng đề thi tham khảo tốt nghiệp THPT',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // ĐỊA LÍ - SINGLE_CHOICE (Khí hậu)
  {
    _id: 'q_dia_01',
    subjectId: 'dia',
    curriculumVersionYear: 2027,
    topicId: 'top_dia_01',
    knowledgeUnitId: 'ku_dia_01',
    competency: 'RECOGNITION',
    questionType: 'SINGLE_CHOICE',
    difficulty: 'NHAN_BIET',
    content: 'Đặc điểm nào sau đây là nguyên nhân chủ yếu làm cho tính chất nhiệt đới của khí hậu Việt Nam được bảo toàn trên toàn lãnh thổ?',
    options: [
      { id: 'opt_1', label: 'A', text: 'Nằm hoàn toàn trong vùng nội chí tuyến Bắc bán cầu' },
      { id: 'opt_2', label: 'B', text: 'Có đường bờ biển dài và tiếp giáp Biển Đông rộng lớn' },
      { id: 'opt_3', label: 'C', text: 'Địa hình nhiều đồi núi với hướng vòng cung chủ đạo' },
      { id: 'opt_4', label: 'D', text: 'Chịu ảnh hưởng trực tiếp của bão và dải hội tụ nhiệt đới' },
    ],
    correctAnswer: 'A',
    explanation: 'Nước ta nằm hoàn toàn trong vùng nội chí tuyến Bắc bán cầu nên nhận được lượng bức xạ mặt trời lớn, góc nhập xạ lớn quanh năm và mọi nơi đều có hai lần mặt trời lên thiên đỉnh, tạo nền nhiệt độ cao bảo toàn tính chất nhiệt đới.',
    relatedKnowledgeUnitTitle: 'Tính chất Nhiệt đới Ẩm Gió mùa của Thiên nhiên Việt Nam',
    sourceType: 'OFFICIAL',
    sourceCitation: 'Sách giáo khoa Địa lí 12 - GDPT 2018',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // ĐỊA LÍ - SHORT_ANSWER (Tính toán số liệu)
  {
    _id: 'q_dia_02',
    subjectId: 'dia',
    curriculumVersionYear: 2027,
    topicId: 'top_dia_03',
    knowledgeUnitId: 'ku_dia_02',
    competency: 'CHART_DATA_SKILL',
    questionType: 'SHORT_ANSWER',
    difficulty: 'VAN_DUNG',
    stimulusData: {
      dataTable: {
        headers: ['Năm', 'Diện tích (nghìn ha)', 'Sản lượng (nghìn tấn)'],
        rows: [
          ['2015', 7728, 45091],
          ['2022', 7108, 42680],
        ],
      },
    },
    content: 'Căn cứ vào bảng số liệu trên, hãy tính năng suất lúa của nước ta năm 2022 (Làm tròn kết quả đến một chữ số thập phân, đơn vị: tạ/ha).',
    correctAnswer: '60.0',
    explanation: 'Năng suất lúa = (Sản lượng x 10) / Diện tích = (42680 x 10) / 7108 ≈ 60.04 tạ/ha -> Làm tròn đến 1 chữ số thập phân là 60.0 tạ/ha.',
    relatedKnowledgeUnitTitle: 'Quy tắc Nhận diện Dạng Biểu đồ Địa lí',
    sourceType: 'PRACTICE',
    sourceCitation: 'Bài tập kỹ năng tính toán Địa lí kinh tế',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },

  // ĐỊA LÍ - TRUE_FALSE (Biểu đồ & Cơ cấu)
  {
    _id: 'q_dia_03',
    subjectId: 'dia',
    curriculumVersionYear: 2027,
    topicId: 'top_dia_03',
    knowledgeUnitId: 'ku_dia_02',
    competency: 'CHART_DATA_SKILL',
    questionType: 'TRUE_FALSE',
    difficulty: 'THONG_HIEU',
    stimulusData: {
      dataTable: {
        headers: ['Chỉ tiêu', '2010', '2015', '2020', '2024'],
        rows: [
          ['Nông, lâm, thủy sản (%)', 18.9, 17.0, 14.8, 11.9],
          ['Công nghiệp và xây dựng (%)', 38.2, 33.3, 33.7, 37.2],
          ['Dịch vụ (%)', 36.9, 39.7, 41.6, 42.5],
          ['Thuế sản phẩm trừ trợ cấp (%)', 6.0, 10.0, 9.9, 8.4],
        ],
      },
      chartConfig: {
        type: 'area',
        unit: '%',
        title: 'Cơ cấu GDP phân theo khu vực kinh tế của Việt Nam giai đoạn 2010 - 2024',
      },
    },
    content: 'Cho bảng số liệu về cơ cấu GDP phân theo khu vực kinh tế nước ta giai đoạn 2010 - 2024. Đánh giá tính Đúng hoặc Sai cho mỗi nhận định sau:',
    trueFalseStatements: [
      {
        id: 'tf_dia_1',
        label: 'a',
        statement: 'Để thể hiện sự chuyển dịch cơ cấu GDP phân theo khu vực kinh tế qua 4 năm trên, dạng biểu đồ thích hợp nhất là biểu đồ miền.',
        isCorrect: true,
        explanation: 'Đúng. Bảng số liệu thể hiện cơ cấu theo % trong thời gian 4 năm liên tiếp (từ 4 năm trở lên) nên biểu đồ miền là chuẩn xác nhất.',
      },
      {
        id: 'tf_dia_2',
        label: 'b',
        statement: 'Tỷ trọng của khu vực Nông, lâm, thủy sản có xu hướng tăng liên tục qua các năm khảo sát.',
        isCorrect: false,
        explanation: 'Sai. Tỷ trọng Nông, lâm, thủy sản giảm liên tục từ 18.9% năm 2010 xuống 11.9% năm 2024.',
      },
      {
        id: 'tf_dia_3',
        label: 'c',
        statement: 'Khu vực Dịch vụ luôn chiếm tỷ trọng cao nhất trong cơ cấu GDP ở tất cả các năm từ 2010 đến 2024.',
        isCorrect: false,
        explanation: 'Sai. Năm 2010 khu vực Công nghiệp và xây dựng chiếm tỷ trọng cao nhất (38.2%), cao hơn Dịch vụ (36.9%).',
      },
      {
        id: 'tf_dia_4',
        label: 'd',
        statement: 'Sự chuyển dịch cơ cấu GDP phản ánh quá trình công nghiệp hóa và hiện đại hóa đang diễn ra tích cực ở nước ta.',
        isCorrect: true,
        explanation: 'Đúng. Giảm tỷ trọng nông nghiệp và tăng tỷ trọng dịch vụ, công nghiệp là biểu hiện rõ nét của công nghiệp hóa, hiện đại hóa.',
      },
    ],
    explanation: 'Dạng câu hỏi đúng sai kỹ năng địa lí đòi hỏi đọc bảng số liệu, nhận diện biểu đồ chuẩn xác và hiểu bản chất chuyển dịch cơ cấu kinh tế.',
    relatedKnowledgeUnitTitle: 'Quy tắc Nhận diện Dạng Biểu đồ Địa lí',
    sourceType: 'EDITORIAL',
    sourceCitation: 'Số liệu Tổng cục Thống kê Việt Nam',
    status: 'PUBLISHED',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
];

// Seed Historical Timeline events (Interactive Timeline)
export interface HistoryEventItem {
  id: string;
  year: number;
  exactDate?: string;
  title: string;
  category: 'VIET_NAM' | 'THE_GIOI';
  era: '1945_1954' | '1954_1975' | '1975_NAY';
  summary: string;
  context: string;
  causes: string[];
  keyFigures: string[];
  resultsAndSignificance: string[];
  relatedQuestionId?: string;
  sourceType: ContentSourceType;
}

export const SEED_HISTORY_TIMELINE: HistoryEventItem[] = [
  {
    id: 'evt_1945_aug',
    year: 1945,
    exactDate: '19/08/1945',
    title: 'Cách mạng Tháng Tám thành công tại Hà Nội',
    category: 'VIET_NAM',
    era: '1945_1954',
    summary: 'Cuộc khởi nghĩa giành chính quyền tại thủ đô Hà Nội, tạo tiếng vang thúc đẩy phong trào tổng khởi nghĩa trên cả nước thắng lợi.',
    context: 'Nhật Bản tuyên bố đầu hàng Đồng minh ngày 15/8/1945. Chính quyền Trần Trọng Kim tê liệt.',
    causes: [
      'Sự chuẩn bị 15 năm chu đáo của Đảng và Mặt trận Việt Minh.',
      'Thời cơ khách quan thuận lợi khi phát xít Nhật thất bại hoàn toàn.',
      'Khối liên minh công - nông được tôi luyện qua 3 cao trào cách mạng.',
    ],
    keyFigures: ['Chủ tịch Hồ Chí Minh', 'Trường Chinh', 'Võ Nguyên Giáp'],
    resultsAndSignificance: [
      'Xóa bỏ ách thống trị hơn 80 năm của thực dân Pháp và gần 1000 năm của chế độ phong kiến.',
      'Khai sinh ra nước Việt Nam Dân chủ Cộng hòa ngày 2/9/1945.',
      'Mở ra kỷ nguyên độc lập, tự do cho dân tộc Việt Nam.',
    ],
    relatedQuestionId: 'q_su_01',
    sourceType: 'OFFICIAL',
  },
  {
    id: 'evt_1954_may',
    year: 1954,
    exactDate: '07/05/1954',
    title: 'Chiến thắng Lịch sử Điện Biên Phủ',
    category: 'VIET_NAM',
    era: '1945_1954',
    summary: 'Quân đội nhân dân Việt Nam tiêu diệt hoàn toàn tập đoàn cứ điểm Điện Biên Phủ, bắt sống tướng Đờ Cát-xtơ-ri.',
    context: 'Pháp và Mỹ triển khai Kế hoạch Nava nhằm tìm kiếm giải pháp quân sự danh dự trong vòng 18 tháng.',
    causes: [
      'Đường lối kháng chiến toàn dân, toàn diện, trường kỳ và tự lực cánh sinh.',
      'Nghệ thuật quân sự tài ba và quyết định chuyển phương châm sang "đánh chắc, tiến chắc".',
      'Sự ủng hộ to lớn của hậu phương và tinh thần quyết chiến quyết thắng của bộ đội.',
    ],
    keyFigures: ['Đại tướng Võ Nguyên Giáp', 'Tướng Đờ Cát-xtơ-ri', 'Hoàng Văn Thái'],
    resultsAndSignificance: [
      'Đập tan hoàn toàn ý chí xâm lược của thực dân Pháp.',
      'Buộc Pháp phải ký Hiệp định Giơ-ne-vơ công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam.',
      'Cổ vũ mạnh mẽ phong trào giải phóng dân tộc trên thế giới.',
    ],
    relatedQuestionId: 'q_su_02',
    sourceType: 'OFFICIAL',
  },
  {
    id: 'evt_1975_apr',
    year: 1975,
    exactDate: '30/04/1975',
    title: 'Giải phóng miền Nam, Thống nhất Đất nước',
    category: 'VIET_NAM',
    era: '1954_1975',
    summary: 'Chiến dịch Hồ Chí Minh lịch sử giành toàn thắng, lá cờ Mặt trận Dân tộc Giải phóng tung bay trên nóc Dinh Độc Lập.',
    context: 'Sau Hiệp định Pa-ri 1973, quân Mỹ rút khỏi miền Nam Việt Nam. So sánh tương quan lực lượng thay đổi căn bản có lợi cho cách mạng.',
    causes: [
      'Sự lãnh đạo sáng suốt của Bộ Chính trị với kế hoạch giải phóng hoàn toàn miền Nam trong hai năm 1975 - 1976.',
      'Sức mạnh đại đoàn kết toàn dân và tinh thần "thần tốc, táo bạo, bất ngờ, chắc thắng".',
    ],
    keyFigures: ['Đại tướng Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Lê Duẩn'],
    resultsAndSignificance: [
      'Kết thúc vẻ vang 21 năm kháng chiến chống Mỹ và 30 năm chiến tranh giải phóng dân tộc.',
      'Chấm dứt hoàn toàn ách thống trị của chủ nghĩa thực dân mới, thống nhất non sông về một mối.',
    ],
    sourceType: 'OFFICIAL',
  },
  {
    id: 'evt_1986_dec',
    year: 1986,
    exactDate: '15/12/1986',
    title: 'Đại hội Đảng lần thứ VI: Khởi xướng Công cuộc Đổi mới',
    category: 'VIET_NAM',
    era: '1975_NAY',
    summary: 'Đại hội đề ra đường lối đổi mới toàn diện, trước hết là đổi mới tư duy kinh tế, xóa bỏ cơ chế tập trung quan liêu bao cấp.',
    context: 'Đất nước lâm vào khủng hoảng kinh tế - xã hội trầm trọng do mô hình kinh tế kế hoạch hóa tập trung bộc lộ nhiều bất cập.',
    causes: [
      'Yêu cầu cấp bách cứu nguy cho nền kinh tế và đời sống nhân dân.',
      'Bài học từ thực tiễn và xu thế đổi mới, hội nhập trên thế giới.',
    ],
    keyFigures: ['Tổng Bí thư Nguyễn Văn Linh', 'Trường Chinh'],
    resultsAndSignificance: [
      'Mở đường cho sự phát triển kinh tế thị trường định hướng XHCN.',
      'Đưa Việt Nam thoát khỏi khủng hoảng, vươn lên thành nền kinh tế năng động.',
    ],
    sourceType: 'OFFICIAL',
  },
];

// Seed Geography Lab Datasets for interactive Chart Builder
export interface GeoDatasetItem {
  id: string;
  title: string;
  source: string;
  recommendedChartType: 'bar' | 'line' | 'pie' | 'area' | 'combination';
  explanation: string;
  unit: string;
  data: {
    year: string | number;
    [key: string]: any;
  }[];
  analysisQuestion: string;
  correctAnswer: string;
  detailedAnalysis: string;
}

export const SEED_GEO_DATASETS: GeoDatasetItem[] = [
  {
    id: 'geo_data_gdp_structure',
    title: 'Chuyển dịch Cơ cấu GDP Việt Nam (2010 - 2024)',
    source: 'Tổng cục Thống kê Việt Nam (Dữ liệu tham khảo)',
    recommendedChartType: 'area',
    explanation: 'Số liệu cơ cấu (đơn vị %) trong chuỗi thời gian liên tục từ 4 năm trở lên -> Biểu đồ Miền là tối ưu nhất.',
    unit: '%',
    data: [
      { year: '2010', 'Nông - Lâm - Thủy sản': 18.9, 'Công nghiệp - Xây dựng': 38.2, 'Dịch vụ': 36.9, 'Thuế sản phẩm': 6.0 },
      { year: '2015', 'Nông - Lâm - Thủy sản': 17.0, 'Công nghiệp - Xây dựng': 33.3, 'Dịch vụ': 39.7, 'Thuế sản phẩm': 10.0 },
      { year: '2020', 'Nông - Lâm - Thủy sản': 14.8, 'Công nghiệp - Xây dựng': 33.7, 'Dịch vụ': 41.6, 'Thuế sản phẩm': 9.9 },
      { year: '2024', 'Nông - Lâm - Thủy sản': 11.9, 'Công nghiệp - Xây dựng': 37.2, 'Dịch vụ': 42.5, 'Thuế sản phẩm': 8.4 },
    ],
    analysisQuestion: 'Nhận xét nào sau đây phản ánh đúng sự chuyển dịch cơ cấu ngành kinh tế nước ta?',
    correctAnswer: 'Tỷ trọng nông - lâm - thủy sản giảm dần, tỷ trọng dịch vụ tăng lên chiếm tỷ trọng lớn nhất năm 2024.',
    detailedAnalysis: 'Xu hướng giảm tỷ trọng nông nghiệp và tăng dịch vụ phù hợp với tiến trình công nghiệp hóa, hiện đại hóa và hội nhập chuỗi giá trị toàn cầu.',
  },
  {
    id: 'geo_data_rice_production',
    title: 'Diện tích và Sản lượng Lúa Nước (2015 - 2024)',
    source: 'Bộ Nông nghiệp & PTNT (Dữ liệu mẫu thực hành)',
    recommendedChartType: 'combination',
    explanation: 'Có hai đại lượng với hai đơn vị đo lường khác biệt (Nghìn ha và Nghìn tấn) -> Biểu đồ Kết hợp Cột và Đường (2 trục tung).',
    unit: 'Nghìn ha & Nghìn tấn',
    data: [
      { year: '2015', 'Diện tích (nghìn ha)': 7728, 'Sản lượng (nghìn tấn)': 45091 },
      { year: '2018', 'Diện tích (nghìn ha)': 7570, 'Sản lượng (nghìn tấn)': 44046 },
      { year: '2021', 'Diện tích (nghìn ha)': 7241, 'Sản lượng (nghìn tấn)': 43853 },
      { year: '2024', 'Diện tích (nghìn ha)': 7100, 'Sản lượng (nghìn tấn)': 43500 },
    ],
    analysisQuestion: 'Tại sao diện tích gieo trồng lúa giảm nhưng sản lượng lúa vẫn duy trì ở mức cao và ổn định?',
    correctAnswer: 'Do năng suất lúa không ngừng được nâng cao nhờ đưa giống mới, thâm canh và ứng dụng khoa học kỹ thuật.',
    detailedAnalysis: 'Mặc dù diện tích giảm do chuyển đổi đất nông nghiệp sang đô thị và nuôi trồng thủy sản, năng suất đã tăng từ khoảng 58 tạ/ha lên hơn 61 tạ/ha bù đắp cho phần diện tích thu hẹp.',
  },
];

// Seed Mock Exams
export const SEED_MOCK_EXAMS: MockExamDoc[] = [
  {
    _id: 'exam_van_01',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Môn Ngữ Văn (Đề số 01)',
    subjectId: 'van',
    curriculumVersionYear: 2027,
    year: 2027,
    durationMinutes: 120,
    totalQuestions: 3,
    description: 'Đề thi tự luận 120 phút bám sát cấu trúc đề minh họa GDPT 2018: Phần I Đọc hiểu ngữ liệu mới + Phần II Viết đoạn NLXH 200 chữ và bài NLVH.',
    questionIds: ['q_van_01', 'q_van_02', 'q_van_03'],
    sourceType: 'EDITORIAL',
    sourceCitation: 'Ban chuyên môn OnThiTuDo biên soạn chuẩn rubric 2018',
    status: 'PUBLISHED',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    _id: 'exam_su_01',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Môn Lịch Sử (Đề số 01)',
    subjectId: 'su',
    curriculumVersionYear: 2027,
    year: 2027,
    durationMinutes: 50,
    totalQuestions: 2,
    description: 'Đề thi trắc nghiệm định dạng mới: Phần I trắc nghiệm nhiều lựa chọn + Phần II trắc nghiệm Đúng/Sai từ đoạn tư liệu lịch sử.',
    questionIds: ['q_su_01', 'q_su_02'],
    sourceType: 'PRACTICE',
    sourceCitation: 'Biên soạn theo cấu trúc đề tham khảo của Bộ GD&ĐT',
    status: 'PUBLISHED',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    _id: 'exam_dia_01',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Môn Địa Lí (Đề số 01)',
    subjectId: 'dia',
    curriculumVersionYear: 2027,
    year: 2027,
    durationMinutes: 50,
    totalQuestions: 3,
    description: 'Đề thi trắc nghiệm định dạng mới: Nhận biết tự nhiên, kỹ năng tính toán bảng số liệu và phân tích chuyển dịch cơ cấu biểu đồ.',
    questionIds: ['q_dia_01', 'q_dia_02', 'q_dia_03'],
    sourceType: 'PRACTICE',
    sourceCitation: 'Biên soạn theo cấu trúc đề tham khảo của Bộ GD&ĐT',
    status: 'PUBLISHED',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
];

// Clean initial User Profile (Zero fake mock data)
export const DEFAULT_USER_PROFILE: UserProfileDoc = {
  _id: 'usr_candidate_01',
  fullName: 'Thí sinh tự do',
  email: '',
  candidateType: 'THI_SINH_TU_DO',
  examYear: 2027,
  curriculumCode: 'GDPT2018',
  enrolledSubjects: ['van', 'su', 'dia'],
  targetScores: { van: 7.0, su: 7.0, dia: 7.0 },
  currentEstimatedScores: { van: 0, su: 0, dia: 0 },
  dailyStudyTimeMinutes: 60,
  streakDays: 0,
  totalStudyMinutes: 0,
  hasCompletedOnboarding: false,
  hasCompletedDiagnostic: false,
  weakTopics: [],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
};

// Clean Roadmap Template with 6 EdTech phases starting fresh
export const SEED_ROADMAP: RoadmapDoc = {
  _id: 'road_usr_candidate_01',
  userId: 'usr_candidate_01',
  examYear: 2027,
  generatedDate: '2026-10-01T00:00:00Z',
  phases: [
    {
      phaseNumber: 1,
      title: 'Phase 1: Vá lỗ hổng Kiến thức Cốt lõi',
      subtitle: 'Xác định và xử lý kiến thức mất gốc được phát hiện qua bài Diagnostic Test',
      objective: 'Đạt tối thiểu 60% mức độ thuần thục ở các chuyên đề bị hổng',
      status: 'IN_PROGRESS',
      progressPercentage: 0,
      estimatedWeeks: 3,
      actionItems: [
        { id: 'act_1', subjectId: 'su', title: 'Ôn lại: Nghệ thuật chớp thời cơ Cách mạng tháng Tám 1945', type: 'LESSON', targetRefId: 'les_su_01', isCompleted: false },
        { id: 'act_2', subjectId: 'dia', title: 'Thực hành: Công thức tính năng suất và mật độ dân số', type: 'LAB', targetRefId: 'geo_data_rice_production', isCompleted: false },
        { id: 'act_3', subjectId: 'van', title: 'Luyện kỹ năng: Nhận diện phong cách ngôn ngữ và thao tác lập luận', type: 'LESSON', targetRefId: 'les_van_01', isCompleted: false },
      ],
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Xây dựng Nền tảng Tư duy & Kỹ năng',
      subtitle: 'Hệ thống hóa kiến thức toàn diện 3 môn theo chuẩn GDPT 2018',
      objective: 'Hiểu bản chất thay vì học thuộc máy móc',
      status: 'PENDING',
      progressPercentage: 0,
      estimatedWeeks: 4,
      actionItems: [
        { id: 'act_4', subjectId: 'su', title: 'Học Timeline tương tác Lịch sử Việt Nam (1945 - 1975)', type: 'LESSON', targetRefId: 'les_su_01', isCompleted: false },
        { id: 'act_5', subjectId: 'dia', title: 'Geography Lab: Thành thạo quy luật 4 dạng biểu đồ', type: 'LAB', targetRefId: 'geo_data_gdp_structure', isCompleted: false },
        { id: 'act_6', subjectId: 'van', title: 'Nắm vững khung Rubric chấm bài Nghị luận GDPT 2018', type: 'LESSON', targetRefId: 'les_van_01', isCompleted: false },
      ],
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Luyện Dạng Câu hỏi Chuyên biệt',
      subtitle: 'Thực hành các dạng câu hỏi mới: Đúng/Sai 4 ý, Trả lời ngắn, Viết đoạn',
      objective: 'Không bỡ ngỡ trước cách chấm điểm lũy tiến của đề thi mới',
      status: 'PENDING',
      progressPercentage: 0,
      estimatedWeeks: 3,
      actionItems: [
        { id: 'act_7', subjectId: 'su', title: 'Luyện chùm câu hỏi Đúng/Sai phân tích tư liệu lịch sử', type: 'PRACTICE', targetRefId: 'q_su_02', isCompleted: false },
        { id: 'act_8', subjectId: 'dia', title: 'Luyện bài tính toán số liệu và điền đáp số ngắn', type: 'PRACTICE', targetRefId: 'q_dia_02', isCompleted: false },
      ],
    },
    {
      phaseNumber: 4,
      title: 'Phase 4: Luyện Chuyên đề Chuyên sâu',
      subtitle: 'Xâu chuỗi các vấn đề liên môn và vận dụng thực tiễn',
      objective: 'Nâng điểm số lên ngưỡng 7.5 - 8.5+',
      status: 'PENDING',
      progressPercentage: 0,
      estimatedWeeks: 4,
      actionItems: [
        { id: 'act_9', subjectId: 'van', title: 'Viết hoàn chỉnh bài nghị luận văn học theo chủ đề mở', type: 'PRACTICE', targetRefId: 'q_van_03', isCompleted: false },
      ],
    },
    {
      phaseNumber: 5,
      title: 'Phase 5: Thi thử Mock Exam Áp lực Phòng thi',
      subtitle: 'Làm bài thi thử có đồng hồ đếm ngược, tự động chấm điểm và đánh giá',
      objective: 'Rèn luyện căn chỉnh thời gian chuẩn xác từng phút',
      status: 'PENDING',
      progressPercentage: 0,
      estimatedWeeks: 3,
      actionItems: [
        { id: 'act_10', subjectId: 'su', title: 'Thi thử Đề số 01 Lịch sử (50 phút)', type: 'EXAM', targetRefId: 'exam_su_01', isCompleted: false },
        { id: 'act_11', subjectId: 'dia', title: 'Thi thử Đề số 01 Địa lí (50 phút)', type: 'EXAM', targetRefId: 'exam_dia_01', isCompleted: false },
        { id: 'act_12', subjectId: 'van', title: 'Thi thử Đề số 01 Ngữ văn (120 phút)', type: 'EXAM', targetRefId: 'exam_van_01', isCompleted: false },
      ],
    },
    {
      phaseNumber: 6,
      title: 'Phase 6: Tối ưu Điểm yếu & Tổng ôn Nước rút',
      subtitle: 'Xem lại ngân hàng câu sai cá nhân và tinh chỉnh kỹ năng',
      objective: 'Sẵn sàng bước vào phòng thi chính thức với sự tự tin cao nhất',
      status: 'PENDING',
      progressPercentage: 0,
      estimatedWeeks: 2,
      actionItems: [
        { id: 'act_13', subjectId: 'su', title: 'Ôn lại 100% các câu hỏi trắc nghiệm đã làm sai', type: 'PRACTICE', targetRefId: 'q_su_02', isCompleted: false },
      ],
    },
  ],
  updatedAt: '2026-10-01T00:00:00Z',
};
