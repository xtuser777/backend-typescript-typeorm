import { QueryRunner, TypeORMError } from 'typeorm';
import { IFreightBudget } from '../entity/FreightBudget';
import { IFreightItem, FreightItem as FreightItemEntity } from '../entity/FreightItem';
import { IFreightOrder } from '../entity/FreightOrder';
import { IProduct } from '../entity/Product';
import { FreightBudget } from './FreightBudget';
import { FreightOrder } from './FreightOrder';
import { Product } from './Product';

export class FreightItem implements IFreightItem {
  private attributes: IFreightItem;

  constructor(attributes?: IFreightItem) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          quantity: 0,
          weight: 0.0,
          product: new Product(),
          budget: new FreightBudget(),
          order: new FreightOrder(),
        };
  }
  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get quantity(): number {
    return this.attributes.quantity;
  }
  set quantity(v: number) {
    this.attributes.quantity = v;
  }

  get weight(): number {
    return this.attributes.weight;
  }
  set weight(v: number) {
    this.attributes.weight;
  }

  get product(): IProduct {
    return this.attributes.product;
  }
  set product(v: IProduct) {
    this.attributes.product = v;
  }

  get budget(): IFreightBudget | undefined {
    return this.attributes.budget;
  }
  set budget(v: IFreightBudget | undefined) {
    this.attributes.budget = v;
  }

  get order(): IFreightOrder | undefined {
    return this.attributes.order;
  }
  set order(v: IFreightOrder | undefined) {
    this.attributes.order = v;
  }

  get toAttributes(): IFreightItem {
    const attributes: IFreightItem = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    try {
      const entity = await runner.manager.save(FreightItemEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : { success: false, insertedId: 0, message: 'erro ao inserir o item' };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async delete(runner: QueryRunner) {
    try {
      const entity = await runner.manager.remove(FreightItemEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : { success: false, insertedId: 0, message: 'erro ao remover o item' };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }
}
