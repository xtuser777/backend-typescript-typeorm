import { EntitySchema } from 'typeorm';
import { IProduct } from './Product';
import { ISaleBudget } from './SaleBudget';

export interface ISaleBudgetItem {
  id: number;
  budget: ISaleBudget;
  product: IProduct;
  quantity: number;
  weight: number;
  price: number;
}

export const SaleBudgetItem = new EntitySchema<ISaleBudgetItem>({
  name: 'sale_budget_item',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    quantity: {
      type: 'integer',
      nullable: false,
    },
    weight: {
      type: 'float',
      nullable: false,
    },
    price: {
      type: 'float',
      nullable: false,
    },
  },
  relations: {
    budget: {
      type: 'many-to-one',
      target: 'sale_budget',
      joinColumn: {
        name: 'budgetId',
      },
      inverseSide: 'items',
      primary: true,
    },
    product: {
      type: 'many-to-one',
      target: 'product',
      joinColumn: {
        name: 'productId',
      },
      primary: true,
    },
  },
});
