import QuizResult from '@/components/QuizResult';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/revision/result')({
  component: QuizResult,
});
