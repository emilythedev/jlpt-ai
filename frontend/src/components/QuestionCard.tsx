import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  children?: React.ReactNode;
  className?: string;
};

const QuestionCard = ({
  question,
  onAnswered,
  showResult,
  sequence,
  defaultValue,
  children,
  className,
}: QuestionCardProps) => {
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
    <Card className={className}>
      <CardHeader>
        <CardTitle>{sequence}. {question.question}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      {children}
    </Card>
  );
};

QuestionCard.Loading = ({ className }: { className?: string }) => (
  <Card className={cn(className, 'animate-pulse')}>
    <CardHeader>
      <CardTitle className="h-6 bg-gray-200 rounded w-full"></CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-6 bg-gray-200 rounded w-64"></div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default QuestionCard;
