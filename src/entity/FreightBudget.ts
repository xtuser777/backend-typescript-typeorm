import { EntitySchema } from 'typeorm';
import { ICity } from './City';
import { IClient } from './Client';
import { IEmployee } from './Employee';
import { IRepresentation } from './Representation';
import { ISaleBudget } from './SaleBudget';
import { ITruckType } from './TruckType';
import { IFreightBudgetItem } from './FreightBudgetItem';

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
  representation: IRepresentation;
  client: IClient;
  truckType: ITruckType;
  destiny: ICity;
  author: IEmployee;
  items: IFreightBudgetItem[];
}

export const FreightBudget = new EntitySchema<IFreightBudget>({
  name: 'freight_budget',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    date: { type: 'date' },
    description: { type: 'varchar', length: 70 },
    distance: { type: 'integer' },
    weight: { type: 'float' },
    value: { type: 'decimal' },
    shipping: { type: 'date' },
    validate: { type: 'date' },
  },
  relations: {
    saleBudget: { type: 'many-to-one', target: 'sale_budget', nullable: true },
    representation: { type: 'many-to-one', target: 'representation' },
    client: { type: 'many-to-one', target: 'client' },
    truckType: { type: 'many-to-one', target: 'truck_type' },
    destiny: { type: 'many-to-one', target: 'city' },
    author: { type: 'many-to-one', target: 'employee' },
    items: {
      type: 'one-to-many',
      target: 'freight_budget_item',
      inverseSide: 'budget',
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
