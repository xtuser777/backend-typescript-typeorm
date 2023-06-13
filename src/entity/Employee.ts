import { EntitySchema } from 'typeorm';
import { IPerson } from './Person';
import { ILevel } from './Level';

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
    person: {
      type: 'one-to-one',
      target: 'person',
      joinColumn: true,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    level: { type: 'many-to-one', target: 'level' },
  },
});
