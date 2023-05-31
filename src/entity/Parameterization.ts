import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { IPerson, Person } from './Person';

// @Entity()
// export class Parameterization {
//   @PrimaryColumn()
//   public id!: number;

//   @Column()
//   public logotype!: string;

//   @OneToOne(() => Person, { cascade: true })
//   @JoinColumn()
//   public person!: Person;
// }

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
    person: { type: 'one-to-one', target: 'person', joinColumn: true, cascade: true },
  },
});
