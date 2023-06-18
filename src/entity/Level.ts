import { EntitySchema } from 'typeorm';

export interface ILevel {
  id: number;
  description: string;
}

export const Level = new EntitySchema<ILevel>({
  name: 'level',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 20, nullable: false },
  },
});
