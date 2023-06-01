import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Driver, IDriver } from './Driver';
import { IPerson, Person } from './Person';

// @Entity()
// export class Proprietary {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column('date')
//   public register!: string;

//   @OneToOne(() => Driver, { nullable: true })
//   @JoinColumn()
//   public driver?: Driver;

//   @OneToOne(() => Person, { cascade: true })
//   @JoinColumn()
//   public person!: Person;
// }

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
    person: { type: 'one-to-one', target: 'person', joinColumn: true, cascade: true },
  },
});
