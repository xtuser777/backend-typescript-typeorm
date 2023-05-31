import { Column, Entity, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class Level {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 20 })
//   public description!: string;
// }

export interface ILevel {
  id: number;
  description: string;
}

export const Level = new EntitySchema<ILevel>({
  name: 'level',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    description: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
  },
});
