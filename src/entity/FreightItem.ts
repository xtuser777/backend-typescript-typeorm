import { EntitySchema } from 'typeorm';
import { IProduct } from './Product';

export interface IFreightItem {
  id: number;
  product: IProduct;
  quantity: number;
  weight: number;
}

export const FreightItem = new EntitySchema<IFreightItem>({
  name: 'freight_item',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    quantity: { type: 'integer' },
    weight: { type: 'float' },
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'product',
      primary: true,
    },
  },
});
