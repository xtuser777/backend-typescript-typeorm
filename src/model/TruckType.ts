import { QueryRunner, TypeORMError } from 'typeorm';
import { ITruckType } from '../entity/TruckType';

export class TruckType implements ITruckType {
  private attributes!: ITruckType;

  constructor(attributes?: ITruckType) {
    if (attributes) this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get axes(): number {
    return this.attributes.axes;
  }
  set axes(v: number) {
    this.attributes.axes = v;
  }

  get capacity(): number {
    return this.attributes.capacity;
  }
  set capacity(v: number) {
    this.attributes.capacity = v;
  }

  get toAttributes(): TruckType {
    const attributes: ITruckType = { ...this.attributes };
    return attributes;
  }

//   async save(runner: QueryRunner) {
//     if (this.attributes.id != 0) return 'metodo incorreto.';
//     if (this.attributes.description.length <= 0) return 'descricao invalida.';
//     if (this.attributes.axes <= 0) return 'numero de eixos invalido.';
//     if (this.attributes.capacity <= 0) return 'capacidade invalida.';

//     try {
//       const response = await runner.manager.save(TruckType, this.attributes);

//       return response ? '' : 'erro ao inserir o tipo de caminhao.';
//     } catch (e) {
//       console.error(e);
//       await runner.release();

//       return (e as TypeORMError).message;
//     }
//   }

//   async update(runner: QueryRunner) {
//     if (this.attributes.id <= 0) return 'metodo incorreto.';
//     if (this.attributes.description.length <= 0) return 'descricao invalida.';
//     if (this.attributes.axes <= 0) return 'numero de eixos invalido.';
//     if (this.attributes.capacity <= 0) return 'capacidade invalida.';

//     try {
//       const response = await runner.manager.save(TruckType, this.attributes);

//       return response ? '' : 'erro ao atualizar o tipo de caminhao.';
//     } catch (e) {
//       console.error(e);
//       await runner.release();

//       return (e as TypeORMError).message;
//     }
//   }

//   async delete(runner: QueryRunner) {
//     if (this.attributes.id <= 0) return 'registro invalido.';

//     try {
//       const response = await runner.manager.remove(this.attributes);

//       return response ? '' : 'erro ao remover o tipo de caminhao';
//     } catch (e) {
//       console.error(e);
//       await runner.release();

//       return (e as TypeORMError).message;
//     }
//   }

//   async findOne(runner: QueryRunner, id: number) {
//     if (id <= 0) return undefined;

//     try {
//       const entity = await runner.manager.findOne(TruckType, { where: { id } });

//       return entity ? new TruckTypeModel(entity) : undefined;
//     } catch (e) {
//       console.error(e);
//       await runner.release();

//       return undefined;
//     }
//   }

//   async find(runner: QueryRunner) {
//     try {
//       const entities = await runner.manager.find(TruckType);
//       const types: TruckTypeModel[] = [];
//       for (const entity of entities) types.push(new TruckTypeModel(entity));

//       return types;
//     } catch (e) {
//       console.error(e);
//       await runner.release();

//       return [];
//     }
//   }
}
