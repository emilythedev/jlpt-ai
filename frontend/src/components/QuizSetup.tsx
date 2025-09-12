import { Button } from '@/components/ui/button';
import { type JLPTLevel, JLPTLevelValues } from '@/lib/types';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

interface LevelSelectorProps {
  onChange: (level: JLPTLevel) => void;
  value?: JLPTLevel;
}

const sortedJLPTLevelValues = JLPTLevelValues.slice().reverse();

const LevelSelector: React.FC<LevelSelectorProps> = ({ onChange, value }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sortedJLPTLevelValues.map((level) => (
        <Button
          key={level}
          variant={value === level ? 'default' : 'secondary'}
          onClick={() => onChange(level)}
        >
          {level.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

const questionCounts = [5, 10, 15, 20];

interface QuestionCountSelectorProps {
  onChange: (count: number) => void;
  value?: number;
}

const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({ onChange, value }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {questionCounts.map((count) => (
        <Button
          key={count}
          variant={value === count ? 'default' : 'secondary'}
          onClick={() => onChange(count)}
        >
          {count}問
        </Button>
      ))}
    </div>
  );
};

function QuizSetup() {
  const router = useRouter();
  const [level, setLevel] = useState<JLPTLevel>('n5');
  const [count, setCount] = useState(5);

  const handleStart = () => {
    router.navigate({
      to: '/grammar/$level',
      params: { level },
      search: { count },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-8 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold tracking-tight">文法クイズ</h1>
      <div className="space-y-4">
        <h2 className="font-medium text-lg">JLPTレベル</h2>
        <LevelSelector onChange={setLevel} value={level} />
      </div>
      <div className="space-y-4">
        <h2 className="font-medium text-lg">問題数</h2>
        <QuestionCountSelector onChange={setCount} value={count} />
      </div>
      <Button size="lg" className="mt-8" onClick={handleStart}>
        クイズをスタート！
      </Button>
    </div>
  );
}

export default QuizSetup
