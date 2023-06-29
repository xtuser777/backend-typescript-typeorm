import { EntitySchema } from 'typeorm';
import { ICity } from './City';
import { IClient } from './Client';
import { IEmployee } from './Employee';
import { IPaymentForm } from './PaymentForm';
import { ISaleBudget } from './SaleBudget';
import { ISaleItem } from './SaleItem';
//import { ITruckType } from './TruckType';

export interface ISaleOrder {
  id: number;
  date: string;
  description: string;
  weight: number;
  value: number;
  salesman?: IEmployee;
  destiny: ICity;
  budget?: ISaleBudget;
  //truckType: ITruckType;
  client: IClient;
  paymentForm: IPaymentForm;
  author: IEmployee;
  items: ISaleItem[];
}

export const SaleOrder = new EntitySchema<ISaleOrder>({
  name: 'sale_order',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date', nullable: false },
    description: { type: 'varchar', length: 150, nullable: false },
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    value: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
  relations: {
    salesman: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'salesman_id' },
      nullable: true,
    },
    budget: {
      type: 'many-to-one',
      target: 'sale_budget',
      joinColumn: { name: 'sale_budget_id' },
      nullable: true,
    },
    destiny: {
      type: 'many-to-one',
      target: 'city',
      joinColumn: { name: 'destiny_id' },
      nullable: false,
    },
    // truckType: {
    //   type: 'many-to-one',
    //   target: 'truck_type',
    //   joinColumn: { name: 'truck_type_id' },
    //   nullable: false,
    // },
    client: {
      type: 'many-to-one',
      target: 'client',
      joinColumn: { name: 'client_id' },
      nullable: false,
    },
    paymentForm: {
      type: 'many-to-one',
      target: 'payment_form',
      joinColumn: { name: 'payment_form_id' },
      nullable: false,
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'author_id' },
      nullable: false,
    },
    items: {
      type: 'one-to-many',
      target: 'sale_item',
      inverseSide: 'order',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
