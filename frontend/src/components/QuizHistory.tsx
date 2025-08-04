import type { QuestionHistory } from '@/lib/types';
import QuestionCard from './QuestionCard';

interface QuizHistoyProps {
  history: QuestionHistory[];
}
const QuizHistory = ({ history }: QuizHistoyProps) => {
  return (
    <div>
      <h1>History</h1>
      <div className="flex flex-col w-full max-w-lg">
        {history.map((questionHistory, idx) => (
          <QuestionCard
            key={idx}
            sequence={idx + 1}
            question={questionHistory}
            defaultValue={questionHistory.selectedAnswer}
            showResult
          />
        ))}
      </div>
    </div>
  );
};

export default QuizHistory;
