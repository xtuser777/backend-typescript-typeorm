import { EntitySchema } from 'typeorm';

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
