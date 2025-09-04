import GrammarQuiz from '@/components/GrammarQuiz';
import { grammarQuizFetchOptions } from '@/lib/queries';
import type { JLPTLevel } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

const quizSearchSchema = z.object({
  count: fallback(z.number().min(1).max(20), 1).default(1),
});

export const Route = createFileRoute('/grammar/$level')({
  component: RouteComponent,
  validateSearch: zodValidator(quizSearchSchema),
  beforeLoad: ({ params, search }) => {
    const { level } = params;
    const { count } = search;

    return {
      level: level as JLPTLevel,
      quizFetchOptions: grammarQuizFetchOptions(level as JLPTLevel, count),
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
