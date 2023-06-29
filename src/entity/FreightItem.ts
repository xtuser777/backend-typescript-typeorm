import { EntitySchema } from 'typeorm';
import { IProduct } from './Product';
import { IFreightBudget } from './FreightBudget';
import { IFreightOrder } from './FreightOrder';

export interface IFreightItem {
  id: number;
  product: IProduct;
  quantity: number;
  weight: number;
  budget?: IFreightBudget;
  order?: IFreightOrder;
}

export const FreightItem = new EntitySchema<IFreightItem>({
  name: 'freight_item',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    quantity: { type: 'integer', nullable: false },
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'product',
      joinColumn: { name: 'product_id' },
      primary: true,
    },
    budget: {
      type: 'many-to-one',
      target: 'freight_budget',
      joinColumn: { name: 'budget_id' },
      inverseSide: 'items',
      onDelete: 'CASCADE',
      nullable: true,
    },
    order: {
      type: 'many-to-one',
      target: 'freight_order',
      joinColumn: { name: 'order_id' },
      inverseSide: 'items',
      onDelete: 'CASCADE',
      nullable: true,
    },
  },
});
