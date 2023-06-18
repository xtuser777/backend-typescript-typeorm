import { EntitySchema } from 'typeorm';
import { IPerson } from './Person';

export interface IParameterization {
  id: number;
  logotype: string;
  person: IPerson;
}

export const Parameterization = new EntitySchema<IParameterization>({
  name: 'parameterization',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    logotype: { type: 'varchar', nullable: false },
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
