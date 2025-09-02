import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import type { grammarQuizFetchOptions } from '@/lib/queries';
import { type JLPTLevel, type Question, type QuestionRecord, type QuestionTopic } from '@/lib/types';
import { Route } from '@/routes/grammar/$level';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState, type ComponentProps } from 'react';

interface QuizWrapper extends Omit<ComponentProps<typeof Quiz>, 'questionRecords'> {
  topic: QuestionTopic,
  quizFetchOptions: ReturnType<typeof grammarQuizFetchOptions>;
}

const QuizWrapper = ({
  topic,
  quizFetchOptions,
  ...props
}: QuizWrapper) => {
  const { data: questions } = useSuspenseQuery(quizFetchOptions);

  const questionRecords = questions.map((question: Question) => ({
    question,
    ...topic,
  } as QuestionRecord));

  return (
    <Quiz
      questionRecords={questionRecords}
      {...props}
    />
  );
};

const GrammarQuiz = ({ level }: { level: JLPTLevel }) => {
  const { quizFetchOptions } = Route.useRouteContext();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleCompleted = (count: number) => {
    setTotalQuestions(count);
    setHasCompleted(true);
  };

  const handleRestart = () => {
    setScore(0);
    setTotalQuestions(0);
    setHasCompleted(false);
  };

  if (hasCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">クイズ完了！</h2>
          <p className="text-muted-foreground">
            JLPT {level.toUpperCase()} 文法クイズの結果です。
          </p>
        </div>
        <div className="mb-10 space-y-4">
          <div className="text-6xl font-bold tracking-tighter">
            {totalQuestions > 0
              ? ((score / totalQuestions) * 100).toFixed(0)
              : 0}
            %
          </div>
          <p className="text-lg text-muted-foreground">
            {totalQuestions}問中{score}問、正解しました。
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={handleRestart} variant="outline">
            もう一度挑戦
          </Button>
          <Button asChild>
            <Link to="/grammar">レベル選択に戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          JLPT {level.toUpperCase()} / 文法 / 問題
        </h1>
        <div className="text-xl font-semibold text-right">
          得点：{' '}
          <span className="text-primary font-bold tabular-nums">{score}</span>
        </div>
      </div>
      <QuizWrapper
        key={totalQuestions}
        topic={{ level, section: 'grammar' }}
        quizFetchOptions={quizFetchOptions}
        onScoreUpdated={(delta) => setScore((prev) => prev + delta)}
        onCompleted={handleCompleted}
      />
    </div>
  );
};

export default GrammarQuiz;
