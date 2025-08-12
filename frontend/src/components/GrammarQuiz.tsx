import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { type JLPTLevel, type Question } from '@/lib/types';
import { Link } from '@tanstack/react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { addAnsweredQuestionAtom, getScoreAtom } from './questionAtoms';

const GrammarQuiz = ({ level }: { level: JLPTLevel }) => {
  const addQuestion = useSetAtom(addAnsweredQuestionAtom);
  const score = useAtomValue(getScoreAtom);

  const handleQuestionCompleted = (question: Question, answer: string, sequence: number) => {
    const isCorrect = answer === question.correct_answer;

    addQuestion({
      answer,
      sequence,
      questionData: {
        level,
        section: 'grammar',
        question: question,
        lastCorrectAt: isCorrect ? new Date() : undefined,
      },
    }, isCorrect ? 1 : 0);
  };

  return (
    <>
      <div className="mb-4 font-medium">JLPT {level.toUpperCase()} の問題</div>
      <div className="mb-4 font-medium">得点：{score}</div>
      <Quiz level={level} onQuestionCompleted={handleQuestionCompleted} />
      <Link to='/grammar/$level/result' params={{ level }}>
        <Button
          variant="secondary"
          className="mt-16"
        >終わり</Button>
      </Link>
    </>
  );
};

export default GrammarQuiz;
