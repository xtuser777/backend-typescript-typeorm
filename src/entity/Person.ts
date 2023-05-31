import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IIndividualPerson } from './IndividualPerson';
import { IEnterprisePerson } from './EnterprisePerson';
import { IContact } from './Contact';

// @Entity()
// export class Person {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column('integer')
//   public type!: number;

//   @OneToOne(() => IndividualPerson, { cascade: true, nullable: true })
//   @JoinColumn()
//   public individual?: IndividualPerson;

//   @OneToOne(() => EnterprisePerson, { cascade: true, nullable: true })
//   @JoinColumn()
//   public enterprise?: EnterprisePerson;

//   @OneToOne(() => Contact, { cascade: true })
//   @JoinColumn()
//   public contact!: Contact;
// }

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
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    type: {
      type: 'integer',
      nullable: false,
    },
  },
  relations: {
    individual: {
      type: 'one-to-one',
      target: 'individual_person',
      joinColumn: true,
      nullable: true,
      cascade: true,
    },
    enterprise: {
      type: 'one-to-one',
      target: 'enterprise_person',
      joinColumn: true,
      nullable: true,
      cascade: true,
    },
    contact: {
      type: 'one-to-one',
      target: 'contact',
      joinColumn: true,
      cascade: true,
    },
  },
});
