import axios from 'axios';
import type { JLPTLevel, Question } from './types';

const grammarApiUrl = 'http://localhost:8000/grammar_quiz';
const fetchQuestions = async (level: JLPTLevel, count: number = 1, scope?: string) => {
  const response = await axios.get<Question[]>(grammarApiUrl, {
    params: { lv: level, c: count, scp: scope },
  });
  return response.data;
};

export const grammarQuizFetchOptions = (level: JLPTLevel, count: number = 1, scope?: string) => ({
  queryKey: ['grammarQuiz', { level, count, scope: scope ?? undefined }],
  queryFn: async () => fetchQuestions(level, count, scope),
});
