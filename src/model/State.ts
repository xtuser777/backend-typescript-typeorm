import { ICity } from '../entity/City';
import { IState, State as StateEntity } from '../entity/State';
import { AppDataSource } from '../data-source';

export class State implements IState {
  private attributes!: IState;

  constructor(attributes?: IState) {
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

  get acronym(): string {
    return this.attributes.acronym;
  }
  set acronym(v: string) {
    this.attributes.acronym = v;
  }

  get cities(): ICity[] {
    return this.attributes.cities;
  }
  set cities(v: ICity[]) {
    this.attributes.cities = v;
  }

  get toAttributes(): IState {
    const attributes: IState = { ...this.attributes };
    return attributes;
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
      const entities: IState[] = await runner.query('SELECT * FROM state;');

      const states: State[] = [];

      for (const entity of entities) {
        const state = new State(entity);
        state.cities = await runner.query(
          'SELECT id, name FROM city WHERE state_id = ?',
          [state.id],
        );
        states.push(state);
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
