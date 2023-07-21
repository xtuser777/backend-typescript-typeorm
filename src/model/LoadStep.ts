import { FindOptionsWhere, QueryRunner, TypeORMError } from 'typeorm';
import { IFreightOrder } from '../entity/FreightOrder';
import { ILoadStep, LoadStep as LoadStepEntity } from '../entity/LoadStep';
import { IRepresentation } from '../entity/Representation';
import { FreightOrder } from './FreightOrder';
import { Representation } from './Representation';
import { ResultSetHeader } from 'mysql2';

export class LoadStep implements ILoadStep {
  private attributes: ILoadStep;

  constructor(attributes?: ILoadStep) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          order: 0,
          load: 0.0,
          status: 0,
          freightOrder: new FreightOrder(),
          representation: new Representation(),
        };
  }
  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }
  get order(): number {
    return this.attributes.order;
  }
  set order(v: number) {
    this.attributes.order = v;
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
  get freightOrder(): IFreightOrder {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder) {
    this.attributes.freightOrder = v;
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
        ? { success: true, insertedId: 0, message: '' }
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
      const entity: ResultSetHeader = await runner.query(
        'DELETE FROM load_step WHERE id = ?',
        [this.id],
      );
      return entity.affectedRows > 0
        ? { success: true, insertedId: 0, message: '' }
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

  async findOne(runner: QueryRunner, params: FindOptionsWhere<ILoadStep>) {
    try {
      const entity = await runner.manager.findOne(LoadStepEntity, {
        where: params,
        relations: {
          representation: {
            person: { enterprise: true, contact: { address: { city: { state: true } } } },
          },
          freightOrder: {
            representation: true,
            client: {
              person: {
                individual: true,
                enterprise: true,
                contact: { address: { city: { state: true } } },
              },
            },
            destiny: { state: true },
            driver: {
              person: {
                individual: true,
                enterprise: true,
                contact: { address: { city: { state: true } } },
              },
            },
            proprietary: {
              person: {
                individual: true,
                enterprise: true,
                contact: { address: { city: { state: true } } },
              },
            },
            truckType: true,
            truck: true,
            status: { status: true },
            items: {
              product: {
                representation: {
                  person: {
                    enterprise: true,
                    contact: { address: { city: { state: true } } },
                  },
                },
                types: true,
              },
            },
          },
        },
      });
      return entity ? new LoadStep(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
