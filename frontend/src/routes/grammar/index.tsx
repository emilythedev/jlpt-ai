import GrammarQuiz from '@/components/GrammarQuiz';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/grammar/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <GrammarQuiz />
  );
}
