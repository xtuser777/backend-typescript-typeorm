import { ICity, City as CityEntity } from '../entity/City';
import { IState } from '../entity/State';
import { State } from '../model/State';
import { AppDataSource } from '../data-source';

export class City implements ICity {
  private attributes!: ICity;

  constructor(attributes?: ICity) {
    if (attributes) this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get name(): string {
    return this.attributes.name;
  }
  set name(v: string) {
    this.attributes.name = v;
  }

  get state(): IState {
    return this.attributes.state;
  }
  set state(v: IState) {
    this.attributes.state = v;
  }

  get toAttributes(): ICity {
    const attributes: ICity = { ...this.attributes };
    return attributes;
  }

  async findOne(id: number) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();

    try {
      const entity = await runner.manager.findOne(CityEntity, {
        where: { id },
        relations: { state: true },
      });

      return entity ? new City(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    } finally {
      await runner.release();
    }
  }

  async find() {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();

    try {
      const entities = await runner.manager.find(CityEntity, {
        relations: { state: true },
      });
      const cities: City[] = [];
      for (const entity of entities) {
        cities.push(new City(entity));
      }

      return cities;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      await runner.release();
    }
  }
}
