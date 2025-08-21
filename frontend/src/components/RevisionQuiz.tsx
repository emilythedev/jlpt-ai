import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { revisionQuizAtoms } from '@/lib/atoms';
import { useNavigate } from '@tanstack/react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { ChevronsRight } from 'lucide-react';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';

const QuizTitle = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="font-medium">{children}</div>
  )
};

const QuizScore = ({ score }: { score: number }) => {
  return (
    <div className="font-medium">得点：{score}</div>
  );
};

const NextQuestionButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      次の問題へ
      <ChevronsRight />
    </Button>
  );
};

const {
  getScoreAtom,
  getCurrentQuestionStateAtom,
  answerQuestionAndNextAtom,
  hasNoMoreQuestionsAtom,
} = revisionQuizAtoms;

const RevisionQuiz = () => {
  const score = useAtomValue(getScoreAtom);
  const questionState = useAtomValue(getCurrentQuestionStateAtom);
  const answerQuestionAndNext = useSetAtom(answerQuestionAndNextAtom);
  const [answer, setAnswer] = useState('');
  const hasNoMoreQuestions = useAtomValue(hasNoMoreQuestionsAtom);
  const navigate = useNavigate();

  const handleNextQuestion = () => {
    if (!answer) return;
    const isCorrect = answer === questionState.questionData.question.correct_answer;
    answerQuestionAndNext({
      ...questionState,
      answer,
      questionData: {
        ...questionState.questionData,
        lastCorrectAt: isCorrect ? new Date() : undefined,
      },
    }, isCorrect ? 1 : 0);
    setAnswer('');
  };

  // if there are no more questions, navigate to the result page
  useEffect(() => {
    if (hasNoMoreQuestions) {
      navigate({ to: '/revision/result' });
      return;
    }
  }, [hasNoMoreQuestions, navigate]);

  return (
    <div className="w-full flex flex-col gap-4">
      <QuizTitle>復習の問題</QuizTitle>
      <QuizScore score={score} />
      { questionState && questionState.questionData ? (
        <QuestionCard
          className="my-4"
          question={questionState.questionData.question}
          sequence={questionState.sequence}
          onAnswered={setAnswer}
        />
      ) : (<QuestionCard.Skeleton className="my-4" />) }

      <NextQuestionButton onClick={handleNextQuestion} />
    </div>
  )
};

export default RevisionQuiz;
