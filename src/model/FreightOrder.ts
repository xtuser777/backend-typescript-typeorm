import { FindOptionsWhere, QueryRunner, TypeORMError } from 'typeorm';
import { ICity } from '../entity/City';
import { IClient } from '../entity/Client';
import { IDriver } from '../entity/Driver';
import { IEmployee } from '../entity/Employee';
import { IFreightBudget } from '../entity/FreightBudget';
import { IFreightItem } from '../entity/FreightItem';
import {
  IFreightOrder,
  FreightOrder as FreightOrderEntity,
} from '../entity/FreightOrder';
import { ILoadStep } from '../entity/LoadStep';
import { IOrderStatus } from '../entity/OrderStatus';
import { IPaymentForm } from '../entity/PaymentForm';
import { IProprietary } from '../entity/Proprietary';
import { IRepresentation } from '../entity/Representation';
import { ISaleOrder } from '../entity/SaleOrder';
import { ITruck } from '../entity/Truck';
import { ITruckType } from '../entity/TruckType';
import { City } from './City';
import { Client } from './Client';
import { Driver } from './Driver';
import { Employee } from './Employee';
import { OrderStatus } from './OrderStatus';
import { PaymentForm } from './PaymentForm';
import { Proprietary } from './Proprietary';
import { Truck } from './Truck';
import { TruckType } from './TruckType';

export class FreightOrder implements IFreightOrder {
  private attributes: IFreightOrder;

  constructor(attributes?: IFreightOrder) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          description: '',
          weight: 0.0,
          value: 0.0,
          shipping: '',
          distance: 0,
          driverValue: 0.0,
          driverEntry: 0.0,
          budget: undefined,
          saleOrder: undefined,
          representation: undefined,
          client: new Client(),
          destiny: new City(),
          driver: new Driver(),
          proprietary: new Proprietary(),
          truckType: new TruckType(),
          truck: new Truck(),
          status: new OrderStatus(),
          paymentFormFreight: new PaymentForm(),
          paymentFormDriver: undefined,
          author: new Employee(),
          items: [],
          steps: [],
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

  get distance(): number {
    return this.attributes.distance;
  }
  set distance(v: number) {
    this.attributes.distance = v;
  }

  get shipping(): string {
    return this.attributes.shipping;
  }
  set shipping(v: string) {
    this.attributes.shipping = v;
  }

  get driverValue(): number {
    return this.attributes.driverValue;
  }
  set driverValue(v: number) {
    this.attributes.driverValue = v;
  }

  get driverEntry(): number {
    return this.attributes.driverEntry;
  }
  set driverEntry(v: number) {
    this.attributes.driverEntry = v;
  }

  get budget(): IFreightBudget | undefined {
    return this.attributes.budget;
  }
  set budget(v: IFreightBudget | undefined) {
    this.attributes.budget = v;
  }

  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
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

  get destiny(): ICity {
    return this.attributes.destiny;
  }
  set destiny(v: ICity) {
    this.attributes.destiny = v;
  }

  get driver(): IDriver {
    return this.attributes.driver;
  }
  set driver(v: IDriver) {
    this.attributes.driver = v;
  }

  get proprietary(): IProprietary {
    return this.attributes.proprietary;
  }
  set proprietary(v: IProprietary) {
    this.attributes.proprietary = v;
  }

  get truckType(): ITruckType {
    return this.attributes.truckType;
  }
  set truckType(v: ITruckType) {
    this.attributes.truckType = v;
  }

  get truck(): ITruck {
    return this.attributes.truck;
  }
  set truck(v: ITruck) {
    this.attributes.truck = v;
  }

  get status(): IOrderStatus {
    return this.attributes.status;
  }
  set status(v: IOrderStatus) {
    this.attributes.status = v;
  }

  get paymentFormFreight(): IPaymentForm {
    return this.attributes.paymentFormFreight;
  }
  set paymentFormFreight(v: IPaymentForm) {
    this.attributes.paymentFormFreight = v;
  }

  get paymentFormDriver(): IPaymentForm | undefined {
    return this.attributes.paymentFormDriver;
  }
  set paymentFormDriver(v: IPaymentForm | undefined) {
    this.attributes.paymentFormDriver = v;
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

  get steps(): ILoadStep[] {
    return this.attributes.steps;
  }
  set steps(v: ILoadStep[]) {
    this.attributes.steps = v;
  }

  get toAttributes(): IFreightOrder {
    const attributes: IFreightOrder = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0)
      return { success: false, insertedId: 0, message: 'método inválido' };
    if (this.attributes.date.length < 10)
      return { success: false, insertedId: 0, message: 'data inválida.' };
    if (this.attributes.description.length < 2)
      return { success: false, insertedId: 0, message: 'descrição inválida.' };
    if (this.attributes.distance < 1)
      return { success: false, insertedId: 0, message: 'distância do frete inválida.' };
    if (this.attributes.weight <= 0)
      return { success: false, insertedId: 0, message: 'peso da carga inválido.' };
    if (this.attributes.value <= 0)
      return { success: false, insertedId: 0, message: 'valor do frete inválido.' };
    if (this.attributes.driverValue <= 0)
      return {
        success: false,
        insertedId: 0,
        message: 'valor a ser pago ao motorista inválido.',
      };
    if (this.attributes.shipping.length < 10)
      return { success: false, insertedId: 0, message: 'data de entrega inválida.' };
    if (this.attributes.client.id <= 0)
      return { success: false, insertedId: 0, message: 'cliente inválido.' };
    if (this.attributes.destiny.id <= 0)
      return { success: false, insertedId: 0, message: 'cidade de destino inválida.' };
    if (this.attributes.driver.id <= 0)
      return { success: false, insertedId: 0, message: 'motorista inválido.' };
    if (this.attributes.proprietary.id <= 0)
      return {
        success: false,
        insertedId: 0,
        message: 'proprietário do caminhão inválido.',
      };
    if (this.attributes.truckType.id <= 0)
      return { success: false, insertedId: 0, message: 'tipo de caminhão inválido.' };
    if (this.attributes.truck.id <= 0)
      return { success: false, insertedId: 0, message: 'caminhão inválido.' };
    if (this.attributes.paymentFormFreight.id <= 0)
      return { success: false, insertedId: 0, message: 'forma de pagamento inválida.' };
    if (this.attributes.items.length < 0)
      return { success: false, insertedId: 0, message: 'não ha itens.' };
    if (this.attributes.steps.length < 0)
      return { success: false, insertedId: 0, message: 'não ha etapas de carregamento.' };

    try {
      const entity = await runner.manager.save(FreightOrderEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : { success: false, insertedId: 0, message: 'erro ao inserir o pedido.' };
    } catch (e) {
      console.log(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido';
    if (this.attributes.description.length < 2) return 'descrição inválida.';
    if (this.attributes.distance < 1) return 'distância do frete inválida.';
    if (this.attributes.weight <= 0) return 'peso da carga inválido.';
    if (this.attributes.value <= 0) return 'valor do frete inválido.';
    if (this.attributes.driverValue <= 0)
      return 'valor a ser pago ao motorista inválido.';
    if (this.attributes.shipping.length < 10) return 'data de entrega inválida.';
    if (this.attributes.client.id <= 0) return 'cliente inválido.';
    if (this.attributes.destiny.id <= 0) return 'cidade de destino inválida.';
    if (this.attributes.driver.id <= 0) return 'motorista inválido.';
    if (this.attributes.proprietary.id <= 0) return 'proprietário do caminhão inválido.';
    if (this.attributes.truckType.id <= 0) return 'tipo de caminhão inválido.';
    if (this.attributes.truck.id <= 0) return 'caminhão inválido.';
    if (this.attributes.paymentFormFreight.id <= 0) return 'forma de pagamento inválida.';
    if (this.attributes.items.length < 0) return 'não ha itens.';
    if (this.attributes.steps.length < 0) return 'não ha etapas de carregamento.';

    try {
      const entity = await runner.manager.save(FreightOrderEntity, this.attributes);
      return entity ? '' : 'erro ao atualizar o pedido.';
    } catch (e) {
      console.log(e);
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(FreightOrderEntity, this.attributes);
      return entity ? '' : 'erro ao remover o pedido.';
    } catch (e) {
      console.log(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, params: FindOptionsWhere<IFreightOrder>) {
    try {
      const entity = await runner.manager.findOne(FreightOrderEntity, {
        where: params,
        relations: {
          budget: true,
          saleOrder: true,
          representation: true,
          client: { person: { individual: true, enterprise: true } },
          destiny: { state: true },
          driver: true,
          proprietary: true,
          truckType: true,
          truck: true,
          status: { status: true },
          paymentFormFreight: true,
          paymentFormDriver: true,
          author: { person: { individual: true, enterprise: true } },
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
          steps: {
            representation: {
              person: {
                enterprise: true,
                contact: { address: { city: { state: true } } },
              },
            },
          },
        },
      });
      return entity ? new FreightOrder(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find(runner: QueryRunner, params?: FindOptionsWhere<IFreightOrder>) {
    try {
      const entities = await runner.manager.find(FreightOrderEntity, {
        where: params,
        relations: {
          budget: true,
          saleOrder: true,
          representation: true,
          client: { person: { individual: true, enterprise: true } },
          destiny: true,
          driver: true,
          proprietary: true,
          truckType: true,
          truck: true,
          status: { status: true },
          paymentFormFreight: true,
          paymentFormDriver: true,
          author: { person: { individual: true, enterprise: true } },
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
          steps: {
            representation: {
              person: {
                enterprise: true,
                contact: { address: { city: { state: true } } },
              },
            },
          },
        },
      });
      const orders: FreightOrder[] = [];
      for (const entity of entities) orders.push(new FreightOrder(entity));
      return orders;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
