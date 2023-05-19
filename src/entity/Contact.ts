import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './Address';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 14 })
  public phone!: string;

  @Column({ length: 15 })
  public cellphone!: string;

  @Column({ length: 100 })
  public email!: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  public address!: Address;
}
