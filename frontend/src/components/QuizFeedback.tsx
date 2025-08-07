import SaveQuestionButton from '@/components/SaveQuestionButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { type MultipleChoiceQuestionModel } from '@/lib/db';
import type { QuestionFeedback } from '@/lib/types';
import { useState } from 'react';
import QuestionCard from './QuestionCard';

interface QuizFeedbackProps {
  feedbacks: QuestionFeedback[];
}

const QuizFeedback = ({ feedbacks }: QuizFeedbackProps) => {
  const [showWrongAnswerOnly, setShowWrongAnswerOnly] = useState<boolean>(false);

  const [feedbacksWithId, setFeedbacksWithId] = useState<{
    sequence: number,
    answer: string,
    id?: number,
    questionData: MultipleChoiceQuestionModel,
  }[]>(feedbacks.map(({
    sequence,
    answer,
    correctAnsweredAt,
    ...question
  }) => {
    return {
      sequence,
      answer,

      id: undefined,
      questionData: {
        level: 'n3', // TODO: global setting
        section: 'grammar',
        question,
        lastCorrectAt: correctAnsweredAt,
      } as MultipleChoiceQuestionModel,
    };
  }));

  const handleFeedbackIdUpdated = (sequence: number, id?: number) => {
    setFeedbacksWithId(list => list.map(feedback => {
      if (feedback.sequence !== sequence) return feedback;
      return {
        ...feedback,
        id,
      };
    }))
  };

  const filteredFeedbacks = !showWrongAnswerOnly ? feedbacksWithId :
    feedbacksWithId.filter(data => !data.questionData.lastCorrectAt);

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
          answer,
          id,
          questionData,
        }) => (
          <QuestionCard
            key={sequence}
            sequence={sequence}
            question={questionData.question}
            defaultValue={answer}
            showResult
          >
            <div className="mt-8 mb-8 p-4 bg-green-100 text-green-800">
              {questionData.question.explanation}
            </div>

            <SaveQuestionButton
              id={id}
              questionData={questionData}
              onIdUpdated={(id) => handleFeedbackIdUpdated(sequence, id)}
            />
          </QuestionCard>
        ))}
      </div>
    </>
  );
};

export default QuizFeedback;
