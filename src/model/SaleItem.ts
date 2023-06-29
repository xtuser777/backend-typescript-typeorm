import { QueryRunner, TypeORMError } from 'typeorm';
import { IProduct } from '../entity/Product';
import { ISaleBudget } from '../entity/SaleBudget';
import { ISaleItem, SaleItem as SaleItemEntity } from '../entity/SaleItem';
import { ISaleOrder } from '../entity/SaleOrder';
import { Product } from './Product';
import { SaleBudget } from './SaleBudget';
import { SaleOrder } from './SaleOrder';

export class SaleItem implements ISaleItem {
  private attributes: ISaleItem;

  constructor(attributes?: ISaleItem) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          quantity: 0,
          weight: 0.0,
          price: 0.0,
          product: new Product(),
          budget: new SaleBudget(),
          order: new SaleOrder(),
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
    this.attributes.weight = v;
  }

  get price(): number {
    return this.attributes.price;
  }
  set price(v: number) {
    this.attributes.price = v;
  }

  get product(): IProduct {
    return this.attributes.product;
  }
  set product(v: IProduct) {
    this.attributes.product = v;
  }

  get budget(): ISaleBudget | undefined {
    return this.attributes.budget;
  }
  set budget(v: ISaleBudget | undefined) {
    this.attributes.budget = v;
  }

  get order(): ISaleOrder | undefined {
    return this.attributes.order;
  }
  set order(v: ISaleOrder | undefined) {
    this.attributes.order = v;
  }

  get toAttributes(): ISaleItem {
    const attributes: ISaleItem = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    try {
      const entity = await runner.manager.save(SaleItemEntity, this.attributes);
      return entity
        ? { success: true, insertId: entity.id, message: '' }
        : { success: false, insertId: 0, message: 'erro ao inserir o item.' };
    } catch (e) {
      console.error(e);
      return { success: false, insertId: 0, message: (e as TypeORMError).message };
    }
  }

  async update(runner: QueryRunner) {
    try {
      const entity = await runner.manager.save(SaleItemEntity, this.attributes);
      return entity
        ? { success: true, insertId: entity.id, message: '' }
        : { success: false, insertId: 0, message: 'erro ao atualizar o item.' };
    } catch (e) {
      console.error(e);
      return { success: false, insertId: 0, message: (e as TypeORMError).message };
    }
  }

  async delete(runner: QueryRunner) {
    try {
      const entity = await runner.manager.remove(SaleItemEntity, this.attributes);
      return entity
        ? { success: true, insertId: entity.id, message: '' }
        : { success: false, insertId: 0, message: 'erro ao remover o item.' };
    } catch (e) {
      console.error(e);
      return { success: false, insertId: 0, message: (e as TypeORMError).message };
    }
  }
}
