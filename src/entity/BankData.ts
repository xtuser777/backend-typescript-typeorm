import { Entity, PrimaryGeneratedColumn, Column, EntitySchema } from 'typeorm';

// @Entity()
// export class BankData {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 3 })
//   public bank!: string;

//   @Column({ length: 6 })
//   public agency!: string;

//   @Column({ length: 12 })
//   public account!: string;

//   @Column('integer')
//   public type!: number;
// }

export interface IBankData {
  id: number;
  bank: string;
  agency: string;
  account: string;
  type: number;
}

export const BankData = new EntitySchema<IBankData>({
  name: 'bank_data',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    bank: {
      type: 'varchar',
      length: 3,
      nullable: false,
    },
    agency: {
      type: 'varchar',
      length: 6,
      nullable: false,
    },
    account: {
      type: 'varchar',
      length: 12,
      nullable: false,
    },
    type: {
      type: 'integer',
      nullable: false,
    },
  },
});
