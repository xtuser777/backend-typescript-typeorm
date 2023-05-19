import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 20 })
  public description!: string;
}
