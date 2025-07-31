import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { JLPTLevelValues, type JLPTLevel } from '@/lib/types';
import React from 'react';

interface LevelSelectorProps {
  onSelect: (level: JLPTLevel) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelect }) => {
  return (
    <>
      {JLPTLevelValues.map((level) => (
        <Button
          key={level}
          size="lg"
          variant="secondary"
          onClick={() => onSelect(level)}
        >
          {level.toUpperCase()}
        </Button>
      ))}
    </>
  );
};

const GrammarQuiz = () => {
  const [selectedLevel, setSelectedLevel] = React.useState<JLPTLevel | null>(null);


  if (!selectedLevel) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="font-medium text-lg">JLPTレベルを選択：</div>
        <LevelSelector onSelect={setSelectedLevel} />
      </div>
    );
  }

  return (
    <Quiz level={selectedLevel} />
  );
};

export default GrammarQuiz;
