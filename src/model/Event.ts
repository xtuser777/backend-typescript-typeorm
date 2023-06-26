import { QueryRunner, TypeORMError } from 'typeorm';
import { IEmployee } from '../entity/Employee';
import { IEvent, Event as EventEntity } from '../entity/Event';
import { IFreightOrder } from '../entity/FreightOrder';
import { ISaleOrder } from '../entity/SaleOrder';
import { Employee } from './Employee';

export class Event implements IEvent {
  private attributes: IEvent;

  constructor(attributes?: IEvent) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          description: '',
          date: '',
          time: '',
          author: new Employee(),
        };
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
  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
  }
  get freightOrder(): IFreightOrder | undefined {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder | undefined) {
    this.attributes.freightOrder = v;
  }
  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }
  get toAttributes(): IEvent {
    const attributes: IEvent = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'método inválido.';
    if (this.attributes.description.length < 2) return 'descrição do evento inválida.';
    if (this.attributes.date.length < 10) return 'data do evento inválida.';
    if (this.attributes.time.length < 8) return 'hora do evento inválida.';
    if (this.attributes.author.id <= 0) return 'autor do evento inválido.';

    try {
      const entity = await runner.manager.save(EventEntity, this.attributes);
      return entity ? '' : 'erro ao inserir o evento';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(EventEntity, this.attributes);
      return entity ? '' : 'erro ao remover o evento.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(EventEntity, {
        where: { id },
        relations: {
          saleOrder: true,
          freightOrder: true,
          author: { person: { individual: true } },
        },
      });
      return entity ? new Event(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(EventEntity, {
        relations: {
          saleOrder: true,
          freightOrder: true,
          author: { person: { individual: true } },
        },
      });
      const events: Event[] = [];
      for (const entity of entities) events.push(new Event(entity));
      return events;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
