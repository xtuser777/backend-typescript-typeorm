import { EntitySchema } from 'typeorm';
import { ICity } from './City';
import { IClient } from './Client';
import { IEmployee } from './Employee';
import { ISaleItem } from './SaleItem';

export interface ISaleBudget {
  id: number;
  description: string;
  date: string;
  clientName: string;
  clientDocument: string;
  clientPhone: string;
  clientCellphone: string;
  clientEmail: string;
  weight: number;
  value: number;
  validate: string;
  salesman?: IEmployee;
  client?: IClient;
  destiny: ICity;
  author: IEmployee;
  items: ISaleItem[];
}

export const SaleBudget = new EntitySchema<ISaleBudget>({
  name: 'sale_budget',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 70, nullable: false },
    date: { type: 'date', nullable: false },
    clientName: { type: 'varchar', length: 70, nullable: false },
    clientDocument: { type: 'varchar', length: 18, nullable: false },
    clientPhone: { type: 'varchar', length: 14, nullable: false },
    clientCellphone: { type: 'varchar', length: 15, nullable: false },
    clientEmail: { type: 'varchar', length: 80, nullable: false },
    weight: { type: 'float', nullable: false },
    value: { type: 'decimal', nullable: false },
    validate: { type: 'date', nullable: false },
  },
  relations: {
    salesman: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: {
        name: 'employeeId',
      },
      nullable: true,
    },
    client: {
      type: 'many-to-one',
      target: 'client',
      joinColumn: {
        name: 'clientId',
      },
      nullable: true,
    },
    destiny: {
      type: 'many-to-one',
      target: 'city',
      joinColumn: {
        name: 'cityId',
      },
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: {
        name: 'userId',
      },
    },
    items: {
      type: 'many-to-many',
      target: 'sale_item',
      joinTable: {
        name: 'sale_budget_item',
        joinColumn: { name: 'sale_budget', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'sale_item', referencedColumnName: 'id' },
      },
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
