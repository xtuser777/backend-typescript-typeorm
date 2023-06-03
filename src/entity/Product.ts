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
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    description: {
      type: 'varchar',
      length: 40,
      nullable: false,
    },
    measure: {
      type: 'varchar',
      length: 20,
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
    priceOut: {
      name: 'price_out',
      type: 'float',
      nullable: false,
    },
  },
  relations: {
    representation: {
      type: 'many-to-one',
      target: 'representation',
    },
    types: {
      type: 'many-to-many',
      target: 'truck_type',
      joinTable: {
        name: 'product_truck_type',
        joinColumn: { name: 'product', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'truck_type', referencedColumnName: 'id' },
      },
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
