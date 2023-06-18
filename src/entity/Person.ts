import { EntitySchema } from 'typeorm';
import { IIndividualPerson } from './IndividualPerson';
import { IEnterprisePerson } from './EnterprisePerson';
import { IContact } from './Contact';

export interface IPerson {
  id: number;
  type: number;
  individual?: IIndividualPerson;
  enterprise?: IEnterprisePerson;
  contact: IContact;
}

export const Person = new EntitySchema<IPerson>({
  name: 'person',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    type: { type: 'integer', nullable: false },
  },
  relations: {
    individual: {
      type: 'one-to-one',
      target: 'individual_person',
      joinColumn: { name: 'individual_person_id' },
      nullable: true,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    enterprise: {
      type: 'one-to-one',
      target: 'enterprise_person',
      joinColumn: { name: 'enterprise_person_id' },
      nullable: true,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    contact: {
      type: 'one-to-one',
      target: 'contact',
      joinColumn: { name: 'contact_id' },
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
});
