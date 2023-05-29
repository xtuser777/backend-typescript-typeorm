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

  get id(): number {}
  set id(v: number) {}

  get description(): string {}
  set description(v: string) {}

  get measure(): string {}
  set measure(v: string) {}

  get weight(): number {}
  set weight(v: number) {}

  get price(): number {}
  set pricer(v: number) {}

  get priceOut(): number {}
  set priceOut(v: number) {}

  get representation(): Representation {}
  set representation(v: Representation) {}

  get types(): TruckType[] {}
  set types(v: TruckType[]) {}

  get toAttributes(): Product {}
}
