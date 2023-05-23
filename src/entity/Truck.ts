import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TruckType } from './TruckType';
import { Proprietary } from './Proprietary';

@Entity()
export class Truck {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 8 })
  public plate!: string;

  @Column({ length: 20 })
  public brand!: string;

  @Column({ length: 40 })
  public model!: string;

  @Column({ length: 20 })
  public color!: string;

  @Column('integer')
  public manufactureYear!: number;

  @Column('integer')
  public modelYear!: number;

  @ManyToOne(() => TruckType)
  public type!: TruckType;

  @ManyToOne(() => Proprietary)
  public proprietary!: Proprietary;
}
