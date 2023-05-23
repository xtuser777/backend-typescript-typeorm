import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TruckType {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 50 })
  public description!: string;

  @Column('integer')
  public axes!: number;

  @Column('float')
  public capacity!: number;
}
