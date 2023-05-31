import { Column, Entity, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class IndividualPerson {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 100 })
//   public name!: string;

//   @Column({ length: 14 })
//   public cpf!: string;

//   @Column('date')
//   public birth!: string;
// }

export interface IIndividualPerson {
  id: number;
  name: string;
  cpf: string;
  birth: string;
}

export const IndividualPerson = new EntitySchema<IIndividualPerson>({
  name: 'individual_person',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    cpf: {
      type: 'varchar',
      length: 14,
      nullable: false,
    },
    birth: {
      type: 'date',
      nullable: false,
    },
  },
});
