import { EntitySchema } from 'typeorm';
import { IPerson } from './Person';
import { IBankData } from './BankData';

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
      joinColumn: { name: 'person_id' },
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    bankData: {
      type: 'one-to-one',
      target: 'bank_data',
      joinColumn: { name: 'bank_data_id' },
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
