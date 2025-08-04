import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { JLPTLevelValues, type JLPTLevel, type Question, type QuestionFeedback } from '@/lib/types';
import React, { useCallback, useState } from 'react';
import QuizFeedback from './QuizFeedback';

interface LevelSelectorProps {
  onSelect: (level: JLPTLevel) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelect }) => {
  return (
    <>
      {JLPTLevelValues.map((level) => (
        <Button
          key={level}
          size="lg"
          variant="secondary"
          onClick={() => onSelect(level)}
        >
          {level.toUpperCase()}
        </Button>
      ))}
    </>
  );
};

const GrammarQuiz = () => {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | null>(null);
  const [result, setResult] = useState<QuestionFeedback[]>([] as QuestionFeedback[]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const addQuestion = useCallback((question: Question, selectedAnswer: string) => {
    if (selectedAnswer === question.correct_answer) setScore(n => n + 1);
    setResult((prev) => [...prev, { ...question, selectedAnswer }]);
  }, [setResult, setScore]);

  if (!selectedLevel) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="font-medium text-lg">JLPTレベルを選択：</div>
        <LevelSelector onSelect={setSelectedLevel} />
      </div>
    );
  }

  if (showResult) {
    return (<QuizFeedback feedbacks={result} />);
  }

  return (
    <>
      <div className="mb-4 font-medium">JLPT {selectedLevel.toUpperCase()} の問題</div>
      <div className="mb-4 font-medium">得点：{score}</div>
      <Quiz level={selectedLevel} onQuestionCompleted={addQuestion} />
      <Button
        variant="secondary"
        onClick={() => setShowResult(true)}
        className="mt-8"
      >End and View Feedback</Button>
    </>
  );
};

export default GrammarQuiz;
