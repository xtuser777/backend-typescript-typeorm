import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { State } from './State';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column({ length: 50 })
  public name!: string;
  @ManyToOne(() => State, (state) => state.cities)
  public state!: State;
}
