import { Column, Entity, EntitySchema, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IState } from './State';

// @Entity()
// export class City {
//   @PrimaryGeneratedColumn()
//   public id!: number;
//   @Column({ length: 50 })
//   public name!: string;
//   @ManyToOne(() => State, (state) => state.cities)
//   public state!: State;
// }

export interface ICity {
  id: number;
  name: string;
  state: IState;
}

export const City = new EntitySchema<ICity>({
  name: 'city',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    name: {
      type: 'varchar',
      length: 50,
    },
  },
  relations: {
    state: {
      type: 'many-to-one',
      target: 'state',
    },
  },
});
