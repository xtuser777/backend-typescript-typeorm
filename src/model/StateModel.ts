import { Repository } from 'typeorm';
import { City } from '../entity/City';
import { State } from '../entity/State';
import { AppDataSource } from '../data-source';

export class StateModel {
  private attributes: State;
  private repository: Repository<State>;

  constructor(attributes: State = new State()) {
    this.attributes = attributes;
    this.repository = AppDataSource.getRepository(State);
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

  get cities(): City[] {
    return this.attributes.cities;
  }
  set cities(v: City[]) {
    this.attributes.cities = v;
  }

  get toAttributes(): State {
    return this.attributes;
  }

  async findOne(id: number) {
    try {
      const entity = await this.repository.findOne({ where: { id } });

      return entity ? new StateModel(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find() {
    try {
      const entities = (await this.repository?.find({
        relations: {
          cities: true,
        },
      })) as State[];

      const states: StateModel[] = [];

      for (const entity of entities) {
        states.push(new StateModel(entity));
      }

      return states;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
