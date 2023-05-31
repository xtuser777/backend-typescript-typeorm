import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  EntitySchema,
} from 'typeorm';
import { IPerson, Person } from './Person';

// @Entity()
// export class Client {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 10 })
//   public register!: string;

//   @OneToOne(() => Person, { cascade: true })
//   @JoinColumn()
//   public person!: Person;
// }

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
    person: { type: 'one-to-one', target: 'person', joinColumn: true, cascade: true },
  },
});
