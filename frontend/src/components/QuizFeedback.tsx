import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { QuestionFeedback } from '@/lib/types';
import { useState } from 'react';
import QuestionCard from './QuestionCard';

interface QuizFeedbackProps {
  feedbacks: QuestionFeedback[];
}

const QuizFeedback = ({ feedbacks }: QuizFeedbackProps) => {
  const [showWrongAnswerOnly, setShowWrongAnswerOnly] = useState<boolean>(false);

  const filteredFeedbacks = !showWrongAnswerOnly ? feedbacks :
    feedbacks.filter(q => q.correct_answer !== q.selectedAnswer);

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id='wrong-ans-only'
          checked={showWrongAnswerOnly}
          onCheckedChange={setShowWrongAnswerOnly}
        />
        <Label htmlFor="wrong-ans-only" className="text-base">不正解のみ</Label>
      </div>

      <div className="flex flex-col w-full max-w-2xl gap-16">
        {filteredFeedbacks.map(({
          sequence,
          selectedAnswer,
          ...question
        }) => (
          <QuestionCard
            key={sequence}
            sequence={sequence}
            question={question}
            defaultValue={selectedAnswer}
            showResult
          >
            <div className="mt-8 p-4 bg-green-100 text-green-800">
              {question.explanation}
            </div>
          </QuestionCard>
        ))}
      </div>
    </>
  );
};

export default QuizFeedback;
