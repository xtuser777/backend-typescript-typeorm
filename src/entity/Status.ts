import { EntitySchema } from 'typeorm';

export interface IStatus {
  id: number;
  description: string;
}

export const Status = new EntitySchema<IStatus>({
  name: 'status',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 15, nullable: false },
  },
});
