import { Column, Entity, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class EnterprisePerson {
//   @PrimaryGeneratedColumn()
//   public id!: number;

//   @Column({ length: 100 })
//   public corporateName!: string;

//   @Column({ length: 70 })
//   public fantasyName!: string;

//   @Column({ length: 19 })
//   public cnpj!: string;
// }

export interface IEnterprisePerson {
  id: number;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
}

export const EnterprisePerson = new EntitySchema<IEnterprisePerson>({
  name: 'enterprise_person',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment',
    },
    corporateName: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    fantasyName: {
      type: 'varchar',
      length: 70,
      nullable: false,
    },
    cnpj: {
      type: 'varchar',
      length: 18,
      nullable: false,
    },
  },
});
