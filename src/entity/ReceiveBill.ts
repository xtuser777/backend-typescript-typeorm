import { EntitySchema } from 'typeorm';
import { IEmployee } from './Employee';
import { IFreightOrder } from './FreightOrder';
import { IPaymentForm } from './PaymentForm';
import { IRepresentation } from './Representation';
import { ISaleOrder } from './SaleOrder';

export interface IReceiveBill {
  id: number;
  date: string;
  bill: number;
  description: string;
  payer: string;
  amount: number;
  comission: boolean;
  situation: number;
  dueDate: string;
  receiveDate?: string;
  amountReceived: number;
  pendency?: IReceiveBill;
  paymentForm?: IPaymentForm;
  representation?: IRepresentation;
  saleOrder?: ISaleOrder;
  freightOrder?: IFreightOrder;
  author: IEmployee;
}

export const ReceiveBill = new EntitySchema<IReceiveBill>({
  name: 'receive_bill',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date', nullable: false },
    bill: { type: 'integer', nullable: false },
    description: { type: 'varchar', length: 100, nullable: false },
    payer: { type: 'varchar', length: 50, nullable: false },
    amount: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    comission: { type: 'boolean', nullable: false },
    situation: { type: 'integer', nullable: false },
    dueDate: { type: 'date', nullable: false },
    receiveDate: { type: 'date', nullable: true },
    amountReceived: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
  relations: {
    pendency: {
      type: 'many-to-one',
      target: 'receive_bill',
      joinColumn: { name: 'receive_bill_id' },
      nullable: true,
    },
    paymentForm: {
      type: 'many-to-one',
      target: 'payment_form',
      joinColumn: { name: 'payment_form_id' },
      nullable: true,
    },
    representation: {
      type: 'many-to-one',
      target: 'representation',
      joinColumn: { name: 'representation_id' },
      nullable: true,
    },
    freightOrder: {
      type: 'many-to-one',
      target: 'freight_order',
      joinColumn: { name: 'freight_order_id' },
      nullable: true,
      onDelete: 'CASCADE',
    },
    saleOrder: {
      type: 'many-to-one',
      target: 'sale_order',
      joinColumn: { name: 'sale_order_id' },
      nullable: true,
      onDelete: 'CASCADE',
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'author_id' },
      nullable: false,
    },
  },
});
