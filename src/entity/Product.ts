import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Representation } from './Representation';
import { TruckType } from './TruckType';

export class Product {
  @ProductGeneratedColumn()
  public id!: number;

  @Column()
  public description!: string;

  @Column()
  public measure!: string;
}
