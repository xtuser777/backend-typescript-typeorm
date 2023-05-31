import { ICity, City as CityEntity } from '../entity/City';
import { IState } from '../entity/State';
import { State } from '../model/State';
import { AppDataSource } from '../data-source';

export class City implements ICity {
  private _id: number;
  private _name: string;
  private _state: IState;

  constructor(values?: ICity) {
    this._id = values ? values.id : 0;
    this._name = values ? values.name : '';
    this._state = values ? values.state : new State();
  }

  get id(): number {
    return this._id;
  }
  set id(v: number) {
    this._id = v;
  }

  get name(): string {
    return this._name;
  }
  set name(v: string) {
    this._name = v;
  }

  get state(): IState {
    return this._state;
  }
  set state(v: IState) {
    this._state = v;
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
