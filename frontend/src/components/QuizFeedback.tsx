import type { QuestionFeedback } from '@/lib/types';
import QuestionCard from './QuestionCard';

interface QuizFeedbackProps {
  feedbacks: QuestionFeedback[];
}
const QuizFeedback = ({ feedbacks }: QuizFeedbackProps) => {
  return (
    <div className="flex flex-col w-full max-w-lg">
      {feedbacks.map((questionFeedback, idx) => (
        <QuestionCard
          key={idx}
          sequence={idx + 1}
          question={questionFeedback}
          defaultValue={questionFeedback.selectedAnswer}
          showResult
        />
      ))}
    </div>
  );
};

export default QuizFeedback;
