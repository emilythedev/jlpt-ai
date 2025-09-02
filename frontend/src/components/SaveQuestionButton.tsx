import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import type { QuestionRecord } from '@/lib/types';
import { Bookmark, Check } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';

interface SaveQuestionButtonProps {
  id?: number;
  questionRecord: QuestionRecord;
  onIdUpdated: (id?: number) => void;

  className?: string;
}

const SaveQuestionButton = ({ id, questionRecord, onIdUpdated, className }: SaveQuestionButtonProps) => {
  const isSaved = !!id;
  const [optimisticSaveState, setOptimisticSaveState] = useOptimistic(isSaved,
    (_, isSaved: boolean) => isSaved);

  const handleSave = async () => {
    startTransition(() => setOptimisticSaveState(true));

    try {
      const id = await db.mc.add(questionRecord);
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
        className={className}
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
      variant="outline"
      className={className}
      onClick={handleSave}
    >
      <Bookmark />
      後で復習
    </Button>
  );
};

export default SaveQuestionButton;
