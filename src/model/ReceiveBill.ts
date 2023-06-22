import { QueryRunner, TypeORMError } from 'typeorm';
import { IEmployee } from '../entity/Employee';
import { IFreightOrder } from '../entity/FreightOrder';
import { IPaymentForm } from '../entity/PaymentForm';
import { IReceiveBill, ReceiveBill as ReceiveBillEntity } from '../entity/ReceiveBill';
import { IRepresentation } from '../entity/Representation';
import { ISaleOrder } from '../entity/SaleOrder';
import { Employee } from './Employee';

export class ReceiveBill implements IReceiveBill {
  private attributes: IReceiveBill;

  constructor(attributes?: IReceiveBill) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          bill: 0,
          description: '',
          payer: '',
          comission: false,
          amount: 0.0,
          dueDate: '',
          amountReceived: 0.0,
          situation: 0,
          author: new Employee(),
        };
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

  get bill(): number {
    return this.attributes.bill;
  }
  set bill(v: number) {
    this.attributes.bill = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get payer(): string {
    return this.attributes.payer;
  }
  set payer(v: string) {
    this.attributes.payer = v;
  }

  get amount(): number {
    return this.attributes.amount;
  }
  set amount(v: number) {
    this.attributes.amount = v;
  }

  get comission(): boolean {
    return this.attributes.comission;
  }
  set comission(v: boolean) {
    this.attributes.comission = v;
  }

  get situation(): number {
    return this.attributes.situation;
  }
  set situation(v: number) {
    this.attributes.situation = v;
  }

  get dueDate(): string {
    return this.attributes.dueDate;
  }
  set dueDate(v: string) {
    this.attributes.dueDate = v;
  }

  get receiveDate(): string | undefined {
    return this.attributes.receiveDate;
  }
  set receiveDate(v: string | undefined) {
    this.attributes.receiveDate = v;
  }

  get amountReceived(): number {
    return this.attributes.amountReceived;
  }
  set amountReceived(v: number) {
    this.attributes.amountReceived = v;
  }

  get pendency(): IReceiveBill | undefined {
    return this.attributes.pendency;
  }
  set pendency(v: IReceiveBill | undefined) {
    this.attributes.pendency = v;
  }

  get paymentForm(): IPaymentForm | undefined {
    return this.attributes.paymentForm;
  }
  set paymentForm(v: IPaymentForm | undefined) {
    this.attributes.paymentForm = v;
  }

  get representation(): IRepresentation | undefined {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation | undefined) {
    this.attributes.representation = v;
  }

  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
  }

  get freightOrder(): IFreightOrder | undefined {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder | undefined) {
    this.attributes.freightOrder = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get toAttributes(): IReceiveBill {
    const attributes: IReceiveBill = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'método inválido.';
    if (this.attributes.date.length < 10) return 'data inválida.';
    if (this.attributes.bill < 1) return 'número da conta inválido.';
    if (this.attributes.description.length < 2) return 'descrição da conta inválida.';
    if (this.attributes.payer.length < 2) return 'pagador da conta inválida.';
    if (this.attributes.amount <= 0) return 'valor da conta inválido.';
    if (this.attributes.situation < 1) return 'situação da conta inválida.';
    if (this.attributes.dueDate.length < 10) return 'data de vencimento inválida.';
    if (this.attributes.author.id <= 0) return 'autor inválido.';

    try {
      const entity = await runner.manager.save(ReceiveBillEntity, this.attributes);
      return entity ? '' : 'erro ao inserir a conta';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido.';
    if (this.attributes.date.length < 10) return 'data inválida.';
    if (this.attributes.bill < 1) return 'número da conta inválido.';
    if (this.attributes.description.length < 2) return 'descrição da conta inválida.';
    if (this.attributes.payer.length < 2) return 'pagador da conta inválida.';
    if (this.attributes.amount <= 0) return 'valor da conta inválido.';
    if (this.attributes.situation < 1) return 'situação da conta inválida.';
    if (this.attributes.dueDate.length < 10) return 'data de vencimento inválida.';
    if (this.attributes.author.id <= 0) return 'autor inválido.';

    try {
      const entity = await runner.manager.save(ReceiveBillEntity, this.attributes);
      return entity ? '' : 'erro ao atualizar a conta';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(ReceiveBillEntity, this.attributes);
      return entity ? '' : 'erro ao remover a conta';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(ReceiveBillEntity, {
        where: { id },
        relations: {
          pendency: true,
          representation: true,
          paymentForm: true,
          saleOrder: true,
          freightOrder: true,
          author: { person: { individual: true } },
        },
      });
      return entity ? new ReceiveBill(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(ReceiveBillEntity, {
        relations: {
          pendency: true,
          representation: true,
          paymentForm: true,
          saleOrder: true,
          freightOrder: true,
          author: { person: { individual: true } },
        },
      });
      const bills: ReceiveBill[] = [];
      for (const entity of entities) bills.push(new ReceiveBill(entity));
      return bills;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
