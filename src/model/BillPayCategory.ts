import { QueryRunner, TypeORMError } from 'typeorm';
import {
  IBillPayCategory,
  BillPayCategory as BillPayCategoryEntity,
} from '../entity/BillPayCategory';

export class BillPayCategory implements IBillPayCategory {
  private attributes!: IBillPayCategory;

  constructor(attributes?: IBillPayCategory) {
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

  get toAttributes(): IBillPayCategory {
    const attributes: IBillPayCategory = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'operação inválida';
    if (this.attributes.description.length < 1) return 'descrição inválida.';

    try {
      const entity = await runner.manager.save(BillPayCategoryEntity, this.attributes);

      return entity ? '' : 'erro ao inserir a categoria.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'operação inválida';
    if (this.attributes.description.length < 1) return 'descrição inválida.';

    try {
      const entity = await runner.manager.save(BillPayCategoryEntity, this.attributes);

      return entity ? '' : 'erro ao atualizar a categoria.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(BillPayCategoryEntity, this.attributes);

      return entity ? '' : 'erro ao remover a categoria.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(BillPayCategoryEntity, {
        where: { id },
      });

      return entity ? new BillPayCategory(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(BillPayCategoryEntity);
      const categories: BillPayCategory[] = [];
      for (const entity of entities) categories.push(new BillPayCategory(entity));

      return categories;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
