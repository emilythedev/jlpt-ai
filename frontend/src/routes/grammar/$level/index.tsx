import GrammarQuiz from '@/components/GrammarQuiz';
import { resetQuestionsAtom } from '@/components/questionAtoms';
import type { JLPTLevel } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const Route = createFileRoute('/grammar/$level/')({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      level: params.level as JLPTLevel,
    };
  },
})

function RouteComponent() {
  const { level } = Route.useParams();
  const resetQuestions = useSetAtom(resetQuestionsAtom);

  useEffect(() => {
    resetQuestions();
  }, []);

  return <GrammarQuiz level={level as JLPTLevel} />
}
