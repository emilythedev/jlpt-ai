import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db, type MultipleChoiceQuestionModel } from '@/lib/db';
import { JLPTLevelValues, SectionValues, type JLPTLevel, type Section } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type CollectionFilterQuery = Partial<Pick<MultipleChoiceQuestionModel, 'level' | 'section'>>;

interface FilterForm {
  level: string;
  section: string;
  lastCorrect: string;
}
interface QuestionBankFilterProps {
  className?: string
  onChanged?: (values: FilterForm) => void;
}

const defaultFilterValues = {
  level: '',
  section: '',
  lastCorrect: '',
};

const sectionLabels = {
  'grammar': '文法',
  'vocabulary': '語彙',
};

const QuestionBankFilter = ({ className, onChanged }: QuestionBankFilterProps) => {
  const [values, setValues] = useState<FilterForm>({...defaultFilterValues});

  useEffect(() => {
    onChanged?.(values);
  }, [values, onChanged])

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }

  const handleReset = () => {
    setValues({...defaultFilterValues});
  }

  return (
    <div className={cn(className, 'space-y-4')}>
      <div className="flex gap-4 justify-stretch">
        <Select value={values.level} onValueChange={value => handleChange('level', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="JLPT レベル" />
          </SelectTrigger>
          <SelectContent>
            {JLPTLevelValues.map(value => (
              <SelectItem key={value} value={value}>{value.toUpperCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={values.section} onValueChange={value => handleChange('section', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="分野" />
          </SelectTrigger>
          <SelectContent>
            {SectionValues.map(value => (
              <SelectItem key={value} value={value}>{sectionLabels[value]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={values.lastCorrect} onValueChange={value => handleChange('lastCorrect', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="正誤" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="incorrect">未正解</SelectItem>
            <SelectItem value="correct">正解済み</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleReset}>クリア</Button>
      </div>
    </div>
  );
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState<MultipleChoiceQuestionModel[]>([]);

  // Fetch questions from db with filters
  const handleFilterChanged = (values: FilterForm) => {
    const whereOpt: CollectionFilterQuery = {};

    if (values.level) whereOpt.level = values.level as JLPTLevel;
    if (values.section) whereOpt.section = values.section as Section;

    let query = Object.keys(whereOpt).length > 0
      ? db.mc.where(whereOpt) : db.mc;
    if (values.lastCorrect === 'incorrect') {
      query = query.filter(question => !question.lastCorrectAt);
    } else if (values.lastCorrect === 'correct') {
      query = query.filter(question => !!question.lastCorrectAt);
    }

    query.reverse()
      .toArray()
      .then(setQuestions);
  };

  const handleRemove = async (id: number) => {
    await db.mc.delete(id);
    setQuestions(qs => qs.filter(q => q.id !== id));
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-8">保存された問題一覧</h2>
      <QuestionBankFilter className="w-full mb-16" onChanged={handleFilterChanged} />

      <div className="space-y-6">
        {questions.length === 0 && (
          <Card>
            <CardContent className="text-gray-500 py-6">該当する問題がありません。</CardContent>
          </Card>
        )}
        {questions.map(q => (
          <Card key={q.id}>
            <CardHeader>
              <CardDescription>
                {q.level.toUpperCase()} / {sectionLabels[q.section]}
                {q.lastCorrectAt && (
                  <span className="ml-2 text-xs text-green-800">
                    正解した
                  </span>
                )}
              </CardDescription>
              <CardTitle>{q.question.question}</CardTitle>
              <CardAction>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleRemove(q.id)}
                >
                  削除
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;
