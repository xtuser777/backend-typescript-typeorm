import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { IEmployee } from '../entity/Employee';
import { ActiveUser } from '../util/active-user';
import { Employee } from '../model/Employee';
import { Event } from '../model/Event';
import { ReceiveBill } from '../model/ReceiveBill';
import { IReceiveBill } from '../entity/ReceiveBill';

export class ReceiveBillController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const bills = await new ReceiveBill().find(runner);
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
      const bill = await new ReceiveBill().findOne(runner, { id });
      await runner.release();
      return res.json(bill ? bill.toAttributes : undefined);
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
      const bill = await new ReceiveBill().findOne(runner, { id });
      if (!bill) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json('conta não cadastrada.');
      }
      const amount = Number.parseFloat(bill.amount.toString());
      const situation =
        payload.bill.amountReceived > 0
          ? payload.bill.amountReceived < bill.amount
            ? 2
            : 3
          : 1;
      const rest =
        payload.bill.amountReceived > 0
          ? payload.bill.amountReceived < amount
            ? amount - payload.bill.amountReceived
            : 0
          : 0;
      const amountReceived = Number.parseFloat(bill.amountReceived.toString());
      if (amountReceived == 0 && payload.bill.amountReceived == 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json('A conta ainda não foi recebida.');
      }
      await runner.startTransaction();
      let pendency: IReceiveBill | undefined = undefined;
      if (situation == 2) {
        pendency = new ReceiveBill({
          ...bill.toAttributes,
          id: 0,
          description: bill.description + ' (Pendência)',
          amount: rest,
          situation: 1,
          amountReceived: 0.0,
          receiveDate: undefined,
          paymentForm: undefined,
        }) as ReceiveBill;
        const responsePendency = await (pendency as ReceiveBill).save(runner);
        if (!responsePendency) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responsePendency);
        }
      }
      if (situation == 1 && bill.pendency) {
        if (bill.pendency.situation > 1) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json('A conta possui pendência recebida.');
        }
        const responsePendency = await new ReceiveBill(bill.pendency).delete(runner);
        if (responsePendency.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responsePendency);
        }
      }
      bill.situation = situation;
      bill.amountReceived = payload.bill.amountReceived;
      bill.receiveDate = payload.bill.receiveDate;
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
            ? `A conta a pagar "${bill.description}" foi recebida parcialmente.`
            : `A conta a pagar "${bill.description}" foi recebida.`,
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
}
