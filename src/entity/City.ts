import { EntitySchema } from 'typeorm';
import { IState } from './State';

export interface ICity {
  id: number;
  name: string;
  state: IState;
}

export const City = new EntitySchema<ICity>({
  name: 'city',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    name: { type: 'varchar', length: 50, nullable: false },
  },
  relations: {
    state: {
      type: 'many-to-one',
      target: 'state',
      joinColumn: {
        name: 'state_id',
      },
      inverseSide: 'cities',
    },
  },
});
