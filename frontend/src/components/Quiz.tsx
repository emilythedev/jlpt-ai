import { Button } from '@/components/ui/button';
import type { JLPTLevel, Question } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronsRight, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';

type QuizProps = {
  level: JLPTLevel;
}

const questionApiUrl = 'http://localhost:8000/question';
const fetchQuestion = async (level: JLPTLevel) => {
  const response = await axios.get<Question>(questionApiUrl + `?lv=${level}`);
  return response.data;
};

const Quiz: React.FC<QuizProps> = ({ level }) => {
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const {
    data: question, // 'data' is renamed to 'question' for clarity
    isLoading,    // true on initial load
    isError,      // true if there's an error
    error,        // The error object if isError is true
    refetch,      // Function to manually re-fetch the query
    isFetching,    // true when a fetch is in progress (can be during initial load or refetch)
    isSuccess
  } = useQuery<Question, Error>({
    queryKey: ['quizQuestion', level],
    queryFn: async () => fetchQuestion(level),
    enabled: true,  // query runs on initial component mount
  });

  const handleAnswerValidated = (corrected: boolean) => {
    if (question) setIsCorrect(corrected);
  };

  const handleNextQuestion = () => {
    if (question) {
      setShowAnswer(true);
      if (isCorrect) {
        setScore(n => n + 1);
      }
    }
    refetch();
  };

  useEffect(() => {
    if (!isSuccess) return;
    // Reset local state when a new question is successfully fetched
    setIsCorrect(false);
    setShowAnswer(false);
    setTotalQuestions(n => n + 1);
  }, [isSuccess, question]);

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
      <div className="mb-4 font-medium">JLPT {level.toUpperCase()} の問題</div>
      <div className="mb-4 font-medium">得点：{score}</div>
      <QuestionCard
        question={question}
        showAnswer={showAnswer}
        onValidated={handleAnswerValidated}
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
