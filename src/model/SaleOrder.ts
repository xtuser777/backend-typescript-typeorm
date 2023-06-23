import { FindOptionsWhere, QueryRunner, TypeORMError } from 'typeorm';
import { ICity } from '../entity/City';
import { IClient } from '../entity/Client';
import { IEmployee } from '../entity/Employee';
import { IPaymentForm } from '../entity/PaymentForm';
import { ISaleBudget } from '../entity/SaleBudget';
import { ISaleItem } from '../entity/SaleItem';
import { ISaleOrder, SaleOrder as SaleOrderEntity } from '../entity/SaleOrder';
import { ITruckType } from '../entity/TruckType';
import { City } from './City';
import { Client } from './Client';
import { Employee } from './Employee';
import { PaymentForm } from './PaymentForm';
import { TruckType } from './TruckType';

export class SaleOrder implements ISaleOrder {
  private attributes: ISaleOrder;

  constructor(attributes?: ISaleOrder) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          description: '',
          weight: 0.0,
          value: 0.0,
          salesman: undefined,
          budget: undefined,
          destiny: new City(),
          truckType: new TruckType(),
          client: new Client(),
          paymentForm: new PaymentForm(),
          author: new Employee(),
          items: [],
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

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
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

  get salesman(): IEmployee | undefined {
    return this.attributes.salesman;
  }
  set salesman(v: IEmployee | undefined) {
    this.attributes.salesman = v;
  }

  get budget(): ISaleBudget | undefined {
    return this.attributes.budget;
  }
  set budget(v: ISaleBudget | undefined) {
    this.attributes.budget = v;
  }

  get destiny(): ICity {
    return this.attributes.destiny;
  }
  set destiny(v: ICity) {
    this.attributes.destiny = v;
  }

  get truckType(): ITruckType {
    return this.attributes.truckType;
  }
  set truckType(v: ITruckType) {
    this.attributes.truckType = v;
  }

  get client(): IClient {
    return this.attributes.client;
  }
  set client(v: IClient) {
    this.attributes.client = v;
  }

  get paymentForm(): IPaymentForm {
    return this.attributes.paymentForm;
  }
  set paymentForm(v: IPaymentForm) {
    this.attributes.paymentForm = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get items(): ISaleItem[] {
    return this.attributes.items;
  }
  set items(v: ISaleItem[]) {
    this.attributes.items = v;
  }

  get toAttributes(): ISaleOrder {
    const attributes: ISaleOrder = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0)
      return { success: false, insertedId: 0, message: 'metodo inválido' };
    if (this.attributes.date.length < 10)
      return { success: false, insertedId: 0, message: 'data de cadastro inválida.' };
    if (this.attributes.description.length < 2)
      return { success: false, insertedId: 0, message: 'descrição do pedido inválida.' };
    if (this.attributes.weight <= 0)
      return { success: false, insertedId: 0, message: 'peso total do pedido inválido.' };
    if (this.attributes.value <= 0)
      return {
        success: false,
        insertedId: 0,
        message: 'valor total do pedido inválido.',
      };
    if (this.attributes.client.id <= 0)
      return { success: false, insertedId: 0, message: 'cliente inválido.' };
    if (this.attributes.destiny.id <= 0)
      return { success: false, insertedId: 0, message: 'cidade de destino inválida.' };
    if (this.attributes.truckType.id <= 0)
      return { success: false, insertedId: 0, message: 'tipo de caminhao inválido.' };
    if (this.attributes.paymentForm.id <= 0)
      return { success: false, insertedId: 0, message: 'forma de pagamento inválida' };
    if (this.attributes.author.id <= 0)
      return { success: false, insertedId: 0, message: 'autor do cadastro inválido.' };
    if (this.attributes.items.length == 0)
      return { success: false, insertedId: 0, message: 'não há itens.' };

    try {
      const entity = await runner.manager.save(SaleOrderEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : { success: false, insertedId: 0, message: 'erro ao salvar o pedido de venda.' };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido';

    try {
      const entity = await runner.manager.remove(SaleOrderEntity, this.attributes);
      return entity ? '' : 'erro ao remover o pedido de venda.';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, params: FindOptionsWhere<ISaleOrder>) {
    try {
      const entity = await runner.manager.findOne(SaleOrderEntity, {
        where: params,
        relations: {
          budget: true,
          salesman: true,
          client: true,
          destiny: { state: true },
          truckType: true,
          paymentForm: true,
          author: true,
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
      return entity ? new SaleOrder(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find(runner: QueryRunner, params?: FindOptionsWhere<ISaleOrder>) {
    try {
      const entities = await runner.manager.find(SaleOrderEntity, {
        where: params,
        relations: {
          budget: true,
          salesman: true,
          client: true,
          destiny: { state: true },
          truckType: true,
          paymentForm: true,
          author: true,
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
      const orders: SaleOrder[] = [];
      for (const entity of entities) orders.push(new SaleOrder(entity));
      return orders;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
