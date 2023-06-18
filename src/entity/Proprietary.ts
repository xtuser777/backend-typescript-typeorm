import { EntitySchema } from 'typeorm';
import { IDriver } from './Driver';
import { IPerson } from './Person';

export interface IProprietary {
  id: number;
  register: string;
  driver?: IDriver;
  person: IPerson;
}

export const Proprietary = new EntitySchema<IProprietary>({
  name: 'proprietary',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    register: { type: 'date', nullable: false },
  },
  relations: {
    driver: { type: 'one-to-one', target: 'driver', joinColumn: true, nullable: true },
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
