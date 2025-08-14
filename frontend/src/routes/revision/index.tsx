import QuestionBank from '@/components/QuestionBank';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/revision/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <QuestionBank />
};
