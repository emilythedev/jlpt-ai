import { getResultAtom } from '@/components/questionAtoms';
import QuizFeedback from '@/components/QuizFeedback';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';

export const Route = createFileRoute('/grammar/$level/result')({
  component: RouteComponent,
});

function RouteComponent() {
  const { level } = Route.useParams();
  const { score, answeredQuestions } = useAtomValue(getResultAtom);

  return (
    <>
      <div className="mb-4 font-medium">JLPT {level.toUpperCase()} の問題の結果</div>
      <div className="font-medium text-xl">得点：{score}</div>
      <div className="mb-4 text-sm">合計 {answeredQuestions.length} 問</div>
      <QuizFeedback feedbacks={answeredQuestions} />
    </>
  );
}
