import QuestionBank from '@/components/QuestionBank';
import RevisionQuiz from '@/components/RevisionQuiz';
import type { QuestionRecordWithId } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/revision')({
  component: RouteComponent,
});

function RouteComponent() {
  const [questionRecords, setQuestionRecords] = useState<QuestionRecordWithId[]>([]);

  if (questionRecords.length > 0) {
    return (
      <RevisionQuiz
        questionRecords={questionRecords}
        onReturn={() => setQuestionRecords([])}
      />
    );
  }

  return (
    <QuestionBank
      onRevisionStart={setQuestionRecords}
    />
  );
};
