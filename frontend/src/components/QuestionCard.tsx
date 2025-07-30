import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/lib/types';
import React, { useEffect } from "react";

type QuestionCardOptionProps = {
  label: string;
  value: string;
  showCorrect?: boolean;
  isCorrect?: boolean;
}

const correctOptionClassName = 'bg-green-100 text-green-800';
const incorrectOptionClassName = 'has-[[data-state="checked"]]:bg-red-100 has-[[data-state="checked"]]:text-red-800';

const QuestionCardOption: React.FC<QuestionCardOptionProps> = ({ label, value, showCorrect, isCorrect }) => {
  return (
    <div className={`flex items-center space-x-2 ${showCorrect ? (isCorrect ? correctOptionClassName : incorrectOptionClassName) : ''}`}>
      <RadioGroupItem value={value} id={label} />
      <Label htmlFor={label} className="py-2">{label}</Label>
    </div>
  );
};

type QuestionCardProps = {
  question: Question;
  showAnswer?: boolean;
  onSelect?: (selectedIndex: number) => void;
  sequence: number;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSelect, showAnswer, sequence }) => {
  const [value, setValue] = React.useState<string | null>(null);
  const handleChange = (idxString: string) => {
    setValue(idxString);

    const idx = parseInt(idxString);
    if (onSelect && !isNaN(idx)) onSelect(idx);
  };

  useEffect(() => {
    setValue(null); // Reset value when question changes
  }, [question])

  return (
    <div className="p-8 border rounded shadow w-full bg-white">
      <div className="mb-8 font-semibold text-lg">{sequence}. {question.question}</div>
      <RadioGroup
        className="gap-1"
        onValueChange={handleChange}
        value={value}
        disabled={showAnswer}
      >
        {question.options.map((opt, idx) => (
          <QuestionCardOption
            key={idx}
            label={opt}
            value={`${idx}`}
            showCorrect={showAnswer}
            isCorrect={idx === question.correct_answer_index}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionCard;
