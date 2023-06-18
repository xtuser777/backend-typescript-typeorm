import { EntitySchema } from 'typeorm';
import { ICity } from './City';

export interface IState {
  id: number;
  name: string;
  acronym: string;
  cities: ICity[];
}

export const State = new EntitySchema<IState>({
  name: 'state',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    acronym: {
      type: 'varchar',
      length: 2,
      nullable: false,
    },
  },
  relations: {
    cities: {
      type: 'one-to-many',
      target: 'city',
      inverseSide: 'state',
    },
  },
});
