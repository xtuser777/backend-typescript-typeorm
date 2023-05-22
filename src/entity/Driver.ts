import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn 
} from 'typeorm';
import { BankData } from '../entity/BankData';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 10 })
  public register!: string;

  @Column({ length: 11 })
  public cnh!: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;

  @OneToOne(() => BankData, { cascade: true })
  @JoinColumn()
  public bankData!: BankData;
}
