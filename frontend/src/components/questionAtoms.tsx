import type { QuestionRecord } from '@/lib/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type QuestionAtomType = {
  id?: number;
  questionData: QuestionRecord,
  sequence: number;
  answer: string;
};

type ResultAtomType = {
  score: number;
  answeredQuestions: QuestionAtomType[];
};

const resultAtom = atomWithStorage<ResultAtomType>(
  'result',
  { score: 0, answeredQuestions: [] }
);

export const getResultAtom = atom(get => get(resultAtom));
export const getScoreAtom = atom(get => get(resultAtom).score);

/**
 * atomWithStorage cannot be used together with atomWithReducer.
 * Separate actions into atom instead of using reducer function,
 * is more atomic and can be benifited from code splitting or lazy loading.
 *
 * https://jotai.org/docs/guides/composing-atoms#action-atoms
 */

// write-only atom to reset result
export const resetResultAtom = atom(null,
  (_, set) => set(resultAtom, { score: 0, answeredQuestions: [] })
);

// write-only atom to add answered question and update score
export const addAnsweredQuestionAtom = atom(null,
  (_, set, question: QuestionAtomType, deltaScore: number = 0) => {
    set(resultAtom, prevResult => {
      const currentQuestions = prevResult.answeredQuestions;
      return {
        score: prevResult.score + deltaScore,
        answeredQuestions: [...currentQuestions, question],
      };
    });
  }
);

// write-only atom to update question ID by sequence
export const updateQuestionIdAtom = atom(null,
  (_, set, sequence: number, newId?: number) => {
    set(resultAtom, prevResult => {
      const currentQuestions = prevResult.answeredQuestions;
      const index = currentQuestions.findIndex(question => question.sequence === sequence);
      if (index < 0) return prevResult;

      const updatedQuestions = [...currentQuestions];
      const questionToUpdate = { ...updatedQuestions[index] };
      if (newId === undefined) {
        delete questionToUpdate.id;
      } else {
        questionToUpdate.id = newId;
      }
      updatedQuestions[index] = questionToUpdate;

      return {
        score: prevResult.score,
        answeredQuestions: updatedQuestions,
      };
    });
  }
);
