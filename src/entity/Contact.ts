import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address, IAddress } from './Address';

// @Entity()
// export class Contact {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 14 })
//   public phone!: string;

//   @Column({ length: 15 })
//   public cellphone!: string;

//   @Column({ length: 100 })
//   public email!: string;

//   @OneToOne(() => Address, { cascade: true })
//   @JoinColumn()
//   public address!: Address;
// }

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
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    phone: {
      type: 'varchar',
      length: 14,
      nullable: false,
    },
    cellphone: {
      type: 'varchar',
      length: 15,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
  },
  relations: {
    address: {
      type: 'one-to-one',
      target: 'address',
      joinColumn: true,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
