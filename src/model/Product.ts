// import { QueryRunner, TypeORMError } from 'typeorm';
// import { IProduct, Product as ProductEntity } from '../entity/Product';
// import { Representation } from '../entity/Representation';
// import { TruckType } from '../entity/TruckType';

// export class Product implements IProduct {
//   private _id: number;
//   private _description: string;
//   private _measure: string;
//   private _weight: number;
//   private _price: number;
//   private _priceOut: number;
//   private _representation: Representation;
//   private _types: TruckType[];

//   constructor(values?: IProduct) {
//     this._id = values ? values.id : 0;
//     this._description = values ? values.description : '';
//     this._measure = values ? values.measure : '';
//     this._weight = values ? values.weight : 0.0;
//     this._price = values ? values.price : 0.0;
//     this._priceOut = values ? values.priceOut : 0.0;
//     this._representation = values ? values.representation : new Representation();
//     this._types = values ? values.types : [];
//   }

//   get id(): number {
//     return this._id;
//   }
//   set id(v: number) {
//     this._id = v;
//   }

//   get description(): string {
//     return this._description;
//   }
//   set description(v: string) {
//     this._description = v;
//   }

//   get measure(): string {
//     return this._measure;
//   }
//   set measure(v: string) {
//     this._measure = v;
//   }

//   get weight(): number {
//     return this._weight;
//   }
//   set weight(v: number) {
//     this._weight = v;
//   }

//   get price(): number {
//     return this._price;
//   }
//   set price(v: number) {
//     this._price = v;
//   }

//   get priceOut(): number {
//     return this._priceOut;
//   }
//   set priceOut(v: number) {
//     this._priceOut = v;
//   }

//   get representation(): Representation {
//     return this._representation;
//   }
//   set representation(v: Representation) {
//     this._representation = v;
//   }

//   get types(): TruckType[] {
//     return this._types;
//   }
//   set types(v: TruckType[]) {
//     this._types = v;
//   }

//   async save(runner: QueryRunner) {
//     if (this._id != 0) return 'metodo invalido';
//     if (this._description.length < 3) return 'descricao invalida.';
//     if (this._measure.length < 2) return 'unidade de medida invalida.';
//     if (this._weight <= 0) return 'peso do produto invalido.';
//     if (this._price <= 0) return 'preco do produto invalido.';
//     if (this._representation.id <= 0) return '';
//     if (this._types.length == 0) return '';

//     try {
//       const entity = await runner.manager.save(ProductEntity, this);

//       return entity ? '' : 'erro ao inserir o produto';
//     } catch (e) {
//       console.error(e);

//       return (e as TypeORMError).message;
//     }
//   }

//   async update(runner: QueryRunner) {
//     if (this._id <= 0) return 'metodo invalido';
//     if (this._description.length < 3) return 'descricao invalida.';
//     if (this._measure.length < 2) return 'unidade de medida invalida.';
//     if (this._weight <= 0) return 'peso do produto invalido.';
//     if (this._price <= 0) return 'preco do produto invalido.';
//     if (this._representation.id <= 0) return '';
//     if (this._types.length == 0) return '';

//     try {
//       const entity = await runner.manager.save(ProductEntity, this);

//       return entity ? '' : 'erro ao update o produto';
//     } catch (e) {
//       console.error(e);

//       return (e as TypeORMError).message;
//     }
//   }

//   async delete(runner: QueryRunner) {
//     if (this._id <= 0) return 'registro invalido';

//     try {
//       const entity = await runner.manager.remove(this);

//       return entity ? '' : 'erro ao remover o produto.';
//     } catch (e) {
//       console.error(e);

//       return (e as TypeORMError).message;
//     }
//   }

//   async findOne(runner: QueryRunner, id: number) {
//     if (this._id <= 0) return undefined;

//     try {
//       const entity = await runner.manager.findOne(ProductEntity, {
//         where: { id },
//         relations: {
//           representation: {
//             person: { enterprise: true, contact: { address: { city: { state: true } } } },
//           },
//           types: true,
//         },
//       });

//       return entity ? new Product(entity) : undefined;
//     } catch (e) {
//       console.error(e);

//       return undefined;
//     }
//   }

//   async find(runner: QueryRunner) {
//     try {
//       const entities = await runner.manager.find(ProductEntity, {
//         relations: {
//           representation: {
//             person: { enterprise: true, contact: { address: { city: { state: true } } } },
//           },
//           types: true,
//         },
//       });

//       const products: Product[] = [];
//       for (const entity of entities) products.push(new Product(entity));

//       return products;
//     } catch (e) {
//       console.error(e);

//       return [];
//     }
//   }
// }
