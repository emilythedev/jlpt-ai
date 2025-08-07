import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { db, type MultipleChoiceQuestionModel } from '@/lib/db';
import type { Question, QuestionFeedback } from '@/lib/types';
import { Bookmark, Check } from 'lucide-react';
import { startTransition, useEffect, useOptimistic, useState } from 'react';
import QuestionCard from './QuestionCard';

interface SaveToQuestionBankButtonProps {
  question: Question
  correctAnsweredAt?: Date;
}

const SaveToQuestionBankButton = ({ question, correctAnsweredAt }: SaveToQuestionBankButtonProps) => {
  const id = question.generatedAt.getTime();

  const [saveState, setSaveState] = useState<boolean>(false);
  const [optimisticSaveState, setOptimisticSaveState] = useOptimistic(saveState,
    (_, isSaved: boolean) => isSaved);

  useEffect(() => {
    db.mc.get(id)
      .then((obj) => setSaveState(!!obj))
      .catch((err) => console.log(err));
  }, [id])

  const handleSave = async () => {
    startTransition(() => setOptimisticSaveState(true));

    try {
      await db.mc.add({
        id,
        level: 'n3', // TODO: global setting
        section: 'grammar',
        question,
        lastCorrectAt: correctAnsweredAt,
      } as MultipleChoiceQuestionModel);

      startTransition(() => setSaveState(true));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsave = async () => {
    startTransition(() => setOptimisticSaveState(false));

    try {
      await db.mc.delete(id);
      startTransition(() => setSaveState(false));
    } catch (err) {
      console.log(err);
    }
  };

  if (optimisticSaveState) {
    return (
      <Button
        variant="ghost"
        onClick={handleUnsave}
      >
        <Check />
        保存した
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSave}
    >
      <Bookmark />
      後で復習
    </Button>
  );
};

interface QuizFeedbackProps {
  feedbacks: QuestionFeedback[];
}

const QuizFeedback = ({ feedbacks }: QuizFeedbackProps) => {
  const [showWrongAnswerOnly, setShowWrongAnswerOnly] = useState<boolean>(false);

  const filteredFeedbacks = !showWrongAnswerOnly ? feedbacks :
    feedbacks.filter(q => !q.correctAnsweredAt);

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
          correctAnsweredAt,
          ...question
        }) => (
          <QuestionCard
            key={sequence}
            sequence={sequence}
            question={question}
            defaultValue={answer}
            showResult
          >
            <div className="mt-8 mb-8 p-4 bg-green-100 text-green-800">
              {question.explanation}
            </div>

            <SaveToQuestionBankButton
              question={question}
              correctAnsweredAt={correctAnsweredAt}
            />
          </QuestionCard>
        ))}
      </div>
    </>
  );
};

export default QuizFeedback;
