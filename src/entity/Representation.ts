import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPerson } from './Person';

export interface IRepresentation {
  id: number;
  register: string;
  unity: string;
  person: IPerson;
}

export const Representation = new EntitySchema<IRepresentation>({
  name: 'representation',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    register: { type: 'date', nullable: false },
    unity: { type: 'varchar', length: 40, nullable: false },
  },
  relations: {
    person: {
      type: 'one-to-one',
      target: 'person',
      joinColumn: true,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
