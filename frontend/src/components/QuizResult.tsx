import QuestionCard from '@/components/QuestionCard';
import SaveQuestionButton from '@/components/SaveQuestionButton';
import { CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { revisionQuizAtoms } from '@/lib/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

const {
  getQuizAtom,
  updateQuestionIdAtom,
} = revisionQuizAtoms;

const QuizResult = () => {
  const {
    score,
    questionStates,
  } = useAtomValue(getQuizAtom);
  const updateQuestionId = useSetAtom(updateQuestionIdAtom);
  const [showWrongAnswerOnly, setShowWrongAnswerOnly] = useState<boolean>(false);

  const filteredQuestionStates = !showWrongAnswerOnly
    ? questionStates
    : questionStates.filter(data => !data.questionData.lastCorrectAt);

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">復習の結果</h2>
      <p className="text-lg">得点：{score} / {questionStates.length}</p>

      <div className="flex items-center space-x-2 mb-8">
        <Switch
          id='wrong-ans-only'
          checked={showWrongAnswerOnly}
          onCheckedChange={setShowWrongAnswerOnly}
        />
        <Label htmlFor="wrong-ans-only" className="text-base">不正解のみ</Label>
      </div>

      <div className="space-y-8">
        {filteredQuestionStates.map(({
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
              <div className="my-4 text-gray-500 text-base">
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
    </div>
  );
};

export default QuizResult;
