import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IndividualPerson } from './IndividualPerson';
import { EnterprisePerson } from './EnterprisePerson';

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
}
