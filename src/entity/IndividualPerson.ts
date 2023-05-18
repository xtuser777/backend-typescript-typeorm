import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from './Contact';

@Entity()
export class IndividualPerson {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 100 })
  public name!: string;

  @Column({ length: 14 })
  public cpf!: string;

  @Column('date')
  public birth!: string;

  @OneToOne(() => Contact, { cascade: true })
  @JoinColumn()
  public contact!: Contact;
}
