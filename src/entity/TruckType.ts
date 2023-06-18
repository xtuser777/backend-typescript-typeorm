import { EntitySchema } from 'typeorm';

export interface ITruckType {
  id: number;
  description: string;
  axes: number;
  capacity: number;
}

export const TruckType = new EntitySchema<ITruckType>({
  name: 'truck_type',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    description: { type: 'varchar', length: 50, nullable: false },
    axes: { type: 'integer', nullable: false },
    capacity: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
});
