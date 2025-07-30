import { Button } from '@/components/ui/button';
import type { Question } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronsRight, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import QuestionCard from './QuestionCard';

const questionApiUrl = 'http://localhost:8000/question';

const Quiz = () => {
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const {
    data: question, // 'data' is renamed to 'question' for clarity
    isLoading,    // true on initial load
    isError,      // true if there's an error
    error,        // The error object if isError is true
    refetch,      // Function to manually re-fetch the query
    isFetching    // true when a fetch is in progress (can be during initial load or refetch)
  } = useQuery<Question, Error>({
    queryKey: ['quizQuestion'],
    queryFn: async () => {
      const response = await axios.get<Question>(questionApiUrl);
      // Reset local state when a new question is successfully fetched
      setSelectedAnswerIdx(null);
      setShowAnswer(false);
      setTotalQuestions(n => n + 1);
      return response.data;
    },
    // query runs on initial component mount
    enabled: true,
  });

  const handleOptionSelect = (optionIdx: number) => {
    if (question) setSelectedAnswerIdx(optionIdx);
  };

  const handleNextQuestion = () => {
    if (question) {
      setShowAnswer(true);
      if (selectedAnswerIdx === question.correct_answer_index) {
        setScore(n => n + 1);
      }
    }
    refetch();
  };

  if (isLoading) {
    return (
      <QuestionCard.Skeleton className="w-full max-w-xl" />
    );
  }

  if (isError) {
    return (
      <div className="text-center text-xl p-12 text-red-600">
        Error: {error?.message}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center text-xl p-12 text-gray-700">No question available.</div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-4 font-medium">Score: {score}</div>
      <QuestionCard
        question={question}
        showAnswer={showAnswer}
        onSelect={handleOptionSelect}
        sequence={totalQuestions}
      />
      <div className="mt-8">
        {isFetching ? (
          <Button disabled>
            <Loader2Icon className="animate-spin" />
            読み込み中...
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            次の問題へ
            <ChevronsRight />
          </Button>
        )}

      </div>
    </div>
  );
};

export default Quiz;
