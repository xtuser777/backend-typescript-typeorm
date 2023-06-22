import { IStatus } from '../entity/Status';

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
}
