import { IEmployee } from '../entity/Employee';
import { IOrderStatus } from '../entity/OrderStatus';
import { IStatus } from '../entity/Status';
import { Employee } from './Employee';
import { Status } from './Status';

export class OrderStatus implements IOrderStatus {
  private attributes: IOrderStatus;

  constructor(attributes?: IOrderStatus) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          time: '',
          observation: '',
          status: new Status(),
          author: new Employee(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get date(): string {
    return this.attributes.date;
  }
  set date(v: string) {
    this.attributes.date = v;
  }

  get time(): string {
    return this.attributes.time;
  }
  set time(v: string) {
    this.attributes.time = v;
  }

  get observation(): string {
    return this.attributes.observation;
  }
  set observation(v: string) {
    this.attributes.observation = v;
  }

  get status(): IStatus {
    return this.attributes.status;
  }
  set status(v: IStatus) {
    this.attributes.status = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get toAttributes(): IOrderStatus {
    const attributes: IOrderStatus = { ...this.attributes };
    return attributes;
  }
}
