import { EntitySchema } from 'typeorm';

export interface IPaymentForm {
  id: number;
  description: string;
  link: number;
  deadline: number;
}

export const PaymentForm = new EntitySchema<IPaymentForm>({
  name: 'payment_form',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 50, nullable: false },
    link: { type: 'integer', nullable: false },
    deadline: { type: 'integer', nullable: false },
  },
});
