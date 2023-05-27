import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Representation {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 10 })
  public register!: string;

  @Column({ length: 40 })
  public unity!: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;
}
