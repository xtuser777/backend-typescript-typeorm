import { QueryRunner, TypeORMError } from 'typeorm';
import { IProprietary } from '../entity/Proprietary';
import { ITruck, Truck as TruckEntity } from '../entity/Truck';
import { ITruckType } from '../entity/TruckType';

export class Truck {
  private attributes!: ITruck;

  constructor(attributes?: ITruck) {
    if (attributes) this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get plate(): string {
    return this.attributes.plate;
  }
  set plate(v: string) {
    this.attributes.plate = v;
  }

  get brand(): string {
    return this.attributes.brand;
  }
  set brand(v: string) {
    this.attributes.brand = v;
  }

  get model(): string {
    return this.attributes.model;
  }
  set model(v: string) {
    this.attributes.model = v;
  }

  get color(): string {
    return this.attributes.color;
  }
  set color(v: string) {
    this.attributes.color = v;
  }

  get manufactureYear(): number {
    return this.attributes.manufactureYear;
  }
  set manufactureYear(v: number) {
    this.attributes.manufactureYear = v;
  }

  get modelYear(): number {
    return this.attributes.modelYear;
  }
  set modelYear(v: number) {
    this.attributes.modelYear = v;
  }

  get type(): ITruckType {
    return this.attributes.type;
  }
  set type(v: ITruckType) {
    this.attributes.type = v;
  }

  get proprietary(): IProprietary {
    return this.attributes.proprietary;
  }
  set proprietary(v: IProprietary) {
    this.attributes.proprietary = v;
  }

  get toAttributes(): ITruck {
    const attributes: ITruck = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'metodo invalido.';

    if (this.attributes.plate.length < 8) return 'placa do caminhao invalida.';
    if (this.attributes.brand.length < 2) return 'marca do caminhao invalida.';
    if (this.attributes.model.length < 2) return 'modelo do caminhao invalido.';
    if (this.attributes.color.length < 3) return 'cor do caminhao invalida.';
    if (this.attributes.manufactureYear < 1980) return 'ano de fabricacao invalido.';
    if (this.attributes.modelYear < 1980) return 'ano do modelo invalido.';
    if (this.attributes.type.id <= 0) return 'tipo de caminhao invalido.';
    if (this.attributes.proprietary.id <= 0) return 'proprietario do caminhao invalido.';

    try {
      const response = await runner.manager.save(TruckEntity, this.attributes);

      return response ? '' : 'erro ao inserir o caminhao.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'metodo invalido.';

    if (this.attributes.plate.length < 8) return 'placa do caminhao invalida.';
    if (this.attributes.brand.length < 2) return 'marca do caminhao invalida.';
    if (this.attributes.model.length < 2) return 'modelo do caminhao invalido.';
    if (this.attributes.color.length < 3) return 'cor do caminhao invalida.';
    if (this.attributes.manufactureYear < 1980) return 'ano de fabricacao invalido.';
    if (this.attributes.modelYear < 1980) return 'ano do modelo invalido.';
    if (this.attributes.type.id <= 0) return 'tipo de caminhao invalido.';
    if (this.attributes.proprietary.id <= 0) return 'proprietario do caminhao invalido.';

    try {
      const response = await runner.manager.save(TruckEntity, this.attributes);

      return response ? '' : 'erro ao atualizar o caminhao.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro invalido.';

    try {
      const response = await runner.manager.remove(this.attributes);

      return response ? '' : 'erro ao remover o caminhao.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(TruckEntity, {
        where: { id },
        relations: {
          type: true,
          proprietary: {
            driver: {
              person: {
                individual: true,
                contact: { address: { city: { state: true } } },
              },
            },
            person: {
              individual: true,
              enterprise: true,
              contact: { address: { city: { state: true } } },
            },
          },
        },
      });

      return entity ? new Truck(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(TruckEntity, {
        relations: {
          type: true,
          proprietary: {
            driver: {
              person: {
                individual: true,
                contact: { address: { city: { state: true } } },
              },
            },
            person: {
              individual: true,
              enterprise: true,
              contact: { address: { city: { state: true } } },
            },
          },
        },
      });
      const trucks: Truck[] = [];
      for (const entity of entities) trucks.push(new Truck(entity));

      return trucks;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
