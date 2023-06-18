import { EntitySchema } from 'typeorm';
import { IAddress } from './Address';

export interface IContact {
  id: number;
  phone: string;
  cellphone: string;
  email: string;
  address: IAddress;
}

export const Contact = new EntitySchema<IContact>({
  name: 'contact',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    phone: { type: 'varchar', length: 14, nullable: false },
    cellphone: { type: 'varchar', length: 15, nullable: false },
    email: { type: 'varchar', length: 100, nullable: false },
  },
  relations: {
    address: {
      type: 'one-to-one',
      target: 'address',
      joinColumn: { name: 'address_id' },
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
