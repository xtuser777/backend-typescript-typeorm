import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Level {
  @PrimaryColumn()
  public id!: number;

  @Column({ length: 20 })
  public description!: string;
}
