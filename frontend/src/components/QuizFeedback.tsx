import type { QuestionFeedback } from '@/lib/types';
import QuestionCard from './QuestionCard';

interface QuizFeedbackProps {
  feedbacks: QuestionFeedback[];
}

const QuizFeedback = ({ feedbacks }: QuizFeedbackProps) => {
  return (
    <div className="flex flex-col w-full max-w-2xl gap-16">
      {feedbacks.map((questionFeedback, idx) => (
        <QuestionCard
          key={idx}
          sequence={idx + 1}
          question={questionFeedback}
          defaultValue={questionFeedback.selectedAnswer}
          showResult
        >
          <div className="mt-8 p-4 bg-green-100 text-green-800">
            {questionFeedback.explanation}
          </div>
        </QuestionCard>
      ))}
    </div>
  );
};

export default QuizFeedback;
