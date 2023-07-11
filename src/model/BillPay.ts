import { FindOptionsWhere, QueryRunner, TypeORMError } from 'typeorm';
import { IBillPay, BillPay as BillPayEntity } from '../entity/BillPay';
import { IBillPayCategory } from '../entity/BillPayCategory';
import { IDriver } from '../entity/Driver';
import { IEmployee } from '../entity/Employee';
import { IFreightOrder } from '../entity/FreightOrder';
import { IPaymentForm } from '../entity/PaymentForm';
import { ISaleOrder } from '../entity/SaleOrder';
import { BillPayCategory } from './BillPayCategory';
import { Employee } from './Employee';

export class BillPay implements IBillPay {
  private attributes: IBillPay;

  constructor(attributes?: IBillPay) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          bill: 0,
          description: '',
          type: 0,
          enterprise: '',
          installment: 0,
          amount: 0.0,
          comission: false,
          situation: 0,
          dueDate: '',
          paymentDate: undefined,
          amountPaid: 0.0,
          pendency: undefined,
          driver: undefined,
          salesman: undefined,
          freightOrder: undefined,
          saleOrder: undefined,
          paymentForm: undefined,
          category: new BillPayCategory(),
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

  get type(): number {
    return this.attributes.type;
  }
  set type(v: number) {
    this.attributes.type = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get enterprise(): string {
    return this.attributes.enterprise;
  }
  set enterprise(v: string) {
    this.attributes.enterprise = v;
  }

  get installment(): number {
    return this.attributes.installment;
  }
  set installment(v: number) {
    this.attributes.installment = v;
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

  get paymentDate(): string | undefined {
    return this.attributes.paymentDate;
  }
  set paymentDate(v: string | undefined) {
    this.attributes.paymentDate = v;
  }

  get amountPaid(): number {
    return this.attributes.amountPaid;
  }
  set amountPaid(v: number) {
    this.attributes.amountPaid = v;
  }

  get pendency(): IBillPay | undefined {
    return this.attributes.pendency;
  }
  set pendency(v: IBillPay | undefined) {
    this.attributes.pendency = v;
  }

  get driver(): IDriver | undefined {
    return this.attributes.driver;
  }
  set driver(v: IDriver | undefined) {
    this.attributes.driver = v;
  }

  get salesman(): IEmployee | undefined {
    return this.attributes.salesman;
  }
  set salesman(v: IEmployee | undefined) {
    this.attributes.salesman = v;
  }

  get freightOrder(): IFreightOrder | undefined {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder | undefined) {
    this.attributes.freightOrder = v;
  }

  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
  }

  get category(): IBillPayCategory {
    return this.attributes.category;
  }
  set category(v: IBillPayCategory) {
    this.attributes.category = v;
  }

  get paymentForm(): IPaymentForm | undefined {
    return this.attributes.paymentForm;
  }
  set paymentForm(v: IPaymentForm | undefined) {
    this.attributes.paymentForm = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get toAttributes(): IBillPay {
    const attributes: IBillPay = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0)
      return { success: false, insertedId: 0, message: 'método inválido.' };
    if (this.attributes.date.length < 10)
      return { success: false, insertedId: 0, message: 'data inválida.' };
    if (this.attributes.bill < 1)
      return { success: false, insertedId: 0, message: 'número de conta inválido.' };
    if (this.attributes.type < 1)
      return { success: false, insertedId: 0, message: 'tipo de conta inválida.' };
    if (this.attributes.description.length < 2)
      return { success: false, insertedId: 0, message: 'descrição da conta inválida.' };
    if (this.attributes.enterprise.length < 2)
      return { success: false, insertedId: 0, message: 'empresa recebedora inválida.' };
    if (this.attributes.installment < 1)
      return { success: false, insertedId: 0, message: 'número da parcela inválida.' };
    if (this.attributes.amount <= 0)
      return { success: false, insertedId: 0, message: 'valor da conta inválido.' };
    if (this.attributes.situation < 1)
      return { success: false, insertedId: 0, message: 'situação da conta inválida.' };
    if (this.attributes.dueDate.length < 10)
      return { success: false, insertedId: 0, message: 'data de vencimento.' };
    if (this.attributes.category.id <= 0)
      return { success: false, insertedId: 0, message: 'categoria da conta inválida.' };
    if (this.attributes.author.id <= 0)
      return { success: false, insertedId: 0, message: 'autor da conta inválida.' };

    console.log(this.attributes);

    try {
      const entity = await runner.manager.save(BillPayEntity, this.attributes);
      return entity
        ? { success: true, insertedId: entity.id, message: '' }
        : { success: false, insertedId: 0, message: 'erro ao inserir a conta' };
    } catch (e) {
      console.error(e);
      return { success: false, insertedId: 0, message: (e as TypeORMError).message };
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido.';
    if (this.attributes.date.length < 10) return 'data inválida.';
    if (this.attributes.bill < 1) return 'número de conta inválido.';
    if (this.attributes.type < 1) return 'tipo de conta inválida.';
    if (this.attributes.description.length < 2) return 'descrição da conta inválida.';
    if (this.attributes.enterprise.length < 2) return 'empresa recebedora inválida.';
    if (this.attributes.installment < 1) return 'número da parcela inválida.';
    if (this.attributes.amount <= 0) return 'valor da conta inválido.';
    if (this.attributes.situation < 1) return 'situação da conta inválida.';
    if (this.attributes.dueDate.length < 10) return 'data de vencimento.';
    if (this.attributes.category.id <= 0) return 'categoria da conta inválida.';
    if (this.attributes.author.id <= 0) return 'autor da conta inválida.';

    try {
      const entity = await runner.manager.save(BillPayEntity, this.attributes);
      return entity ? '' : 'erro ao atualizar a conta';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro inválido.';

    try {
      const entity = await runner.manager.remove(BillPayEntity, this.attributes);
      return entity ? '' : 'erro ao remover a conta';
    } catch (e) {
      console.error(e);
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, params: FindOptionsWhere<IBillPay>) {
    try {
      const entity = await runner.manager.findOne(BillPayEntity, {
        where: params,
        relations: {
          pendency: true,
          driver: true,
          salesman: true,
          freightOrder: true,
          saleOrder: true,
          category: true,
          paymentForm: true,
          author: true,
        },
      });
      return entity ? new BillPay(entity) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async find(runner: QueryRunner, params?: FindOptionsWhere<IBillPay>) {
    try {
      const entities = await runner.manager.find(BillPayEntity, {
        where: params,
        relations: {
          pendency: true,
          driver: true,
          salesman: true,
          freightOrder: true,
          saleOrder: true,
          category: true,
          paymentForm: true,
          author: { person: { individual: true } },
        },
      });
      const bills: BillPay[] = [];
      for (const entity of entities) bills.push(new BillPay(entity));
      return bills;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
