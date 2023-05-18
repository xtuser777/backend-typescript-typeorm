import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('integer')
  public type!: number;

  @Column('date')
  public admission!: string;

  @Column('date', { nullable: true })
  public demission?: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;
}
