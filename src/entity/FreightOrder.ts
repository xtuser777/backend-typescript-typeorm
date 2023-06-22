import { EntitySchema } from 'typeorm';
import { IPaymentForm } from './PaymentForm';
import { IFreightBudget } from './FreightBudget';
import { ISaleOrder } from './SaleOrder';
import { IRepresentation } from './Representation';
import { IClient } from './Client';
import { ICity } from './City';
import { ITruckType } from './TruckType';
import { IProprietary } from './Proprietary';
import { IDriver } from './Driver';
import { ITruck } from './Truck';
import { IOrderStatus } from './OrderStatus';
import { IEmployee } from './Employee';
import { IFreightItem } from './FreightItem';
import { ILoadStep } from './LoadStep';

export interface IFreightOrder {
  id: number;
  date: string;
  description: string;
  distance: number;
  weight: number;
  value: number;
  driverValue: number;
  driverEntry: number;
  shipping: string;
  budget?: IFreightBudget;
  saleOrder?: ISaleOrder;
  representation?: IRepresentation;
  client: IClient;
  destiny: ICity;
  truckType: ITruckType;
  proprietary: IProprietary;
  driver: IDriver;
  truck: ITruck;
  status: IOrderStatus;
  paymentFormFreight: IPaymentForm;
  paymentFormDriver: IPaymentForm;
  author: IEmployee;
  items: IFreightItem[];
  steps: ILoadStep[];
}

export const FreightOrder = new EntitySchema<IFreightOrder>({
  name: 'freight_order',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date', nullable: false },
    description: { type: 'varchar', length: 150, nullable: false },
    distance: { type: 'integer', nullable: false },
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    value: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    driverValue: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    driverEntry: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    shipping: { type: 'date', nullable: false },
  },
  relations: {
    budget: {
      type: 'many-to-one',
      target: 'freight_budget',
      joinColumn: { name: 'freight_budget_id' },
      nullable: true,
    },
    saleOrder: {
      type: 'many-to-one',
      target: 'sale_order',
      joinColumn: { name: 'sale_budget_id' },
      nullable: true,
    },
    representation: {
      type: 'many-to-one',
      target: 'representation',
      joinColumn: { name: 'representation_id' },
      nullable: true,
    },
    client: {
      type: 'many-to-one',
      target: 'client',
      joinColumn: { name: 'client_id' },
      nullable: false,
    },
    destiny: {
      type: 'many-to-one',
      target: 'city',
      joinColumn: { name: 'destiny_id' },
      nullable: false,
    },
    truckType: {
      type: 'many-to-one',
      target: 'truck_type',
      joinColumn: { name: 'truck_type_id' },
      nullable: false,
    },
    proprietary: {
      type: 'many-to-one',
      target: 'proprietary',
      joinColumn: { name: 'proprietary_id' },
      nullable: false,
    },
    driver: {
      type: 'many-to-one',
      target: 'driver',
      joinColumn: { name: 'driver_id' },
      nullable: false,
    },
    truck: {
      type: 'many-to-one',
      target: 'truck',
      joinColumn: { name: 'truck_id' },
      nullable: false,
    },
    status: {
      type: 'many-to-one',
      target: 'order_status',
      joinColumn: { name: 'status_id' },
      nullable: false,
      cascade: true,
    },
    paymentFormFreight: {
      type: 'many-to-one',
      target: 'payment_form',
      joinColumn: { name: 'payment_form_freight_id' },
      nullable: false,
    },
    paymentFormDriver: {
      type: 'many-to-one',
      target: 'payment_form',
      joinColumn: { name: 'payment_form_driver_id' },
      nullable: false,
    },
    author: {
      type: 'many-to-one',
      target: 'employee',
      joinColumn: { name: 'author_id' },
      nullable: false,
    },
    items: {
      type: 'many-to-many',
      target: 'freight_item',
      joinTable: {
        name: 'freight_order_item',
        joinColumn: { name: 'freight_order_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'freight_item_id', referencedColumnName: 'id' },
      },
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    steps: {
      type: 'one-to-many',
      target: 'load_step',
      inverseSide: 'order',
    },
  },
});
