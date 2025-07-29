import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/lib/types';
import React, { useEffect } from "react";

type QuestionCardProps = {
  question: Question;
  onSelect?: (selectedIndex: number) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSelect }) => {
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
    <div className="p-4 border rounded shadow max-w-xl bg-white">
      <div className="mb-4 font-semibold text-lg">{question.question}</div>
      <RadioGroup
        className="flex flex-col"
        onValueChange={handleChange}
        value={value}
      >
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <RadioGroupItem value={`${idx}`} id={opt} />
            <Label htmlFor={opt}>{opt}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionCard;
