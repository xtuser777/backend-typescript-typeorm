import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './City';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column({ length: 50 })
  public name!: string;
  @Column({ length: 2 })
  public acronym!: string;
  @OneToMany(() => City, (city) => city.state)
  public cities!: City[];
}
