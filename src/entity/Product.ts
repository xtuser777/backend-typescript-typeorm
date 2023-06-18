import { EntitySchema } from 'typeorm';
import { IRepresentation } from './Representation';
import { ITruckType } from './TruckType';

export interface IProduct {
  id: number;
  description: string;
  measure: string;
  weight: number;
  price: number;
  priceOut: number;
  representation: IRepresentation;
  types: ITruckType[];
}

export const Product = new EntitySchema<IProduct>({
  name: 'product',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 40, nullable: false },
    measure: { type: 'varchar', length: 20, nullable: false },
    weight: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    price: { type: 'decimal', precision: 10, scale: 2, nullable: false },
    priceOut: {
      name: 'price_out',
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
  },
  relations: {
    representation: {
      type: 'many-to-one',
      target: 'representation',
      joinColumn: { name: 'representation_id' },
    },
    types: {
      type: 'many-to-many',
      target: 'truck_type',
      joinTable: {
        name: 'product_truck_type',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'truck_type_id', referencedColumnName: 'id' },
      },
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
