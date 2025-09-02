import type { QuestionRecord } from '@/lib/types';
import Dexie, { type EntityTable } from 'dexie';

interface BaseModel {
  id: number;
  createdAt?: Date;
}

interface MultipleChoiceQuestionModel extends BaseModel, QuestionRecord {}

const db = new Dexie('jlpt-ai-db') as Dexie & {
  mc: EntityTable<
    MultipleChoiceQuestionModel,
    'id'
  >;
};

db.version(1).stores({
  mc: '++id, level, section, [level+section]',
});

db.mc.hook('creating', (_, obj) => {
  if (!obj.createdAt) {
    obj.createdAt = new Date();
  }
});

export { db };
export type { MultipleChoiceQuestionModel };
