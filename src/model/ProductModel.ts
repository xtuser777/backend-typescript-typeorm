import { QueryRunner, TypeORMError } from 'typeorm';
import { Product } from '../entity/Product';
import { Representation } from '../entity/Representation';
import { TruckType } from '../entity/TruckType';

export class ProductModel {
  private attributes: Product;

  constructor(attributes?: Product) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          description: '',
          measure: '',
          weight: 0.0,
          price: 0.0,
          priceOut: 0.0,
          representation: new Representation(),
          types: [],
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

  get measure(): string {
    return this.attributes.measure;
  }
  set measure(v: string) {
    this.attributes.measure = v;
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

  get priceOut(): number {
    return this.attributes.priceOut;
  }
  set priceOut(v: number) {
    this.attributes.priceOut = v;
  }

  get representation(): Representation {
    return this.attributes.representation;
  }
  set representation(v: Representation) {
    this.attributes.representation = v;
  }

  get types(): TruckType[] {
    return this.attributes.types;
  }
  set types(v: TruckType[]) {
    this.attributes.types = v;
  }

  get toAttributes(): Product {
    return this.attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'metodo invalido';
    if (this.attributes.description.length < 3) return 'descricao invalida.';
    if (this.attributes.measure.length < 2) return 'unidade de medida invalida.';
    if (this.attributes.weight <= 0) return 'peso do produto invalido.';
    if (this.attributes.price <= 0) return 'preco do produto invalido.';
    if (this.attributes.representation.id <= 0) return '';
    if (this.attributes.types.length == 0) return '';

    try {
      const entity = await runner.manager.save(Product, this.attributes);

      return entity ? '' : 'erro ao inserir o produto';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'metodo invalido';
    if (this.attributes.description.length < 3) return 'descricao invalida.';
    if (this.attributes.measure.length < 2) return 'unidade de medida invalida.';
    if (this.attributes.weight <= 0) return 'peso do produto invalido.';
    if (this.attributes.price <= 0) return 'preco do produto invalido.';
    if (this.attributes.representation.id <= 0) return '';
    if (this.attributes.types.length == 0) return '';

    try {
      const entity = await runner.manager.save(Product, this.attributes);

      return entity ? '' : 'erro ao update o produto';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro invalido';

    try {
      const entity = await runner.manager.remove(this.attributes);

      return entity ? '' : 'erro ao remover o produto.';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (this.attributes.id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(Product, { where: { id } });

      return entity ? new ProductModel(entity) : undefined;
    } catch (e) {
      console.error(e);
      await runner.release();

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(Product);
      const response: ProductModel[] = [];
      for (const entity of entities) response.push(new ProductModel(entity));

      return response;
    } catch (e) {
      console.error(e);
      await runner.release();

      return [];
    }
  }
}
