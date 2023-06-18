import { EntitySchema } from 'typeorm';

export interface IIndividualPerson {
  id: number;
  name: string;
  cpf: string;
  birth: string;
}

export const IndividualPerson = new EntitySchema<IIndividualPerson>({
  name: 'individual_person',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    name: { type: 'varchar', length: 100, nullable: false },
    cpf: { type: 'varchar', length: 14, nullable: false },
    birth: { type: 'date', nullable: false },
  },
});
