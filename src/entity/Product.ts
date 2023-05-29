import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Representation } from './Representation';
import { TruckType } from './TruckType';

export class Product {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public description!: string;

  @Column()
  public measure!: string;

  @Column()
  public weight!: number;

  @Column()
  public price!: number;

  @Column()
  public priceOut!: number;

  @ManyToOne(() => Representation)
  public representation!: Representation;

  @ManyToMany(() => TruckType)
  public types!: TruckType[];
}