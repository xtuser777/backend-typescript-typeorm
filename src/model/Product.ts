import { QueryRunner, TypeORMError } from 'typeorm';
import { IProduct, Product as ProductEntity } from '../entity/Product';
import { IRepresentation } from '../entity/Representation';
import { ITruckType } from '../entity/TruckType';

export class Product implements IProduct {
  private attributes!: IProduct;

  constructor(attributes?: IProduct) {
    if (attributes) this.attributes = attributes;
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

  get representation(): IRepresentation {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation) {
    this.attributes.representation = v;
  }

  get types(): ITruckType[] {
    return this.attributes.types;
  }
  set types(v: ITruckType[]) {
    this.attributes.types = v;
  }

  get toAttributes(): IProduct {
    const attributes: IProduct = { ...this.attributes };
    return attributes;
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
      const entity = await runner.manager.save(ProductEntity, this.attributes);

      return entity ? '' : 'erro ao inserir o produto';
    } catch (e) {
      console.error(e);

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
      const entity = await runner.manager.save(ProductEntity, this.attributes);

      return entity ? '' : 'erro ao update o produto';
    } catch (e) {
      console.error(e);

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

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (this.attributes.id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(ProductEntity, {
        where: { id },
        relations: {
          representation: {
            person: { enterprise: true, contact: { address: { city: { state: true } } } },
          },
          types: true,
        },
      });

      return entity ? new Product(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(ProductEntity, {
        relations: {
          representation: {
            person: { enterprise: true, contact: { address: { city: { state: true } } } },
          },
          types: true,
        },
      });

      const products: Product[] = [];
      for (const entity of entities) products.push(new Product(entity));

      return products;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
