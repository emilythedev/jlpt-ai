import GrammarQuiz from '@/components/GrammarQuiz';
import type { JLPTLevel } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/grammar/$level')({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      level: params.level as JLPTLevel,
    };
  },
})

function RouteComponent() {
  const { level } = Route.useParams();

  return <GrammarQuiz level={level as JLPTLevel} />
}
