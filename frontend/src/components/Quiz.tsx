import { Button } from '@/components/ui/button';
import type { Question } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import QuestionCard from './QuestionCard';

const questionApiUrl = 'http://localhost:8000/question';

const Quiz = () => {
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

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
      setFeedback(null);
      return response.data;
    },
    // query runs on initial component mount
    enabled: true,
  });

  const handleOptionSelect = (optionIdx: number) => {
    if (question) {
      setSelectedAnswerIdx(optionIdx);
      if (optionIdx === question.correct_answer_index) {
        setFeedback("Correct! 🎉");
      } else {
        setFeedback(`Incorrect.`);
      }
    }
  };

  const handleNextQuestion = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="text-center text-xl p-12 text-gray-700">Loading question...</div>
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
 // Determine feedback background and text color classes
  const feedbackBgClass = feedback?.startsWith("Correct") ? 'bg-green-100' : 'bg-red-100';
  const feedbackTextColorClass = feedback?.startsWith("Correct") ? 'text-green-800' : 'text-red-800';
  const feedbackBorderClass = feedback?.startsWith("Correct") ? 'border-green-300' : 'border-red-300';


  return (
    <div className="p-4">
      <QuestionCard
        question={question}
        onSelect={handleOptionSelect}
      />
      {selectedAnswerIdx !== null && (
        <div className={`text-center mt-5 p-4 rounded-md mx-auto max-w-xl
                        border ${feedbackBgClass} ${feedbackTextColorClass} ${feedbackBorderClass}`}>
          <strong className="block text-lg">Your selection:</strong>
          <span className="block text-xl font-medium mt-1">{question.options[selectedAnswerIdx]}</span>
          <p className="mt-3 font-bold text-xl">{feedback}</p>
        </div>
      )}
      <div className="text-center mt-8">
        <Button
          onClick={handleNextQuestion}
          disabled={isFetching}
        >
          {isFetching ? 'Fetching next question...' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
