import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Driver } from './Driver';
import { Person } from './Person';

@Entity()
export class Proprietary {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 10 })
  public register!: string;

  @OneToOne(() => Driver, { nullable: true })
  @JoinColumn()
  public driver?: Driver;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  public person!: Person;
}
