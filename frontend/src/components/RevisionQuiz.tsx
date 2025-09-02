import { Button } from '@/components/ui/button';
import type { QuestionRecordWithId } from '@/lib/types';
import { useState } from 'react';
import Quiz from './Quiz';

interface RevisionQuizProps {
  questionRecords: QuestionRecordWithId[];
  onReturn: () => void;
}

const RevisionQuiz = ({ questionRecords, onReturn }: RevisionQuizProps) => {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleCompleted = (count: number) => {
    setTotalQuestions(count);
    setHasCompleted(true);
  };

  if (hasCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">復習完了！</h2>
          <p className="text-muted-foreground">
            復習の結果です。
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
          <Button onClick={onReturn}>
            保存した問題一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          復習の問題
        </h1>
        <div className="text-xl font-semibold text-right">
          得点：{' '}
          <span className="text-primary font-bold tabular-nums">{score}</span>
        </div>
      </div>
      <Quiz
        questionRecords={questionRecords}
        onScoreUpdated={(delta) => setScore((prev) => prev + delta)}
        onCompleted={handleCompleted}
      />
    </div>
  );
};

export default RevisionQuiz;
