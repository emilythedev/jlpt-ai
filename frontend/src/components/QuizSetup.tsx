import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const scopes = ['すべて', '使役形・受身形', '接續詞', '依頼・許可・禁止', '助詞', '複合動詞', '尊敬語・謙譲語'];

interface ScopeSelectorProps {
  onChange: (scope: string) => void;
  value?: string;
}

const ScopeSelector: React.FC<ScopeSelectorProps> = ({ onChange, value }) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="出題範囲を選択" />
      </SelectTrigger>
      <SelectContent>
        {scopes.map((scope) => (
          <SelectItem key={scope} value={scope}>
            {scope}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

function QuizSetup() {
  const router = useRouter();
  const [level, setLevel] = useState<JLPTLevel>('n5');
  const [count, setCount] = useState(5);
  const [scope, setScope] = useState('すべて');

  const handleStart = () => {
    router.navigate({
      to: '/grammar/$level',
      params: { level },
      search: {
        count,
        scope: scope === 'すべて' ? undefined : scope,
      },
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
      <div className="space-y-4">
        <h2 className="font-medium text-lg">出題範囲</h2>
        <ScopeSelector onChange={setScope} value={scope} />
      </div>
      <Button size="lg" className="mt-8" onClick={handleStart}>
        クイズをスタート！
      </Button>
    </div>
  );
}

export default QuizSetup
