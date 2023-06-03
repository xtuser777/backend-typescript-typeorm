import { QueryRunner, TypeORMError } from 'typeorm';
import { ICity } from '../entity/City';
import { IClient } from '../entity/Client';
import { IEmployee } from '../entity/Employee';
import { ISaleBudget, SaleBudget as SaleBudgetEntity } from '../entity/SaleBudget';
import { ISaleBudgetItem } from '../entity/SaleBudgetItem';

export class SaleBudget implements ISaleBudget {
  private attributes!: ISaleBudget;

  constructor(attributes?: ISaleBudget) {
    if (attributes) this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get date(): string {
    return this.attributes.date;
  }
  set date(v: string) {
    this.attributes.date = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get clientName(): string {
    return this.attributes.clientName;
  }
  set clientName(v: string) {
    this.attributes.clientName = v;
  }

  get clientDocument(): string {
    return this.attributes.clientDocument;
  }
  set clientDocument(v: string) {
    this.attributes.clientDocument = v;
  }

  get clientPhone(): string {
    return this.attributes.clientPhone;
  }
  set clientPhone(v: string) {
    this.attributes.clientPhone = v;
  }

  get clientCellphone(): string {
    return this.attributes.clientCellphone;
  }
  set clientCellphone(v: string) {
    this.attributes.clientCellphone = v;
  }

  get clientEmail(): string {
    return this.attributes.clientEmail;
  }
  set clientEmail(v: string) {
    this.attributes.clientEmail = v;
  }

  get weight(): number {
    return this.attributes.weight;
  }
  set weight(v: number) {
    this.attributes.weight = v;
  }

  get value(): number {
    return this.attributes.value;
  }
  set value(v: number) {
    this.attributes.value = v;
  }

  get validate(): string {
    return this.attributes.validate;
  }
  set validate(v: string) {
    this.attributes.validate = v;
  }

  get salesman(): IEmployee | undefined {
    return this.attributes.salesman;
  }
  set salesman(v: IEmployee | undefined) {
    this.attributes.salesman = v;
  }

  get client(): IClient | undefined {
    return this.attributes.client;
  }
  set client(v: IClient | undefined) {
    this.attributes.client = v;
  }

  get destiny(): ICity {
    return this.attributes.destiny;
  }
  set destiny(v: ICity) {
    this.attributes.destiny = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get items(): ISaleBudgetItem[] {
    return this.attributes.items;
  }
  set items(v: ISaleBudgetItem[]) {
    this.attributes.items = v;
  }

  get toAttributes(): ISaleBudget {
    const attributes: ISaleBudget = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'operação inválida.';
    if (this.attributes.date.length < 10) return 'data de cadastro inválida.';
    if (this.attributes.description.length < 2) return 'descrição do orçamento inválida.';
    if (this.attributes.clientName.length < 2) return 'nome do cliente inválido.';
    if (this.attributes.clientDocument.length < 2)
      return 'documento do cliente inválido.';
    if (this.attributes.clientPhone.length < 2) return 'telefone do cliente inválido.';
    if (this.attributes.clientCellphone.length < 2) return 'celular do cliente inválido.';
    if (this.attributes.clientEmail.length < 2) return 'e-mail do cliente inválido.';
    if (this.attributes.weight <= 0) return 'peso dos itens inválido.';
    if (this.attributes.value <= 0) return 'valor do orçamento inválido.';
    if (this.attributes.validate.length < 10) return 'data de validade inválida.';
    if (
      !this.attributes.destiny ||
      (this.attributes.destiny && this.attributes.destiny.id == 0)
    )
      return 'cidade de destino inválida.';
    if (
      !this.attributes.author ||
      (this.attributes.author && this.attributes.author.id == 0)
    )
      return 'autor do orçamento inválido.';
    if (this.attributes.items.length == 0) return 'não há itens no orçamento.';

    try {
      const entity = await runner.manager.save(SaleBudgetEntity, this.attributes);

      return entity ? '' : 'erro ao inserir o orçamento.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'operação inválida.';
    if (this.attributes.description.length < 2) return 'descrição do orçamento inválida.';
    if (this.attributes.clientName.length < 2) return 'nome do cliente inválido.';
    if (this.attributes.clientDocument.length < 2)
      return 'documento do cliente inválido.';
    if (this.attributes.clientPhone.length < 2) return 'telefone do cliente inválido.';
    if (this.attributes.clientCellphone.length < 2) return 'celular do cliente inválido.';
    if (this.attributes.clientEmail.length < 2) return 'e-mail do cliente inválido.';
    if (this.attributes.weight <= 0) return 'peso dos itens inválido.';
    if (this.attributes.value <= 0) return 'valor do orçamento inválido.';
    if (this.attributes.validate.length < 10) return 'data de validade inválida.';
    if (
      !this.attributes.destiny ||
      (this.attributes.destiny && this.attributes.destiny.id == 0)
    )
      return 'cidade de destino inválida.';
    if (
      !this.attributes.author ||
      (this.attributes.author && this.attributes.author.id == 0)
    )
      return 'autor do orçamento inválido.';
    if (this.attributes.items.length == 0) return 'não há itens no orçamento.';

    try {
      const entity = await runner.manager.save(SaleBudgetEntity, this.attributes);

      return entity ? '' : 'erro ao atualizar o orçamento.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'operação inválida.';

    try {
      const entity = await runner.manager.remove(SaleBudgetEntity, this.attributes);

      return entity ? '' : 'erro ao remover o orçamento.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(SaleBudgetEntity, { where: { id } });

      return entity ? new SaleBudget(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(SaleBudgetEntity);
      const budgets: SaleBudget[] = [];
      for (const entity of entities) budgets.push(new SaleBudget(entity));

      return budgets;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
