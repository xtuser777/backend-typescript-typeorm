import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './City';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 70 })
  public street!: string;

  @Column({ length: 10 })
  public number!: string;

  @Column({ length: 50 })
  public neighborhood!: string;

  @Column({ length: 40 })
  public complement!: string;

  @Column({ length: 10 })
  public code!: string;

  @ManyToOne(() => City)
  public city!: City;
}
