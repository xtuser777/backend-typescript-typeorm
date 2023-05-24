import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IndividualPerson } from './IndividualPerson';
import { EnterprisePerson } from './EnterprisePerson';
import { Contact } from './Contact';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('integer')
  public type!: number;

  @OneToOne(() => IndividualPerson, { cascade: true, nullable: true })
  @JoinColumn()
  public individual?: IndividualPerson;

  @OneToOne(() => EnterprisePerson, { cascade: true, nullable: true })
  @JoinColumn()
  public enterprise?: EnterprisePerson;

  @OneToOne(() => Contact, { cascade: true })
  @JoinColumn()
  public contact!: Contact;
}
