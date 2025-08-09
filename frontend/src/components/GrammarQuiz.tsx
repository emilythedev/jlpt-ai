import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { type JLPTLevel, type Question } from '@/lib/types';
import { Link } from '@tanstack/react-router';
import { useAtom, useSetAtom } from 'jotai';
import { addQuestionAtom, scoreAtom } from './questionAtoms';

const GrammarQuiz = ({ level }: { level: JLPTLevel }) => {
  const addQuestion = useSetAtom(addQuestionAtom);
  const [score, setScore] = useAtom(scoreAtom);

  const handleQuestionCompleted = (question: Question, answer: string, sequence: number) => {
    const isCorrect = answer === question.correct_answer;
    if (isCorrect) setScore(n => n + 1);

    addQuestion({
      answer,
      sequence,
      questionData: {
        level,
        section: 'grammar',
        question: question,
        lastCorrectAt: isCorrect ? new Date() : undefined,
      },
    });
  };

  return (
    <>
      <div className="mb-4 font-medium">JLPT {level.toUpperCase()} の問題</div>
      <div className="mb-4 font-medium">得点：{score}</div>
      <Quiz level={level} onQuestionCompleted={handleQuestionCompleted} />
      <Link to='/grammar/$level/result' params={{ level }}>
        <Button
          variant="secondary"
          className="mt-8"
        >End and View Feedback</Button>
      </Link>
    </>
  );
};

export default GrammarQuiz;
