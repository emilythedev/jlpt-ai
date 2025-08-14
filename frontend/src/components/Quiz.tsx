import { Button } from '@/components/ui/button';
import type { JLPTLevel, Question } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronsRight, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';

type QuizProps = {
  level: JLPTLevel;
  onQuestionCompleted?: (question: Question, answer: string, sequence: number) => void,
}

const questionApiUrl = 'http://localhost:8000/question';
const fetchQuestion = async (level: JLPTLevel) => {
  const response = await axios.get<Omit<Question, 'generatedAt'>>(questionApiUrl + `?lv=${level}`);
  return response.data;
};

const Quiz: React.FC<QuizProps> = ({ level, onQuestionCompleted }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(''); // for feedback review
  const [showResult, setShowResult] = useState<boolean>(false);
  const [sequence, setSequence] = useState<number>(1);

  const {
    data: question, // 'data' is renamed to 'question' for clarity
    isLoading,    // true on initial load
    isError,      // true if there's an error
    error,        // The error object if isError is true
    refetch,      // Function to manually re-fetch the query
    isFetching,    // true when a fetch is in progress (can be during initial load or refetch)
    isFetchedAfterMount,
  } = useQuery<Question, Error>({
    queryKey: ['quizQuestion', level],
    queryFn: async () => fetchQuestion(level),
    enabled: true,  // query runs on initial component mount
    refetchOnMount: 'always', // fetch a new question on remount
  });

  const handleAnswer = (answer: string) => {
    if (question) setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (question) {
      setShowResult(true);
      if (onQuestionCompleted) onQuestionCompleted(question, selectedAnswer, sequence);
    }
    await refetch();

    // Reset local state and increment sequence when a new question is fetched
    setSelectedAnswer('');
    setShowResult(false);
    setSequence(prev => prev + 1);
  };

  useEffect(() => {
    return () => {
      setSequence(1);
      setSelectedAnswer('');
      setShowResult(false);
    };
  }, []);

  if (isLoading || !isFetchedAfterMount) {
    return (
      <>
        <QuestionCard.Skeleton />
        <div className="mt-8 rounded h-8 w-32 bg-gray-200 animate-pulse"></div>
      </>
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
    <>
      <QuestionCard
        question={question}
        showResult={showResult}
        onAnswered={handleAnswer}
        sequence={sequence}
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
    </>
  );
};

export default Quiz;
