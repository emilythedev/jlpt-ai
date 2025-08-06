import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { db, type MultipleChoiceQuestionModel } from '@/lib/db';
import type { Question, QuestionFeedback } from '@/lib/types';
import { Bookmark, Check } from 'lucide-react';
import { startTransition, useOptimistic, useState } from 'react';
import QuestionCard from './QuestionCard';

interface SaveToQuestionBankButtonProps {
  question: Question;
  selectedAnswer: string;
}

type QuestionSaveState = {
  isSaved: boolean;
  id?: number;
};

const SaveToQuestionBankButton = ({ question, selectedAnswer }: SaveToQuestionBankButtonProps) => {
  const [saveState, setSaveState] = useState<QuestionSaveState>({ isSaved: false });
  const [optimisticSaveState, setOptimisticSaveState] = useOptimistic(saveState,
    (_, action: 'SAVE' | 'UNSAVE') => {
      return  { isSaved: action === 'SAVE' };
    }
  );

  const handleSave = async () => {
    startTransition(() => setOptimisticSaveState('SAVE'));

    try {
      const questionId = await db.mc.add({
        level: 'n3', // TODO: global setting
        section: 'grammar',
        question,
        lastCorrectAt: selectedAnswer === question.correct_answer ? new Date() : undefined,
      } as MultipleChoiceQuestionModel);

      startTransition(() => setSaveState({ isSaved: true, id: questionId }));
    } catch (err) {
      console.log(err);
      startTransition(() => setSaveState({ isSaved: false })); // rollback optimistic state
    }
  };

  const handleUnsave = async () => {
    startTransition(() => setOptimisticSaveState('UNSAVE'));

    if (!saveState.id) return;

    try {
      await db.mc.delete(saveState.id);
      startTransition(() => setSaveState({ isSaved: false }));
    } catch (err) {
      console.log(err);
      startTransition(() => setSaveState(state => ({...state}))); // rollback optimistic state
    }
  };

  if (optimisticSaveState.isSaved) {
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
    feedbacks.filter(q => q.correct_answer !== q.selectedAnswer);
  // BUG: lost db state after save correct question and then toggle visibility

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
            <div className="mt-8 mb-8 p-4 bg-green-100 text-green-800">
              {question.explanation}
            </div>

            <SaveToQuestionBankButton
              question={question}
              selectedAnswer={selectedAnswer}
            />
          </QuestionCard>
        ))}
      </div>
    </>
  );
};

export default QuizFeedback;
