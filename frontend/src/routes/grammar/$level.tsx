import GrammarQuiz from '@/components/GrammarQuiz';
import { grammarQuizFetchOptions } from '@/lib/queries';
import type { JLPTLevel } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/grammar/$level')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const { level } = params;
    return {
      level: level as JLPTLevel,
      quizFetchOptions: grammarQuizFetchOptions(level as JLPTLevel, 5),
    };
  },
  loader: ({ context: { queryClient, quizFetchOptions } }) => {
    queryClient.prefetchQuery(quizFetchOptions);
  },
})

function RouteComponent() {
  const { level } = Route.useRouteContext();

  return (
    <GrammarQuiz
      level={level as JLPTLevel}
    />
  );
}
