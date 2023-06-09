import { FindOptionsWhere, QueryRunner, TypeORMError } from 'typeorm';
import { ICity } from '../entity/City';
import { IClient } from '../entity/Client';
import { IEmployee } from '../entity/Employee';
import {
  IFreightBudget,
  FreightBudget as FreightBudgetEntity,
} from '../entity/FreightBudget';
import { IFreightItem } from '../entity/FreightItem';
import { IRepresentation } from '../entity/Representation';
import { ISaleBudget } from '../entity/SaleBudget';
import { ITruckType } from '../entity/TruckType';

export class FreightBudget implements IFreightBudget {
  private attributes!: IFreightBudget;

  constructor(attributes?: IFreightBudget) {
    if (attributes) this.attributes = attributes;
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

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get distance(): number {
    return this.attributes.distance;
  }
  set distance(v: number) {
    this.attributes.distance = v;
  }

  get weight(): number {
    return this.attributes.weight;
  }
  set weight(v: number) {
    this.attributes.weight = v;
  }

  get value(): number {
    return this.attributes.value;
  }
  set value(v: number) {
    this.attributes.value = v;
  }

  get shipping(): string {
    return this.attributes.shipping;
  }
  set shipping(v: string) {
    this.attributes.shipping = v;
  }

  get validate(): string {
    return this.attributes.validate;
  }
  set validate(v: string) {
    this.attributes.validate = v;
  }

  get saleBudget(): ISaleBudget | undefined {
    return this.attributes.saleBudget;
  }
  set saleBudget(v: ISaleBudget | undefined) {
    this.attributes.saleBudget = v;
  }

  get representation(): IRepresentation | undefined {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation | undefined) {
    this.attributes.representation = v;
  }

  get client(): IClient {
    return this.attributes.client;
  }
  set client(v: IClient) {
    this.attributes.client = v;
  }

  get truckType(): ITruckType {
    return this.attributes.truckType;
  }
  set truckType(v: ITruckType) {
    this.attributes.truckType = v;
  }

  get destiny(): ICity {
    return this.attributes.destiny;
  }
  set destiny(v: ICity) {
    this.attributes.destiny = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get items(): IFreightItem[] {
    return this.attributes.items;
  }
  set items(v: IFreightItem[]) {
    this.attributes.items = v;
  }

  get toAttributes(): IFreightBudget {
    const attributes: IFreightBudget = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0)
      return { success: false, insertedId: 0, message: 'método inválido' };
    if (this.attributes.date.length < 10)
      return { success: false, insertedId: 0, message: 'data de cadastro inválida.' };
    if (this.attributes.description.length < 2)
      return { success: false, insertedId: 0, message: 'descrição inválida.' };
    if (this.attributes.distance <= 0)
      return { success: false, insertedId: 0, message: 'distância da entrega inválida.' };
    if (this.attributes.weight <= 0)
      return { success: false, insertedId: 0, message: 'peso dos itens inválido.' };
    if (this.attributes.value <= 0)
      return { success: false, insertedId: 0, message: 'valor do orçamento inválido.' };
    if (this.attributes.shipping.length < 10)
      return { success: false, insertedId: 0, message: 'data de entrega inválida.' };
    if (this.attributes.validate.length < 10)
      return { success: false, insertedId: 0, message: 'data de validade inválida.' };
    if (this.attributes.client.id <= 0)
      return { success: false, insertedId: 0, message: 'cliente inválido.' };
    if (this.attributes.truckType.id <= 0)
      return { success: false, insertedId: 0, message: 'tipo de caminhão inválido.' };
    if (this.attributes.destiny.id <= 0)
      return { success: false, insertedId: 0, message: 'cidade de destino inválida.' };
    if (this.attributes.author.id <= 0)
      return { success: false, insertedId: 0, message: 'autor do orçamento inválido.' };

    try {
      const entity = await runner.manager.save(FreightBudgetEntity, this.attributes);

      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : {
            success: false,
            insertedId: 0,
            message: 'erro ao inserir o orçamento de frete.',
          };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido';
    if (this.attributes.description.length < 2) return 'descrição inválida.';
    if (this.attributes.distance <= 0) return 'distância da entrega inválida.';
    if (this.attributes.weight <= 0) return 'peso dos itens inválido.';
    if (this.attributes.value <= 0) return 'valor do orçamento inválido.';
    if (this.attributes.shipping.length < 10) return 'data de entrega inválida.';
    if (this.attributes.validate.length < 10) return 'data de validade inválida.';
    if (this.attributes.client.id <= 0) return 'cliente inválido.';
    if (this.attributes.truckType.id <= 0) return 'tipo de caminhão inválido.';
    if (this.attributes.destiny.id <= 0) return 'cidade de destino inválida.';

    try {
      const entity = await runner.manager.save(FreightBudgetEntity, this.attributes);

      return entity ? '' : 'erro ao atualizar o orçamento de frete.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido';

    try {
      const entity = await runner.manager.remove(FreightBudgetEntity, this.attributes);

      return entity ? '' : 'erro ao remover o orçamento de frete.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, params: FindOptionsWhere<IFreightBudget>) {
    try {
      const entity = await runner.manager.findOne(FreightBudgetEntity, {
        where: params,
        relations: {
          saleBudget: true,
          representation: true,
          client: {
            person: {
              contact: { address: { city: { state: true } } },
              individual: true,
              enterprise: true,
            },
          },
          destiny: { state: true },
          truckType: true,
          author: {
            person: {
              contact: { address: { city: { state: true } } },
              individual: true,
              enterprise: true,
            },
            level: true,
          },
          items: {
            product: {
              representation: {
                person: {
                  enterprise: true,
                  contact: { address: { city: { state: true } } },
                },
              },
              types: true,
            },
          },
        },
      });

      return entity ? new FreightBudget(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner, params?: FindOptionsWhere<IFreightBudget>) {
    try {
      const entities = await runner.manager.find(FreightBudgetEntity, {
        where: params,
        relations: {
          saleBudget: true,
          representation: true,
          client: {
            person: {
              contact: { address: { city: { state: true } } },
              individual: true,
              enterprise: true,
            },
          },
          destiny: { state: true },
          truckType: true,
          author: {
            person: {
              contact: { address: { city: { state: true } } },
              individual: true,
              enterprise: true,
            },
            level: true,
          },
        },
      });
      const budgets: FreightBudget[] = [];
      for (const entity of entities) budgets.push(new FreightBudget(entity));

      return budgets;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
