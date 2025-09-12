import QuizSetup from '@/components/QuizSetup';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: QuizSetup,
});
