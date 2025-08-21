import RevisionQuiz from '@/components/RevisionQuiz';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/revision/start')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RevisionQuiz />
  );
}
