export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export const JLPTLevelValues = ['n1', 'n2', 'n3', 'n4', 'n5'] as const; // 'as const' creates a tuple with literal types
export type JLPTLevel = (typeof JLPTLevelValues)[number];

export type QuestionFeedback = Question & {
  sequence: number;
  answer: string;
  correctAnsweredAt?: Date;
};

export type Section = 'grammar' | 'vocabulary';
