/**
 * Comprehensive Full Curriculum Lessons, Topics & Knowledge Units
 * Sourced according to Vietnam Ministry of Education & Training (Bộ GD&ĐT) CT GDPT 2018
 * Covers complete grade 12 syllabus: Ngữ văn, Lịch sử, Địa lí for Independent THPT Exam Candidates.
 */

import { TopicDoc, KnowledgeUnitDoc, LessonDoc } from '../types/database';
import { VAN_TOPICS, VAN_KNOWLEDGE_UNITS, VAN_LESSONS } from './curriculum/vanLessons';
import { SU_TOPICS, SU_KNOWLEDGE_UNITS, SU_LESSONS } from './curriculum/suLessons';
import { DIA_TOPICS, DIA_KNOWLEDGE_UNITS, DIA_LESSONS } from './curriculum/diaLessons';

export const FULL_CURRICULUM_TOPICS: TopicDoc[] = [
  ...VAN_TOPICS,
  ...SU_TOPICS,
  ...DIA_TOPICS,
];

export const FULL_CURRICULUM_KNOWLEDGE_UNITS: KnowledgeUnitDoc[] = [
  ...VAN_KNOWLEDGE_UNITS,
  ...SU_KNOWLEDGE_UNITS,
  ...DIA_KNOWLEDGE_UNITS,
];

export const FULL_CURRICULUM_LESSONS: LessonDoc[] = [
  ...VAN_LESSONS,
  ...SU_LESSONS,
  ...DIA_LESSONS,
];

export {
  VAN_TOPICS,
  VAN_KNOWLEDGE_UNITS,
  VAN_LESSONS,
  SU_TOPICS,
  SU_KNOWLEDGE_UNITS,
  SU_LESSONS,
  DIA_TOPICS,
  DIA_KNOWLEDGE_UNITS,
  DIA_LESSONS,
};
