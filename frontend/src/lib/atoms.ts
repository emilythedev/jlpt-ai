import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { QuestionRecord } from './types';

export type QuestionStateAtomType = {
  id?: number;
  questionData: QuestionRecord,
  sequence: number;
  answer: string;
};

type QuizAtomType = {
  score: number;
  currentQuestionIndex: number;
  questionStates: QuestionStateAtomType[];
}

const createQuizStorageAtom = (key: string) => {
  const baseAtom = atomWithStorage<QuizAtomType>(key, {
    score: 0,
    currentQuestionIndex: 0,
    questionStates: [],
  }, undefined, { getOnInit: true });

  const getQuizAtom = atom(get => get(baseAtom));
  const getScoreAtom = atom(get => get(baseAtom).score);
  const getTotalQuestionsAtom = atom(get => get(baseAtom).questionStates.length);
  const getCurrentQuestionStateAtom = atom(get => {
    const { questionStates, currentQuestionIndex } = get(baseAtom);
    return questionStates[currentQuestionIndex];
  });

  const startNewQuizAtom = atom(null,
    (_, set, questionStates: QuestionStateAtomType[]) => set(baseAtom, {
      score: 0,
      currentQuestionIndex: 0,
      questionStates,
    })
  );

  // write-only atom to answer question by sequence, update score and move to next question
  const answerQuestionAndNextAtom = atom(null,
    (_, set, questionState: QuestionStateAtomType, deltaScore: number = 0) => {
      set(baseAtom, prev => {
        const currentQuestions = prev.questionStates;

        const existingIndex = currentQuestions.findIndex(q => q.sequence === questionState.sequence);
        if (existingIndex < 0) return prev;

        const newQuestions = [...currentQuestions];
        newQuestions[existingIndex] = questionState;

        let nextQuestionIndex = prev.currentQuestionIndex + 1;
        if (nextQuestionIndex > newQuestions.length) {
          nextQuestionIndex = newQuestions.length;
        }

        return {
          score: prev.score + deltaScore,
          currentQuestionIndex: nextQuestionIndex,
          questionStates: newQuestions,
        };
      });
    }
  );

  // read-only atom to check if there are no more unanswered questions
  const hasNoMoreQuestionsAtom = atom(get => {
    const { questionStates, currentQuestionIndex } = get(baseAtom);
    return currentQuestionIndex >= questionStates.length;
  });

  // write-only atom to update question ID by sequence
  const updateQuestionIdAtom = atom(null,
    (_, set, sequence: number, newId?: number) => {
      set(baseAtom, prev => {
        const currentQuestions = prev.questionStates;
        const index = currentQuestions.findIndex(question => question.sequence === sequence);
        if (index < 0) return prev;

        const updatedQuestions = [...currentQuestions];
        const questionToUpdate = { ...updatedQuestions[index] };
        if (newId === undefined) {
          delete questionToUpdate.id;
        } else {
          questionToUpdate.id = newId;
        }
        updatedQuestions[index] = questionToUpdate;

        return {
          ...prev,
          questionStates: updatedQuestions,
        };
      });
    }
  );

  return {
    getQuizAtom,
    getScoreAtom,
    getTotalQuestionsAtom,
    getCurrentQuestionStateAtom,
    hasNoMoreQuestionsAtom,

    startNewQuizAtom,
    answerQuestionAndNextAtom,
    updateQuestionIdAtom,
  };
};

export const revisionQuizAtoms = createQuizStorageAtom('appRevisionQuiz');
