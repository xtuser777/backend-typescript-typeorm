import { QueryRunner, TypeORMError } from 'typeorm';
import { IFreightOrder } from '../entity/FreightOrder';
import { ILoadStep, LoadStep as LoadStepEntity } from '../entity/LoadStep';
import { IRepresentation } from '../entity/Representation';
import { FreightOrder } from './FreightOrder';
import { Representation } from './Representation';

export class LoadStep implements ILoadStep {
  private attributes: ILoadStep;

  constructor(attributes?: ILoadStep) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          load: 0.0,
          status: 0,
          order: new FreightOrder(),
          representation: new Representation(),
        };
  }
  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }
  get status(): number {
    return this.attributes.status;
  }
  set status(v: number) {
    this.attributes.status = v;
  }
  get load(): number {
    return this.attributes.load;
  }
  set load(v: number) {
    this.attributes.load = v;
  }
  get order(): IFreightOrder {
    return this.attributes.order;
  }
  set order(v: IFreightOrder) {
    this.attributes.order = v;
  }
  get representation(): IRepresentation {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation) {
    this.attributes.representation = v;
  }

  get toAttributes(): ILoadStep {
    const attributes: ILoadStep = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    try {
      const entity = await runner.manager.save(LoadStepEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : {
            success: false,
            insertedId: 0,
            message: 'erro ao inserir a etapa de carregamento.',
          };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async update(runner: QueryRunner) {
    try {
      const entity = await runner.manager.save(LoadStepEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : {
            success: false,
            insertedId: 0,
            message: 'erro ao atualizar a etapa de carregamento.',
          };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async delete(runner: QueryRunner) {
    try {
      const entity = await runner.manager.remove(LoadStepEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : {
            success: false,
            insertedId: 0,
            message: 'erro ao remover a etapa de carregamento.',
          };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }
}
