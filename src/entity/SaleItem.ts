import { EntitySchema } from 'typeorm';
import { IProduct } from './Product';
import { ISaleBudget } from './SaleBudget';
import { ISaleOrder } from './SaleOrder';

export interface ISaleItem {
  id: number;
  quantity: number;
  weight: number;
  price: number;
  product: IProduct;
  budget?: ISaleBudget;
  order?: ISaleOrder;
}

export const SaleItem = new EntitySchema<ISaleItem>({
  name: 'sale_item',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    quantity: { type: 'integer', nullable: false },
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    price: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'product',
      joinColumn: {
        name: 'product_id',
      },
      nullable: false,
    },
    budget: {
      type: 'many-to-one',
      target: 'sale_budget',
      joinColumn: { name: 'budget_id' },
      inverseSide: 'items',
      onDelete: 'CASCADE',
      nullable: true,
    },
    order: {
      type: 'many-to-one',
      target: 'sale_order',
      joinColumn: { name: 'order_id' },
      inverseSide: 'items',
      onDelete: 'CASCADE',
      nullable: true,
    },
  },
});
