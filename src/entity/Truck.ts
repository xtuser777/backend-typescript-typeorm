import { Column, Entity, EntitySchema, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ITruckType } from './TruckType';
import { IProprietary, Proprietary } from './Proprietary';

// @Entity()
// export class Truck {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 8 })
//   public plate!: string;

//   @Column({ length: 20 })
//   public brand!: string;

//   @Column({ length: 40 })
//   public model!: string;

//   @Column({ length: 20 })
//   public color!: string;

//   @Column('integer')
//   public manufactureYear!: number;

//   @Column('integer')
//   public modelYear!: number;

//   @ManyToOne(() => TruckType)
//   public type!: TruckType;

//   @ManyToOne(() => Proprietary)
//   public proprietary!: Proprietary;
// }

export interface ITruck {
  id: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
  manufactureYear: number;
  modelYear: number;
  type: ITruckType;
  proprietary: IProprietary;
}

export const Truck = new EntitySchema<ITruck>({
  name: 'truck',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    plate: { type: 'varchar', length: 8, nullable: false },
    brand: { type: 'varchar', length: 20, nullable: false },
    model: { type: 'varchar', length: 40, nullable: false },
    color: { type: 'varchar', length: 20, nullable: false },
    manufactureYear: { type: 'integer', nullable: false },
    modelYear: { type: 'integer', nullable: false },
  },
  relations: {
    type: { type: 'many-to-one', target: 'truck_type' },
    proprietary: { type: 'many-to-one', target: 'proprietary' },
  },
});
