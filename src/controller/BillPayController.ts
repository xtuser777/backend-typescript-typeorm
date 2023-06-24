import { Request, Response, response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { BillPay } from '../model/BillPay';
import { IBillPay } from '../entity/BillPay';
import { IDriver } from '../entity/Driver';
import { IEmployee } from '../entity/Employee';
import { FreightOrder } from '../model/FreightOrder';
import { IFreightOrder } from '../entity/FreightOrder';
import { ISaleOrder } from '../entity/SaleOrder';
import { IPaymentForm } from '../entity/PaymentForm';
import { IBillPayCategory } from '../entity/BillPayCategory';
import { ActiveUser } from '../util/active-user';
import { Employee } from '../model/Employee';
import { Event } from '../model/Event';

export class BillPayController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const bills = await new BillPay().find(runner);
      await runner.release();
      const response = [];
      for (const bill of bills) response.push(bill.toAttributes);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async show(req: Request, res: Response) {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const bill = await new BillPay().findOne(runner, { id });
      await runner.release();
      return res.json(bill ? bill.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const payload = req.body;
    const pendency: IBillPay | undefined = payload.bill.pendency;
    const driver: IDriver | undefined = payload.bill.driver;
    const salesman: IEmployee | undefined = payload.bill.salesman;
    const freightOrder: IFreightOrder | undefined = payload.bill.freightOrder;
    const saleOrder: ISaleOrder | undefined = payload.bill.saleOrder;
    const paymentForm: IPaymentForm | undefined = payload.bill.paymentForm;
    const category: IBillPayCategory = payload.bill.category;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const activeUser = ActiveUser.getInstance() as ActiveUser;
      const author = (await new Employee().findOne(runner, activeUser.getId()))
        ?.toAttributes as IEmployee;
      const installmentAmount =
        payload.bill.type == 2
          ? payload.bill.amount / payload.bill.installments
          : payload.bill.amount;
      const bill: IBillPay = {
        id: 0,
        ...payload.bill,
        amount: installmentAmount,
        paymentDate:
          payload.bill.amountPaid > 0
            ? new Date().toISOString().substring(0, 10)
            : undefined,
        situation:
          payload.bill.amountPaid > 0
            ? payload.bill.amountPaid < installmentAmount
              ? 2
              : 3
            : 1,
        pendency: pendency,
        driver: driver,
        salesman: salesman,
        freightOrder: freightOrder,
        saleOrder: saleOrder,
        paymentForm: paymentForm,
        category: category,
        author: author,
      };
      await runner.startTransaction();
      const response = await new BillPay(bill).save(runner);
      if (!response.success) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response.message);
      }
      if (bill.type == 1 && bill.amountPaid < bill.amount) {
        const pendAmount = bill.amount - bill.amountPaid;
        const pendency = new BillPay({
          ...bill,
          situation: 1,
          amount: pendAmount,
          amountPaid: 0.0,
          paymentDate: undefined,
          paymentForm: undefined,
        });
        const responsePendency = await pendency.save(runner);
        if (!responsePendency.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responsePendency.message);
        }
        const responseBillPendency = await new BillPay({
          ...bill,
          id: response.insertedId,
          pendency: pendency.toAttributes,
        }).update(runner);
        if (responseBillPendency.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseBillPendency);
        }
      }
      for (let i = 1; 1 < payload.bill.installments && response.success; i++) {
        let date = new Date();
        if (bill.type == 2) {
          date = new Date(
            new Date().setDate(new Date().getDate() + payload.bill.interval),
          );
        } else {
          switch (payload.bill.frequency) {
            case 1:
              date = new Date(new Date().setMonth(new Date().getMonth() + i));
              break;
            case 2:
              date = new Date(new Date().setFullYear(new Date().getFullYear() + i));
              break;
          }
        }
        const responseBillInstallment = await new BillPay({
          ...bill,
          installment: i + 1,
          dueDate: date.toISOString().substring(0, 10),
          situation: 1,
          amountPaid: 0.0,
          paymentDate: undefined,
          paymentForm: undefined,
        }).save(runner);
        if (!responseBillInstallment.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseBillInstallment.message);
        }
      }
      const responseEvent = await new Event({
        id: 0,
        description: `A conta a pagar "${bill.description}" foi lançada.`,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        freightOrder: bill.freightOrder,
        author,
      }).save(runner);
      if (responseEvent.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseEvent);
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json(response.message);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async update(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    const payload = req.body;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const bill = await new BillPay().findOne(runner, { id });
      if (!bill) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json('conta não cadastrada.');
      }
      const situation =
        payload.bill.amountPaid > 0 ? (payload.bill.amountPaid < bill.amount ? 2 : 3) : 1;
      const rest =
        payload.amountPaid > 0
          ? payload.bill.amountPaid < bill.amount
            ? bill.amount - payload.bill.amountPaid
            : 0
          : 0;
      if (bill.amountPaid == 0 && payload.bill.amountPaid == 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json('A conta ainda não foi quitada.');
      }
      await runner.startTransaction();
      let pendency: IBillPay | undefined = undefined;
      if (situation == 2) {
        pendency = new BillPay({
          ...bill.toAttributes,
          id: 0,
          amount: rest,
          situation: 1,
          amountPaid: 0.0,
          paymentDate: undefined,
          paymentForm: undefined,
        }) as BillPay;
        const responsePendency = await (pendency as BillPay).save(runner);
        if (!responsePendency.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responsePendency.message);
        }
      }
      if (situation == 1 && bill.pendency) {
        if (bill.pendency.situation > 1) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json('A conta possui pendência paga.');
        }
        const responsePendency = await new BillPay(bill.pendency).delete(runner);
        if (responsePendency.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responsePendency);
        }
      }
      bill.situation = situation;
      bill.amountPaid = payload.bill.amountPaid;
      bill.paymentDate = payload.bill.paymentDate;
      bill.pendency = pendency;
      bill.paymentForm = payload.bill.paymentForm;
      const response = await bill.update(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      const activeUser = ActiveUser.getInstance() as ActiveUser;
      const author = (await new Employee().findOne(runner, activeUser.getId()))
        ?.toAttributes as IEmployee;
      const responseEvent = await new Event({
        id: 0,
        description:
          situation == 1
            ? `A conta a pagar "${bill.description}" foi estornada.`
            : situation == 2
            ? `A conta a pagar "${bill.description}" foi quitada parcialmente.`
            : `A conta a pagar "${bill.description}" foi quitada.`,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        saleOrder: bill.saleOrder,
        freightOrder: bill.freightOrder,
        author,
      }).save(runner);
      if (responseEvent.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseEvent);
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async delete(req: Request, res: Response) {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const bill = await new BillPay().findOne(runner, { id });
      if (!bill) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json('conta não cadastrada.');
      }
      if (bill.situation > 1 || bill.amountPaid > 0) {
        await runner.release();
        return res.status(400).json('não é possível remover uma conta quitada.');
      }
      if (bill.driver != undefined || bill.salesman != undefined) {
        await runner.release();
        return res
          .status(400)
          .json('não é possível remover uma conta criada por um pedido.');
      }
      let installments: IBillPay[] = [];
      if (bill.type > 1)
        installments = await new BillPay().find(runner, { bill: bill.bill });
      await runner.startTransaction();
      let response = '';
      if (bill.type == 1) {
        response = await bill.delete(runner);
        if (response.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(response);
        }
      } else {
        for (const installment of installments) {
          response = await new BillPay(installment).delete(runner);
          if (response.length > 0) {
            await runner.rollbackTransaction();
            await runner.release();
            return res.status(400).json(response);
          }
        }
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }
}
