import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/lib/types';
import { cn } from '@/lib/utils';
import React, { useEffect } from "react";

const correctOptionClassName = 'bg-green-100 text-green-800';
const incorrectOptionClassName = 'has-[[data-state="checked"]]:bg-red-100 has-[[data-state="checked"]]:text-red-800';

type QuestionCardOptionProps = {
  label: string;
  value: string;
  className?: string;
}

const QuestionCardOption: React.FC<QuestionCardOptionProps> = ({ label, value, className }) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <RadioGroupItem value={value} id={label} />
      <Label htmlFor={label} className="py-2">{label}</Label>
    </div>
  );
};

type QuestionCardProps = {
  question: Question;
  showResult?: boolean;
  onAnswered?: (answer: string) => void;
  sequence: number;
  defaultValue?: string;
};

const QuestionCard = ({ question, onAnswered, showResult, sequence, defaultValue }: QuestionCardProps) => {
  const [value, setValue] = React.useState<string>(defaultValue || '');
  const handleChange = (value: string) => {
    setValue(value);
    if (onAnswered) onAnswered(value);
  };

  useEffect(() => {
    setValue(defaultValue || ''); // Reset value when question changes
    // as `defaultValue` prop on <RadioGroup> will be overwrittened by `value`
  }, [question, defaultValue])

  return (
    <div className="p-8 border rounded shadow w-full bg-white">
      <div className="mb-8 font-semibold text-lg">{sequence}. {question.question}</div>
      <RadioGroup
        className="gap-1"
        onValueChange={handleChange}
        value={value}
        disabled={showResult}
      >
        {question.options.map((opt, idx) => {
          const isCorrectOption = opt === question.correct_answer;
          const className = !showResult ? '' :
            (isCorrectOption ? correctOptionClassName : incorrectOptionClassName);
          return (
            <QuestionCardOption
              key={idx}
              label={opt}
              value={opt}
              className={className}
            />
          );
        })}
      </RadioGroup>
    </div>
  );
};

QuestionCard.Skeleton = ({ className }: { className?: string }) => (
  <div className={cn(className, 'p-8 border rounded shadow w-full bg-white animate-pulse')}>
    <div className="mb-8 h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="space-y-2">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="h-8 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  </div>
);

export default QuestionCard;
