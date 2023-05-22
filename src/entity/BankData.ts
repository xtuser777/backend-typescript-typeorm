import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column 
} from 'typeorm';

@Entity()
export class BankData {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 3 })
  public bank!: string;

  @Column({ length: 6 })
  public agency!: string;

  @Column({ length: 12 })
  public account!: string;

  @Column('integer')
  public type!: number;
}
