import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Parameterization {
  @PrimaryColumn()
  public id!: number;

  @Column()
  public logotype!: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;
}
