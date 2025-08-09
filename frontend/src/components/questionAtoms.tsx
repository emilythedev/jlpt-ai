import type { QuestionFeedback } from '@/lib/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type QuestionAtomType = {
  id?: number;
  questionData: QuestionFeedback,
  sequence: number;
  answer: string;
};

const answeredQuestionsAtom = atomWithStorage<QuestionAtomType[]>(
  'answeredQuestions',
  []
);
export const scoreAtom = atomWithStorage<number>(
  'score',
  0
);

export const resetQuestionsAtom = atom(null,
  (_, set) => {
    set(scoreAtom, 0);
    set(answeredQuestionsAtom, []);
  }
);

// write-only atom for adding a new question
export const addQuestionAtom = atom(
  null,
  (get, set, newQuestion: QuestionAtomType) => {
    const currentQuestions = get(answeredQuestionsAtom);
    set(answeredQuestionsAtom, [...currentQuestions, newQuestion]);
  }
);

// write-only atom for updating a question's 'id' prop
export const updateQuestionIdAtom = atom(
  null,
  (get, set, { sequence, newId }: { sequence: number; newId?: number }) => {
    const currentQuestions = get(answeredQuestionsAtom);
    const index = currentQuestions.findIndex(data => data.sequence === sequence);
    if (index < 0) return;

    const updatedQuestions = [...currentQuestions];
    const questionToUpdate = { ...updatedQuestions[index] };
    if (newId === undefined) {
      delete questionToUpdate.id;
    } else {
      questionToUpdate.id = newId;
    }
    updatedQuestions[index] = questionToUpdate;
    set(answeredQuestionsAtom, updatedQuestions);
  }
);

// read-only atom to retrieve the list of questions
export const getAnsweredQuestionsAtom = atom((get) => get(answeredQuestionsAtom));
