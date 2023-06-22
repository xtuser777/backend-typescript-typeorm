import { QueryRunner, TypeORMError } from 'typeorm';
import { IEmployee } from '../entity/Employee';
import { IOrderStatus, OrderStatus as OrderStatusEntity } from '../entity/OrderStatus';
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

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'método inválido.';
    if (this.attributes.date.length < 10) return 'data do status inválida.';
    if (this.attributes.time.length < 8) return 'hora do status inválida.';
    if (this.attributes.status.id <= 0) return 'status inválido.';
    if (this.attributes.author.id <= 0) return 'autor do status inválido.';

    try {
      const entity = await runner.manager.save(OrderStatusEntity, this.attributes);
      return entity ? '' : 'erro ao inserir o status do pedido.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido.';
    if (this.attributes.date.length < 10) return 'data do status inválida.';
    if (this.attributes.time.length < 8) return 'hora do status inválida.';
    if (this.attributes.status.id <= 0) return 'status inválido.';
    if (this.attributes.author.id <= 0) return 'autor do status inválido.';

    try {
      const entity = await runner.manager.save(OrderStatusEntity, this.attributes);
      return entity ? '' : 'erro ao atualizar o status do pedido.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(OrderStatusEntity, this.attributes);
      return entity ? '' : 'erro ao remover o status do pedido.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(OrderStatusEntity, {
        where: { id },
        relations: { status: true, author: { person: { individual: true } } },
      });
      return entity ? new OrderStatus(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
