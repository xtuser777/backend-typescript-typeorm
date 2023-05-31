import { ICity } from '../entity/City';
import { IState, State as StateEntity } from '../entity/State';
import { AppDataSource } from '../data-source';

export class State implements IState {
  private _id: number;
  private _name: string;
  private _acronym: string;
  private _cities: ICity[];

  constructor(values?: IState) {
    this._id = values ? values.id : 0;
    this._name = values ? values.name : '';
    this._acronym = values ? values.acronym : '';
    this._cities = values ? values.cities : [];
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

  get acronym(): string {
    return this._acronym;
  }
  set acronym(v: string) {
    this._acronym = v;
  }

  get cities(): ICity[] {
    return this._cities;
  }
  set cities(v: ICity[]) {
    this._cities = v;
  }

  async findOne(id: number) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();

    try {
      const entity = await runner.manager.findOne(StateEntity, { where: { id } });

      return entity ? new State(entity) : undefined;
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
      const entities = await runner.manager.find(StateEntity, {
        relations: {
          cities: true,
        },
      });

      const states: State[] = [];

      for (const entity of entities) {
        states.push(new State(entity));
      }

      return states;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      await runner.release();
    }
  }
}
