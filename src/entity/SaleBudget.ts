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
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    value: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    validate: { type: 'date', nullable: false },
  },
  relations: {
    salesman: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: {
        name: 'salesman_id',
      },
      nullable: true,
    },
    client: {
      type: 'many-to-one',
      target: 'client',
      joinColumn: {
        name: 'client_id',
      },
      nullable: true,
    },
    destiny: {
      type: 'many-to-one',
      target: 'city',
      joinColumn: {
        name: 'destiny_id',
      },
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: {
        name: 'author_id',
      },
    },
    items: {
      type: 'many-to-many',
      target: 'sale_item',
      joinTable: {
        name: 'sale_budget_item',
        joinColumn: { name: 'sale_budget_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'sale_item_id', referencedColumnName: 'id' },
      },
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
