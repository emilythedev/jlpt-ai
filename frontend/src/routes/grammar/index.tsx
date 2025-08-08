import { Button } from '@/components/ui/button';
import { JLPTLevelValues, type JLPTLevel } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/grammar/')({
  component: RouteComponent,
});

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


function RouteComponent() {
  const navigate = Route.useNavigate();
  const handleLevelSelected = (level: JLPTLevel) => {
    navigate({ to: '/grammar/$level', params: { level } });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="font-medium text-lg">JLPTレベルを選択：</div>
      <LevelSelector onSelect={handleLevelSelected} />
    </div>
  );
}
