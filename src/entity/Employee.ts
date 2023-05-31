import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IPerson, Person } from './Person';
import { ILevel, Level } from './Level';

// @Entity()
// @Unique(['login'])
// export class Employee {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column('integer')
//   public type!: number;

//   @Column({ length: 10 })
//   public login!: string;

//   @Column({ length: 100 })
//   public passwordHash!: string;

//   @Column('date')
//   public admission!: string;

//   @Column('date', { nullable: true })
//   public demission?: string;

//   @OneToOne(() => Person, { cascade: true })
//   @JoinColumn()
//   public person!: Person;

//   @ManyToOne(() => Level)
//   public level!: Level;
// }

export interface IEmployee {
  id: number;
  type: number;
  login: string;
  passwordHash: string;
  admission: string;
  demission?: string;
  person: IPerson;
  level: ILevel;
}

export const Employee = new EntitySchema<IEmployee>({
  name: 'employee',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    type: { type: 'integer', nullable: false },
    login: { type: 'varchar', length: 10, nullable: false, unique: true },
    passwordHash: { type: 'varchar', length: 100, nullable: false },
    admission: { type: 'date', nullable: false },
    demission: { type: 'date', nullable: true },
  },
  relations: {
    person: { type: 'one-to-one', target: 'person', joinColumn: true, cascade: true },
    level: { type: 'many-to-one', target: 'level' },
  },
});
