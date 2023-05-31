import { Column, Entity, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class TruckType {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 50 })
//   public description!: string;

//   @Column('integer')
//   public axes!: number;

//   @Column('float')
//   public capacity!: number;
// }

export interface ITruckType {
  id: number;
  description: string;
  axes: number;
  capacity: number;
}

export const TruckType = new EntitySchema<ITruckType>({
  name: 'truck_type',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    description: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    axes: {
      type: 'integer',
      nullable: false,
    },
    capacity: {
      type: 'float',
      nullable: false,
    },
  },
});
