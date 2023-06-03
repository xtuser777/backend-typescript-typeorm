import { EntitySchema } from 'typeorm';
import { IFreightBudget } from './FreightBudget';
import { IProduct } from './Product';

export interface IFreightBudgetItem {
  id: number;
  budget: IFreightBudget;
  product: IProduct;
  quantity: number;
  weight: number;
}

export const FreightBudgetItem = new EntitySchema<IFreightBudgetItem>({
  name: 'freight_budget_item',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    quantity: { type: 'integer' },
    weight: { type: 'float' },
  },
  relations: {
    budget: {
      type: 'many-to-one',
      target: 'freight_budget',
      inverseSide: 'items',
      primary: true,
    },
    product: {
      type: 'many-to-one',
      target: 'product',
      primary: true,
    },
  },
});
