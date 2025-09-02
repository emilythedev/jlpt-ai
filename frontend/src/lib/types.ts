export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export const JLPTLevelValues = ['n1', 'n2', 'n3', 'n4', 'n5'] as const; // 'as const' creates a tuple with literal types
export type JLPTLevel = (typeof JLPTLevelValues)[number];

export type QuestionTopic = {
  level: JLPTLevel;
  section: Section;
};

export type QuestionRecord = QuestionTopic & {
  question: Question;
  lastCorrectAt?: Date;
};

export type QuestionRecordWithId = QuestionRecord & {
  id?: number;
};

export const SectionValues = [
  'grammar',
  'vocabulary',
] as const;
export type Section = (typeof SectionValues)[number];
