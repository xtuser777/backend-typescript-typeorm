import { EntitySchema } from 'typeorm';
import { IEmployee } from './Employee';
import { ISaleOrder } from './SaleOrder';
import { IFreightOrder } from './FreightOrder';

export interface IEvent {
  id: number;
  description: string;
  date: string;
  time: string;
  saleOrder?: ISaleOrder;
  freightOrder?: IFreightOrder;
  author: IEmployee;
}

export const Event = new EntitySchema<IEvent>({
  name: 'event',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 100, nullable: false },
    date: { type: 'date', nullable: false },
    time: { type: 'time', nullable: false },
  },
  relations: {
    saleOrder: {
      type: 'many-to-one',
      target: 'sale_order',
      joinColumn: { name: 'sale_order_id' },
      nullable: true,
    },
    freightOrder: {
      type: 'many-to-one',
      target: 'freight_order',
      joinColumn: { name: 'freight_order_id' },
      nullable: true,
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'author_id' },
      nullable: false,
    },
  },
});
