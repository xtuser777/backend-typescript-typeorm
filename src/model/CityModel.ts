import { City } from '../entity/City';
import { State } from '../entity/State';
import { AppDataSource } from '../data-source';

export class CityModel {
  private attributes: City;

  constructor(attributes: City = new City()) {
    this.attributes = attributes;
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

  get state(): State {
    return this.attributes.state;
  }
  set state(v: State) {
    this.attributes.state = v;
  }

  get toAttributes(): City {
    return this.attributes;
  }

  async findOne(id: number) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();

    try {
      const entity = await runner.manager.findOne(City, {
        where: { id },
        relations: { state: true },
      });

      return entity ? new CityModel(entity) : undefined;
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
      const entities = await runner.manager.find(City, { relations: { state: true } });
      const cities: CityModel[] = [];
      for (const entity of entities) {
        cities.push(new CityModel(entity));
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
