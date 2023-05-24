import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IndividualPerson {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 100 })
  public name!: string;

  @Column({ length: 14 })
  public cpf!: string;

  @Column('date')
  public birth!: string;
}
