import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Person } from './Person';
import { Level } from './Level';

@Entity()
@Unique(['login'])
export class Employee {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('integer')
  public type!: number;

  @Column({ length: 10 })
  public login!: string;

  @Column({ length: 100 })
  public passwordHash!: string;

  @Column('date')
  public admission!: string;

  @Column('date', { nullable: true })
  public demission?: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;

  @ManyToOne(() => Level)
  public level!: Level;
}
