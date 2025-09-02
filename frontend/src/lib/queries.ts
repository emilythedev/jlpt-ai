import axios from 'axios';
import type { JLPTLevel, Question } from './types';

const grammarApiUrl = 'http://localhost:8000/grammar_quiz';
const fetchQuestions = async (level: JLPTLevel, count: number = 1) => {
  const response = await axios.get<Question[]>(grammarApiUrl + `?lv=${level}&c=${count}`);
  return response.data;
};

export const grammarQuizFetchOptions = (level: JLPTLevel, count: number = 1) => ({
  queryKey: ['grammarQuiz', { level, count }],
  queryFn: async () => fetchQuestions(level, count),
});
