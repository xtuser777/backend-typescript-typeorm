import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from './Contact';

@Entity()
export class EnterprisePerson {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 100 })
  public corporateName!: string;

  @Column({ length: 70 })
  public fantasyName!: string;

  @Column({ length: 19 })
  public cnpj!: string;

  @OneToOne(() => Contact, { cascade: true })
  @JoinColumn()
  public contact!: Contact;
}
