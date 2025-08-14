import SaveQuestionButton from '@/components/SaveQuestionButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { updateQuestionIdAtom, type QuestionAtomType } from './questionAtoms';
import { CardFooter } from './ui/card';

interface QuizFeedbackProps {
  feedbacks: QuestionAtomType[];
}

const QuizFeedback = ({ feedbacks }: QuizFeedbackProps) => {
  const [showWrongAnswerOnly, setShowWrongAnswerOnly] = useState<boolean>(false);
  const updateQuestionId = useSetAtom(updateQuestionIdAtom);

  const filteredFeedbacks = !showWrongAnswerOnly ? feedbacks :
    feedbacks.filter(data => !data.questionData.lastCorrectAt);

  return (
    <>
      <div className="flex items-center space-x-2 mb-16">
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
            <CardFooter className="flex-col gap-2 items-stretch">
              <div className="p-4 bg-green-100 text-green-800">
                {questionData.question.explanation}
              </div>

              <SaveQuestionButton
                id={id}
                questionData={questionData}
                onIdUpdated={(id) => updateQuestionId(sequence, id)}
              />
            </CardFooter>
          </QuestionCard>
        ))}
      </div>
    </>
  );
};

export default QuizFeedback;
