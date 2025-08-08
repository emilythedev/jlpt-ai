import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { type JLPTLevel, type Question, type QuestionFeedback } from '@/lib/types';
import { useCallback, useState } from 'react';
import QuizFeedback from './QuizFeedback';

const GrammarQuiz = ({ level }: { level: JLPTLevel }) => {
  const [result, setResult] = useState<QuestionFeedback[]>([] as QuestionFeedback[]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const addQuestion = useCallback((question: Question, selectedAnswer: string) => {
    if (selectedAnswer === question.correct_answer) setScore(n => n + 1);
    setResult((prev) => [...prev, {
      ...question,
      answer: selectedAnswer,
      sequence: prev.length + 1,
      correctAnsweredAt: selectedAnswer === question.correct_answer ? new Date() : undefined,
    }]);
  }, [setResult, setScore]);

  if (showResult) {
    return (
      <>
        <div className="mb-4 font-medium">JLPT {level.toUpperCase()} の問題の結果</div>
        <div className="font-medium text-xl">得点：{score}</div>
        <div className="mb-4 text-sm">合計 {result.length} 問</div>
        <QuizFeedback feedbacks={result} />
      </>
    );
  }

  return (
    <>
      <div className="mb-4 font-medium">JLPT {level.toUpperCase()} の問題</div>
      <div className="mb-4 font-medium">得点：{score}</div>
      <Quiz level={level} onQuestionCompleted={addQuestion} />
      <Button
        variant="secondary"
        onClick={() => setShowResult(true)}
        className="mt-8"
      >End and View Feedback</Button>
    </>
  );
};

export default GrammarQuiz;
