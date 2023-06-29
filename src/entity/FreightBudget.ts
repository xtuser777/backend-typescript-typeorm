import { EntitySchema } from 'typeorm';
import { ICity } from './City';
import { IClient } from './Client';
import { IEmployee } from './Employee';
import { IRepresentation } from './Representation';
import { ISaleBudget } from './SaleBudget';
import { ITruckType } from './TruckType';
import { IFreightItem } from './FreightItem';

export interface IFreightBudget {
  id: number;
  description: string;
  date: string;
  distance: number;
  weight: number;
  value: number;
  shipping: string;
  validate: string;
  saleBudget?: ISaleBudget;
  representation?: IRepresentation;
  client: IClient;
  truckType: ITruckType;
  destiny: ICity;
  author: IEmployee;
  items: IFreightItem[];
}

export const FreightBudget = new EntitySchema<IFreightBudget>({
  name: 'freight_budget',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date', nullable: false },
    description: { type: 'varchar', length: 70, nullable: false },
    distance: { type: 'integer', nullable: false },
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    value: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    shipping: { type: 'date', nullable: false },
    validate: { type: 'date', nullable: false },
  },
  relations: {
    saleBudget: {
      type: 'many-to-one',
      target: 'sale_budget',
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
    truckType: {
      type: 'many-to-one',
      target: 'truck_type',
      joinColumn: { name: 'truck_type_id' },
      nullable: false,
    },
    destiny: {
      type: 'many-to-one',
      target: 'city',
      joinColumn: { name: 'destiny_id' },
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
      target: 'freight_item',
      inverseSide: 'budget',
      onDelete: 'CASCADE',
    },
  },
});
