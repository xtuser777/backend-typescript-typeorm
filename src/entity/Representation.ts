import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPerson, Person } from './Person';

// @Entity('representation')
// export class Representation {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column('date')
//   public register!: string;

//   @Column({ length: 40 })
//   public unity!: string;

//   @OneToOne(() => Person, { cascade: true })
//   @JoinColumn()
//   public person!: Person;
// }

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
    person: { type: 'one-to-one', target: 'person', joinColumn: true, cascade: true },
  },
});
