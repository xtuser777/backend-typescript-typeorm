import { EntitySchema } from 'typeorm';
import { IEmployee } from './Employee';
import { IStatus } from './Status';

export interface IOrderStatus {
  id: number;
  status: IStatus;
  date: string;
  time: string;
  observation: string;
  author: IEmployee;
}

export const OrderStatus = new EntitySchema<IOrderStatus>({
  name: 'order_status',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date', nullable: false },
    time: { type: 'time', nullable: false },
    observation: { type: 'varchar', nullable: false },
  },
  relations: {
    status: { type: 'many-to-one', target: 'status', joinColumn: { name: 'status_id' } },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'employee_id' },
    },
  },
});
