import type { JLPTLevel, Question, Section } from '@/lib/types';
import Dexie, { type EntityTable } from 'dexie';

interface BaseModel {
  id: number;
  createdAt?: Date;
}

interface MultipleChoiceQuestionModel {
  level: JLPTLevel;
  section: Section;
  question: Question;
  lastCorrectAt?: Date;
}

const db = new Dexie('jlpt-ai-db') as Dexie & {
  mc: EntityTable<
    MultipleChoiceQuestionModel & BaseModel,
    'id'
  >;
};

db.version(1).stores({
  mc: '++id, level, section, lastCorrectAt',
});

db.mc.hook('creating', (_, obj) => {
  if (!obj.createdAt) {
    obj.createdAt = new Date();
  }
});

export { db };
export type { MultipleChoiceQuestionModel };
