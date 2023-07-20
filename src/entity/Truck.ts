import { EntitySchema } from 'typeorm';
import { ITruckType } from './TruckType';
import { IProprietary } from './Proprietary';

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
    manufactureYear: { name: 'manufacture_year', type: 'integer', nullable: false },
    modelYear: { name: 'model_year', type: 'integer', nullable: false },
  },
  relations: {
    type: {
      type: 'many-to-one',
      target: 'truck_type',
      joinColumn: { name: 'truck_type_id' },
    },
    proprietary: {
      type: 'many-to-one',
      target: 'proprietary',
      joinColumn: { name: 'proprietary_id' },
    },
  },
});
