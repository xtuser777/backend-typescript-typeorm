import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EnterprisePerson {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 100 })
  public corporateName!: string;

  @Column({ length: 70 })
  public fantasyName!: string;

  @Column({ length: 19 })
  public cnpj!: string;
}
