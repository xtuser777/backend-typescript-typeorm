import { QueryRunner } from 'typeorm';
import { ILevel, Level as LevelEntity } from '../entity/Level';

export class Level implements ILevel {
  private attributes!: ILevel;

  constructor(attributes?: ILevel) {
    if (attributes) this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get toAttributes(): ILevel {
    const attributes: ILevel = { ...this.attributes };
    return attributes;
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(LevelEntity, { where: { id } });

      return entity ? new Level(entity) : undefined;
    } catch (e) {
      console.error(e);
      runner.release();

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(LevelEntity);
      const levels: Level[] = [];
      for (const entity of entities) levels.push(new Level(entity));

      return levels;
    } catch (e) {
      console.error(e);
      runner.release();

      return [];
    }
  }
}
