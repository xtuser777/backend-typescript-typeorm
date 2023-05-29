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

  get id(): number { return this.attributes.id; }
  set id(v: number) { this.attributes = v; }

  get description(): string { return this.attributes.description; }
  set description(v: string) { this.attributes.description = v; }

  get measure(): string { return this.attributes.measure; }
  set measure(v: string) { this.attributes.measure = v; }

  get weight(): number { return this.attributes.weight; }
  set weight(v: number) { this.attributes.weight = v; }

  get price(): number { return this.attributes.price; }
  set price(v: number) { this.attributes.price = v; }

  get priceOut(): number { return this.attributes.priceOut; }
  set priceOut(v: number) { this.attributes.priceOut = v; }

  get representation(): Representation { return this.attributes.representation; }
  set representation(v: Representation) { this.attributes.representation = v; }

  get types(): TruckType[] { return this.attributes.types; }
  set types(v: TruckType[]) { this.attributes.types = v; }

  get toAttributes(): Product { return this.attributes; }

  async save(runner: QueryRunner) {}

  async update(runner: QueryRunner) {}

  async delete(runner: QueryRunner) {}

  async findOne(runner: QueryRunner, id: number) {}

  async find(runner: QueryRunner) {}
}
