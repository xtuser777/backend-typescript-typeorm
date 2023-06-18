import { EntitySchema } from 'typeorm';
import { IProduct } from './Product';

export interface ISaleItem {
  id: number;
  product: IProduct;
  quantity: number;
  weight: number;
  price: number;
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
      primary: true,
    },
  },
});
