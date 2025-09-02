import QuestionCard from '@/components/QuestionCard';
import SaveQuestionButton from '@/components/SaveQuestionButton';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { grammarQuizFetchOptions } from '@/lib/queries';
import { type JLPTLevel, type QuestionFeedback, type QuestionTopic } from '@/lib/types';
import { Route } from '@/routes/grammar/$level';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronsRight } from 'lucide-react';
import { useState } from 'react';

interface QuizProps {
  topic: QuestionTopic,
  quizFetchOptions: ReturnType<typeof grammarQuizFetchOptions>;
  onScoreUpdated?: (deltaScore: number) => void;
  onCompleted?: (totalQuestions: number) => void;
}

const Quiz = ({
  topic,
  quizFetchOptions,
  onScoreUpdated,
  onCompleted,
}: QuizProps) => {
  const { data: questions } = useSuspenseQuery(quizFetchOptions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState<number | undefined>();
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionFeedback | null>(null);

  const totalQuestions = questions.length;
  const sequence = currentIndex + 1;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  const handleNextQuestion = () => {
    setAnswer('');
    setCurrentQuestionData(null);
    setCurrentQuestionId(undefined);

    if (isLastQuestion) {
      onCompleted?.(totalQuestions);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleAnswered = (ans: string) => {
    const isCorrect = currentQuestion.correct_answer === ans;
    setAnswer(ans);

    setCurrentQuestionData({
      ...topic,
      question: currentQuestion,
      lastCorrectAt: isCorrect ? new Date() : undefined,
    });

    if (isCorrect) {
      onScoreUpdated?.(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          問題 {sequence} / {totalQuestions}
        </p>
        <Progress value={(sequence / totalQuestions) * 100} />
      </div>
      <QuestionCard
        question={currentQuestion}
        showResult={!!answer}
        onAnswered={handleAnswered}
        sequence={sequence}
      >
        { answer && (
          <CardFooter className="flex-col gap-2 items-stretch text-muted-foreground text-sm">
            {currentQuestion.explanation}
          </CardFooter>
        )}
      </QuestionCard>

      <div className="flex justify-end gap-4">
        {currentQuestionData && (
          <SaveQuestionButton
            id={currentQuestionId}
            onIdUpdated={setCurrentQuestionId}
            questionData={currentQuestionData}
          />
        )}
        <Button onClick={handleNextQuestion} disabled={!answer}>
          <span>{isLastQuestion ? '完了' : '次へ'}</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
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
      <Quiz
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
