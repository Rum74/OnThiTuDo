/**
 * Word (.docx) & Structured Text Question Parser
 * Supports Vietnamese National High School Graduation Exam formats (CT GDPT 2018):
 * - Part I: Single choice (4 options A, B, C, D)
 * - Part II: True/False (4 sub-items a, b, c, d)
 * - Part III: Short answer
 */

import mammoth from 'mammoth';

export interface ParsedQuestion {
  content: string;
  questionType: 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: { id: string; label: string; text: string }[];
  correctAnswer?: string;
  trueFalseStatements?: { id: string; label: string; statement: string; isCorrect: boolean; explanation: string }[];
  stimulusText?: string;
  explanation: string;
  difficulty: 'NHAN_BIET' | 'THONG_HIEU' | 'VAN_DUNG';
}

export async function parseDocxBufferToText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

export function parseExamText(rawText: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!rawText || !rawText.trim()) return questions;

  // Normalize line breaks
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Regex to split questions by "Câu 1.", "Câu 1:", "Câu 1 -", "Bài 1:", "Question 1:"
  const questionSplits = normalized.split(/(?:^|\n)\s*(?:Câu|Bài|Question)\s+(\d+)\s*[:.\-]\s*/i);

  // If split doesn't find "Câu X.", try splitting by double line breaks
  if (questionSplits.length <= 1) {
    const blocks = normalized.split(/\n\s*\n/);
    for (const block of blocks) {
      if (block.trim().length > 15) {
        const parsed = parseSingleQuestionBlock(block.trim());
        if (parsed) questions.push(parsed);
      }
    }
    return questions;
  }

  // Iterate over matches (questionSplits[0] is preamble/instructions)
  for (let i = 1; i < questionSplits.length; i += 2) {
    const num = questionSplits[i];
    const block = questionSplits[i + 1];
    if (block) {
      const parsed = parseSingleQuestionBlock(block.trim(), num);
      if (parsed) {
        questions.push(parsed);
      }
    }
  }

  return questions;
}

function parseSingleQuestionBlock(text: string, questionNumber?: string): ParsedQuestion | null {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // Extract Explanation / Lời giải / Hướng dẫn giải
  let explanation = '';
  const explMatch = text.match(/(?:Lời giải|Hướng dẫn giải|Giải thích|HDG)\s*[:.\-]\s*([\s\S]+)$/i);
  if (explMatch) {
    explanation = explMatch[1].trim();
  }

  // Extract Answer / Đáp án / Chọn
  let rawAnswer = '';
  const ansMatch = text.match(/(?:Đáp án|Chọn|Đ\/A|Key)\s*[:.\-]?\s*([A-D0-9a-d\s,;\-_ĐSdSsaiđúng]+)/i);
  if (ansMatch) {
    rawAnswer = ansMatch[1].trim();
  }

  // Check if this is a 4-option Single Choice question: A., B., C., D. (uppercase)
  const optionMatches = Array.from(text.matchAll(/(?:^|\n)\s*([A-D])[\).]\s*([^\n]+)/g));
  if (optionMatches.length >= 2) {
    const options = optionMatches.map((m) => ({
      id: `opt_${m[1]}`,
      label: m[1].toUpperCase(),
      text: m[2].trim(),
    }));

    // Find clean single letter answer
    let correctAnswer = 'A';
    if (rawAnswer) {
      const matchLetter = rawAnswer.match(/[A-D]/);
      if (matchLetter) correctAnswer = matchLetter[0].toUpperCase();
    }

    // Content is text before the first A.
    const firstOptIndex = text.search(/(?:^|\n)\s*[A-D][\).]/);
    const content = firstOptIndex !== -1 ? text.substring(0, firstOptIndex).trim() : lines[0];

    return {
      content,
      questionType: 'SINGLE_CHOICE',
      options,
      correctAnswer,
      explanation: explanation || 'Căn cứ vào kiến thức chuẩn của chương trình GDPT.',
      difficulty: 'NHAN_BIET',
    };
  }

  // Check if this is a True/False 4-substatement question (Part II GDPT 2018 format)
  // Look for lowercase a), b), c), d) or a., b., c., d.
  const tfMatches = Array.from(text.matchAll(/(?:^|\n)\s*([a-d])[\).]\s*([^\n]+)/g));
  if (tfMatches.length >= 2) {
    // True/False question
    const statements = tfMatches.map((m, idx) => {
      const label = m[1].toLowerCase();
      const statement = m[2].trim();
      let isCorrect = true; // default

      // Try parsing from rawAnswer (e.g. "a - Đ, b - S" or "a: Đúng, b: Sai")
      if (rawAnswer) {
        const specificMatch = new RegExp(`${label}\\s*[:\\-]?\\s*([ĐS]|Đúng|Sai)`, 'i').exec(rawAnswer);
        if (specificMatch) {
          isCorrect = /^([Đ]|Đúng)$/i.test(specificMatch[1]);
        }
      }

      return {
        id: `stmt_${idx + 1}`,
        label,
        statement,
        isCorrect,
        explanation: '',
      };
    });

    // Content is text before the first a)
    const firstIndex = text.search(/(?:^|\n)\s*[a-d][\).]/);
    const content = firstIndex !== -1 ? text.substring(0, firstIndex).trim() : lines[0];

    return {
      content,
      questionType: 'TRUE_FALSE',
      trueFalseStatements: statements,
      explanation: explanation || 'Phân tích từng mệnh đề dựa trên kiến thức cốt lõi và tư liệu.',
      difficulty: 'THONG_HIEU',
    };
  }

  // Otherwise, Short Answer question
  let cleanAns = rawAnswer || '';
  if (cleanAns.includes(':')) {
    cleanAns = cleanAns.split(':')[1].trim();
  }

  // Content without the answer line
  let content = text;
  if (ansMatch) {
    content = text.substring(0, ansMatch.index).trim();
  }

  return {
    content: content || lines[0],
    questionType: 'SHORT_ANSWER',
    correctAnswer: cleanAns,
    explanation: explanation || 'Điền đáp số hoặc thuật ngữ chuẩn xác.',
    difficulty: 'VAN_DUNG',
  };
}
