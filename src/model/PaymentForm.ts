import { QueryRunner, TypeORMError } from 'typeorm';
import { IPaymentForm, PaymentForm as PaymentFormEntity } from '../entity/PaymentForm';

export class PaymentForm implements IPaymentForm {
  private attributes!: IPaymentForm;

  constructor(attributes?: IPaymentForm) {
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

  get link(): number {
    return this.attributes.link;
  }
  set link(v: number) {
    this.attributes.link = v;
  }

  get deadline(): number {
    return this.attributes.deadline;
  }
  set deadLine(v: number) {
    this.attributes.deadline = v;
  }

  get toAttributes(): IPaymentForm {
    const attributes: IPaymentForm = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'metodo inválido.';
    if (this.attributes.description.length < 2) return 'descrição inválida.';
    if (this.attributes.link <= 0) return 'vínculo da forma de pagamento inválido';
    if (this.attributes.deadline <= 0) return 'prazo inválido.';

    try {
      const entity = await runner.manager.save(PaymentFormEntity, this.attributes);

      return entity ? '' : 'erro ao inserir a forma de pagamento.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'metodo inválido.';
    if (this.attributes.description.length < 2) return 'descrição inválida.';
    if (this.attributes.link <= 0) return 'vínculo da forma de pagamento inválido';
    if (this.attributes.deadline <= 0) return 'prazo inválido.';

    try {
      const entity = await runner.manager.save(PaymentFormEntity, this.attributes);

      return entity ? '' : 'erro ao atualizar a forma de pagamento.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(PaymentFormEntity, this.attributes);

      return entity ? '' : 'erro ao remover a forma de pagamento.';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(PaymentFormEntity, { where: { id } });

      return entity ? new PaymentForm(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(PaymentFormEntity);
      const forms: PaymentForm[] = [];
      for (const entity of entities) forms.push(new PaymentForm(entity));

      return forms;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
