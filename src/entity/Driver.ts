import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  EntitySchema,
} from 'typeorm';
import { IPerson } from './Person';
import { IBankData } from './BankData';

// @Entity()
// export class Driver {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 10 })
//   public register!: string;

//   @Column({ length: 11 })
//   public cnh!: string;

//   @OneToOne(() => Person, { cascade: true })
//   @JoinColumn()
//   public person!: Person;

//   @OneToOne(() => BankData, { cascade: true })
//   @JoinColumn()
//   public bankData!: BankData;
// }

export interface IDriver {
  id: number;
  register: string;
  cnh: string;
  person: IPerson;
  bankData: IBankData;
}

export const Driver = new EntitySchema<IDriver>({
  name: 'driver',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    register: { type: 'varchar', length: 10, nullable: false },
    cnh: { type: 'varchar', length: 11, nullable: false },
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
    bankData: {
      type: 'one-to-one',
      target: 'bank_data',
      joinColumn: true,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
