import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 10 })
  public register!: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;
}
