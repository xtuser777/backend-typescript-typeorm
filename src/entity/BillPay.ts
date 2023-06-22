import { EntitySchema } from 'typeorm';
import { IBillPayCategory } from './BillPayCategory';
import { IDriver } from './Driver';
import { IEmployee } from './Employee';
import { IFreightOrder } from './FreightOrder';
import { IPaymentForm } from './PaymentForm';
import { ISaleOrder } from './SaleOrder';

export interface IBillPay {
  id: number;
  date: string;
  bill: number;
  type: number;
  description: string;
  enterprise: string;
  installment: number;
  amount: number;
  comission: boolean;
  situation: number;
  dueDate: string;
  paymentDate?: string;
  amountPaid: number;
  pendency?: IBillPay;
  driver?: IDriver;
  salesman?: IEmployee;
  freightOrder?: IFreightOrder;
  saleOrder?: ISaleOrder;
  paymentForm?: IPaymentForm;
  category: IBillPayCategory;
  author: IEmployee;
}

export const BillPay = new EntitySchema<IBillPay>({
  name: 'bill_pay',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date', nullable: false },
    bill: { type: 'integer', nullable: false },
    type: { type: 'integer', nullable: false },
    description: { type: 'varchar', length: 100, nullable: false },
    enterprise: { type: 'varchar', length: 50, nullable: false },
    installment: { type: 'integer', nullable: false },
    amount: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    comission: { type: 'boolean', nullable: false },
    situation: { type: 'integer', nullable: false },
    dueDate: { type: 'date', nullable: false },
    paymentDate: { type: 'date', nullable: true },
    amountPaid: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
  relations: {
    pendency: {
      type: 'many-to-one',
      target: 'bill_pay',
      joinColumn: { name: 'pendency_id' },
      nullable: true,
    },
    driver: {
      type: 'many-to-one',
      target: 'driver',
      joinColumn: { name: 'driver_id' },
      nullable: true,
    },
    salesman: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'salesman_id' },
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
    paymentForm: {
      type: 'many-to-one',
      target: 'payment_form',
      joinColumn: { name: 'payment_form_id' },
      nullable: true,
    },
    category: {
      type: 'many-to-one',
      target: 'bill_pay_category',
      joinColumn: { name: 'category_id' },
      nullable: false,
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'author_id' },
      nullable: false,
    },
  },
});
