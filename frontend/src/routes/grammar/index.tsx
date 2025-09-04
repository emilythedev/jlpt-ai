import { Button } from '@/components/ui/button';
import { JLPTLevelValues, type JLPTLevel } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/grammar/')({
  component: RouteComponent,
});

interface LevelSelectorProps {
  onChange: (level: JLPTLevel) => void;
  value?: JLPTLevel;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onChange, value }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {JLPTLevelValues.map((level) => (
        <Button
          key={level}
          size="lg"
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
          size="lg"
          variant={value === count ? 'default' : 'secondary'}
          onClick={() => onChange(count)}
        >
          {count}問
        </Button>
      ))}
    </div>
  );
};

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [level, setLevel] = useState<JLPTLevel>('n5');
  const [count, setCount] = useState(5);

  const handleStart = () => {
    navigate({
      to: '/grammar/$level',
      params: { level },
      search: { count },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="font-medium text-lg">1. JLPTレベルを選択：</h2>
        <LevelSelector onChange={setLevel} value={level} />
      </div>
      <div className="space-y-4">
        <h2 className="font-medium text-lg">2. 問題数を選択：</h2>
        <QuestionCountSelector onChange={setCount} value={count} />
      </div>
      <Button size="lg" className="w-full" onClick={handleStart}>
        クイズをスタート！
      </Button>
    </div>
  );
}
