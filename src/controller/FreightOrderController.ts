import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { FreightOrder } from '../model/FreightOrder';
import { IFreightOrder } from '../entity/FreightOrder';
import { IFreightBudget } from '../entity/FreightBudget';
import { ISaleOrder } from '../entity/SaleOrder';
import { IRepresentation } from '../entity/Representation';
import { IClient } from '../entity/Client';
import { ICity } from '../entity/City';
import { IDriver } from '../entity/Driver';
import { IProprietary } from '../entity/Proprietary';
import { ITruckType } from '../entity/TruckType';
import { ITruck } from '../entity/Truck';
import { IOrderStatus } from '../entity/OrderStatus';
import { IPaymentForm } from '../entity/PaymentForm';
import { IFreightItem } from '../entity/FreightItem';
import { ILoadStep } from '../entity/LoadStep';
import { ActiveUser } from '../util/active-user';
import { Employee } from '../model/Employee';
import { IEmployee } from '../entity/Employee';
import { LoadStep } from '../model/LoadStep';
import { BillPay } from '../model/BillPay';
import { BillPay as BillPayEntity } from '../entity/BillPay';
import { BillPayCategory } from '../model/BillPayCategory';
import { ReceiveBill } from '../model/ReceiveBill';
import { ReceiveBill as ReceiveBillEntity } from '../entity/ReceiveBill';
import { Event } from '../model/Event';
import { FreightItem } from '../model/FreightItem';

export class FreightOrderController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const orders = await new FreightOrder().find(runner);
      await runner.release();
      const response = [];
      for (const order of orders) response.push(order.toAttributes);
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
      const order = await new FreightOrder().findOne(runner, { id });
      await runner.release();
      return res.json(order ? order.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const payload = req.body;
    const budget: IFreightBudget | undefined = payload.order.budget;
    const saleOrder: ISaleOrder | undefined = payload.order.saleOrder;
    const representation: IRepresentation | undefined = payload.order.representation;
    const client: IClient = payload.order.client;
    const destiny: ICity = payload.order.destiny;
    const driver: IDriver = payload.order.driver;
    const proprietary: IProprietary = payload.order.proprietary;
    const truckType: ITruckType = payload.order.truckType;
    const truck: ITruck = payload.order.truck;
    const status: IOrderStatus = payload.order.status;
    const paymentFormFreight: IPaymentForm = payload.order.paymentFormFreight;
    const paymentFormDriver: IPaymentForm = payload.order.paymentFormDriver;
    const items: IFreightItem[] = payload.order.items;
    const steps: ILoadStep[] = payload.order.steps;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const activeUser = ActiveUser.getInstance() as ActiveUser;
      const author = (await new Employee().findOne(runner, activeUser.getId()))
        ?.toAttributes as IEmployee;
      const order: IFreightOrder = {
        id: 0,
        ...payload.order,
        budget: budget,
        saleOrder: saleOrder,
        representation: representation,
        client: client,
        destiny: destiny,
        driver: driver,
        proprietary: proprietary,
        truckType: truckType,
        truck: truck,
        status: status,
        paymentFormFreight: paymentFormFreight,
        paymentFormDriver: paymentFormDriver,
        items: [],
        steps: [],
      };
      const model = new FreightOrder(order);
      await runner.startTransaction();
      const response = await model.save(runner);
      if (!response.success) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response.message);
      }
      order.id = response.insertedId;
      for (const item of items) {
        item.order = order;
        const responseItem = await new FreightItem(item).save(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      for (const step of steps) {
        step.order = order;
        const responseStep = await new LoadStep(step).save(runner);
        if (!responseStep.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseStep.message);
        }
      }
      let pendent = 0.0;
      if (order.driverEntry > 0) pendent = order.driverValue - order.driverEntry;
      const proprietaryBill = new BillPay({
        id: 0,
        date: new Date().toISOString().substring(0, 10),
        bill:
          (await runner.manager.findAndCount(BillPayEntity))[1] > 0
            ? ((await new BillPay().find(runner)).pop() as BillPay).bill + 1
            : 1,
        type: 1,
        description: `Pagamento ao motorista ${driver.person.individual?.name}`,
        enterprise: driver.person.individual?.name as string,
        amount: order.driverValue,
        installment: 1,
        comission: false,
        situation: order.driverEntry > 0 ? 2 : 1,
        amountPaid: order.driverEntry,
        paymentDate:
          order.driverEntry > 0 ? new Date().toISOString().substring(0, 10) : undefined,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
          .toISOString()
          .substring(0, 10),
        category: ((await new BillPayCategory().findOne(runner, 249)) as BillPayCategory)
          .toAttributes,
        driver: driver,
        freightOrder: order,
        paymentForm: paymentFormDriver,
        author: author,
      });
      const responseProprietaryBill = await proprietaryBill.save(runner);
      if (!responseProprietaryBill.success) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseProprietaryBill.message);
      }
      proprietaryBill.id = responseProprietaryBill.insertedId;
      if (pendent > 0) {
        const proprietaryBillPendency = new BillPay({
          id: 0,
          date: new Date().toISOString().substring(0, 10),
          bill:
            (await runner.manager.findAndCount(BillPayEntity))[1] > 0
              ? ((await new BillPay().find(runner)).pop() as BillPay).bill + 1
              : 1,
          type: 1,
          description: `Pagamento ao motorista ${driver.person.individual?.name} (Pendência)`,
          enterprise: driver.person.individual?.name as string,
          amount: order.driverValue,
          installment: 1,
          comission: false,
          situation: 1,
          amountPaid: pendent,
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
            .toISOString()
            .substring(0, 10),
          category: (
            (await new BillPayCategory().findOne(runner, 249)) as BillPayCategory
          ).toAttributes,
          driver: driver,
          freightOrder: order,
          author: author,
        });
        const responseProprietaryBillPendency = await proprietaryBillPendency.save(
          runner,
        );
        if (!responseProprietaryBillPendency.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseProprietaryBillPendency.message);
        }
        proprietaryBillPendency.id = responseProprietaryBillPendency.insertedId;
        proprietaryBill.pendency = proprietaryBillPendency;
        const responseProprietaryBillPendency1 = await proprietaryBill.update(runner);
        if (responseProprietaryBillPendency1.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseProprietaryBillPendency1);
        }
      }
      const responseBill = await new ReceiveBill({
        id: 0,
        date: new Date(Date.now()).toISOString().substring(0, 10),
        bill:
          (await runner.manager.findAndCount(ReceiveBillEntity))[1] > 0
            ? ((await new ReceiveBill().find(runner)).pop() as ReceiveBill).bill + 1
            : 1,
        description: `Recebimento pedido: ${response.insertedId}`,
        payer:
          client.person.type == 1
            ? (client.person.individual?.name as string)
            : (client.person.enterprise?.fantasyName as string),
        amount: order.value,
        comission: false,
        situation: 3,
        amountReceived: order.value,
        receiveDate: new Date(Date.now()).toISOString().substring(0, 10),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substring(0, 10),
        paymentForm: paymentFormFreight,
        freightOrder: order,
        author: author,
      }).save(runner);
      if (responseBill.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseBill);
      }
      const event = new Event({
        id: 0,
        description: `Abertura do pedido de frete ${order.id}: ${order.description}`,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        freightOrder: order,
        author: author,
      });
      const responsEvent = await event.save(runner);
      if (responsEvent.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responsEvent);
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json(response.message);
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
      const order = await new FreightOrder().findOne(runner, { id });
      if (!order) {
        await runner.release();
        return res.status(400).json('pedido não encontrado.');
      }
      await runner.startTransaction();
      for (const step of order.steps) {
        const responseStep = await new LoadStep(step).delete(runner);
        if (!responseStep.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseStep.message);
        }
      }
      for (const item of order.items) {
        const responseItem = await new FreightItem(item).delete(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      const proprietaryBill = await new BillPay().findOne(runner, {
        freightOrder: order.toAttributes,
      });
      if (proprietaryBill) {
        const responseProprietaryBill = await proprietaryBill.delete(runner);
        if (responseProprietaryBill.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseProprietaryBill);
        }
      }
      const orderBill = await new ReceiveBill().findOne(runner, {
        freightOrder: order.toAttributes,
      });
      if (orderBill) {
        const responseOrderBill = await orderBill.delete(runner);
        if (responseOrderBill.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseOrderBill);
        }
      }
      const response = await order.delete(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      const activeUser = ActiveUser.getInstance() as ActiveUser;
      const author = (await new Employee().findOne(runner, activeUser.getId()))
        ?.toAttributes as IEmployee;
      const event = new Event({
        id: 0,
        description: `O pedido de frete ${order.id} foi deletado.`,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        author: author,
      });
      const responseEvent = await event.save(runner);
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
