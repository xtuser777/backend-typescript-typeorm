import { EntitySchema } from 'typeorm';
import { ICity } from './City';

export interface IAddress {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  code: string;
  city: ICity;
}

export const Address = new EntitySchema<IAddress>({
  name: 'address',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    street: { type: 'varchar', length: 70, nullable: false },
    number: { type: 'varchar', length: 10, nullable: false },
    neighborhood: { type: 'varchar', length: 50, nullable: false },
    complement: { type: 'varchar', length: 40 },
    code: { type: 'varchar', length: 10, nullable: false },
  },
  relations: {
    city: {
      type: 'many-to-one',
      target: 'city',
      joinColumn: { name: 'city_id' },
    },
  },
});
