import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { JLPTLevelValues, type JLPTLevel, type Question, type QuestionHistory } from '@/lib/types';
import React, { useCallback, useState } from 'react';
import QuizHistory from './QuizHistory';

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
  const [history, setHistory] = useState<QuestionHistory[]>([] as QuestionHistory[]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const addQuestion = useCallback((question: Question, selectedAnswer: string) => {
    if (selectedAnswer === question.correct_answer) setScore(n => n + 1);
    setHistory((prev) => [...prev, { ...question, selectedAnswer }]);
  }, [setHistory, setScore]);

  if (!selectedLevel) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="font-medium text-lg">JLPTレベルを選択：</div>
        <LevelSelector onSelect={setSelectedLevel} />
      </div>
    );
  }

  if (showHistory) {
    return (<QuizHistory history={history} />);
  }

  return (
    <>
      <div className="mb-4 font-medium">JLPT {selectedLevel.toUpperCase()} の問題</div>
      <div className="mb-4 font-medium">得点：{score}</div>
      <Quiz level={selectedLevel} onQuestionCompleted={addQuestion} />
      <Button
        variant="secondary"
        onClick={() => setShowHistory(true)}
      >End and View history</Button>
    </>
  );
};

export default GrammarQuiz;
