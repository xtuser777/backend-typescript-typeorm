import { EntitySchema } from 'typeorm';
import { IPerson } from './Person';

export interface IClient {
  id: number;
  register: string;
  person: IPerson;
}

export const Client = new EntitySchema<IClient>({
  name: 'client',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    register: { type: 'varchar', length: 10, nullable: false },
  },
  relations: {
    person: {
      type: 'one-to-one',
      target: 'person',
      joinColumn: { name: 'person_id' },
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
