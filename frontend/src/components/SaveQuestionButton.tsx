import { Button } from '@/components/ui/button';
import { db, type MultipleChoiceQuestionModel } from '@/lib/db';
import { Bookmark, Check } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';

interface SaveQuestionButtonProps {
  id?: number;
  questionData: MultipleChoiceQuestionModel;
  onIdUpdated: (id?: number) => void;
}

const SaveQuestionButton = ({ id, questionData, onIdUpdated }: SaveQuestionButtonProps) => {
  const isSaved = !!id;
  const [optimisticSaveState, setOptimisticSaveState] = useOptimistic(isSaved,
    (_, isSaved: boolean) => isSaved);

  const handleSave = async () => {
    startTransition(() => setOptimisticSaveState(true));

    try {
      const id = await db.mc.add(questionData);
      onIdUpdated(id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsave = async () => {
    if (!id) return;

    startTransition(() => setOptimisticSaveState(false));

    try {
      await db.mc.delete(id);
      onIdUpdated();
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

export default SaveQuestionButton;
