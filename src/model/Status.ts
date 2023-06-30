import { QueryRunner } from 'typeorm';
import { IStatus, Status as StatusEntity } from '../entity/Status';

export class Status implements IStatus {
  private attributes: IStatus;

  constructor(attributes?: IStatus) {
    this.attributes = attributes ? attributes : { id: 0, description: '' };
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

  get toAttributes(): IStatus {
    const attributes: IStatus = { ...this.attributes };
    return attributes;
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return 0;
    try {
      const entity = await runner.manager.findOne(StatusEntity, { where: { id } });
      return entity ? new Status(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(StatusEntity);
      const statuses: Status[] = [];
      for (const entity of entities) statuses.push(new Status(entity));
      return statuses;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
