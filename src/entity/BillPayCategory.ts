import { EntitySchema } from 'typeorm';

export interface IBillPayCategory {
  id: number;
  description: string;
}

export const BillPayCategory = new EntitySchema<IBillPayCategory>({
  name: 'bill_pay_category',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 40, nullable: false },
  },
});
