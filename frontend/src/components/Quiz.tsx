import QuestionCard from '@/components/QuestionCard';
import SaveQuestionButton from '@/components/SaveQuestionButton';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type QuestionRecord, type QuestionRecordWithId } from '@/lib/types';
import { ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuizProps {
  questionRecords: QuestionRecordWithId[];
  onScoreUpdated?: (deltaScore: number) => void;
  onCompleted?: (totalQuestions: number) => void;
}

const Quiz = ({
  questionRecords,
  onScoreUpdated,
  onCompleted,
}: QuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState<number | undefined>();
  const [newQuestionRecord, setNewQuestionRecord] = useState<QuestionRecord | null>(null);

  const totalQuestions = questionRecords.length;
  const sequence = currentIndex + 1;
  const currentQuestionRecord = questionRecords[currentIndex];
  const question = currentQuestionRecord.question;
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  useEffect(() => {
    setCurrentQuestionId(currentQuestionRecord.id);
  }, [currentQuestionRecord.id]);

  const handleNextQuestion = () => {
    setAnswer('');
    setNewQuestionRecord(null);
    setCurrentQuestionId(undefined);

    if (isLastQuestion) {
      onCompleted?.(totalQuestions);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleAnswered = (ans: string) => {
    const isCorrect = question.correct_answer === ans;
    setAnswer(ans);

    setNewQuestionRecord({
      ...currentQuestionRecord,
      lastCorrectAt: isCorrect ? new Date() : undefined,
    });

    if (isCorrect) {
      onScoreUpdated?.(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          問題 {sequence} / {totalQuestions}
        </p>
        <Progress value={(sequence / totalQuestions) * 100} />
      </div>
      <QuestionCard
        question={question}
        showResult={!!answer}
        onAnswered={handleAnswered}
        sequence={sequence}
      >
        {answer && (
          <CardFooter className="flex-col gap-2 items-stretch text-muted-foreground text-sm">
            {question.explanation}
          </CardFooter>
        )}
      </QuestionCard>

      <div className="flex justify-end gap-4">
        {newQuestionRecord && (
          <SaveQuestionButton
            id={currentQuestionId}
            onIdUpdated={setCurrentQuestionId}
            questionRecord={newQuestionRecord}
          />
        )}
        <Button onClick={handleNextQuestion} disabled={!answer}>
          <span>{isLastQuestion ? '完了' : '次へ'}</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
