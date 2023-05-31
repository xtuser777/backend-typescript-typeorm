import { Column, Entity, EntitySchema, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ICity } from './City';

// export class State {
//   @PrimaryGeneratedColumn()
//   public id!: number;
//   @Column({ length: 50 })
//   public name!: string;
//   @Column({ length: 2 })
//   public acronym!: string;
//   @OneToMany(() => City, (city) => city.state)
//   public cities!: City[];
// }

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
    },
  },
});
