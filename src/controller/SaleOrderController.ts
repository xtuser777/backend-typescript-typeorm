import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { SaleOrder } from '../model/SaleOrder';
import { BillPay } from '../model/BillPay';
import { BillPay as BillPayEntity } from '../entity/BillPay';
import { BillPayCategory } from '../model/BillPayCategory';
import { ReceiveBill } from '../model/ReceiveBill';
import { ReceiveBill as ReceiveBillEntity } from '../entity/ReceiveBill';
import { ISaleOrder } from '../entity/SaleOrder';
import { Event } from '../model/Event';
import { FreightOrder } from '../model/FreightOrder';
import { ActiveUser } from '../util/active-user';
import { Employee } from '../model/Employee';
import { IEmployee } from '../entity/Employee';
import { ISaleBudget } from '../entity/SaleBudget';
import { IClient } from '../entity/Client';
import { ICity } from '../entity/City';
import { IPaymentForm } from '../entity/PaymentForm';
import { ISaleItem } from '../entity/SaleItem';
import { SaleItem } from '../model/SaleItem';
import { IIndividualPerson } from '../entity/IndividualPerson';
import { IEnterprisePerson } from '../entity/EnterprisePerson';

export class SaleOrderController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const orders = await new SaleOrder().find(runner);
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
      const order = await new SaleOrder().findOne(runner, { id });
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
    const salesman: IEmployee | undefined = payload.order.salesman;
    const budget: ISaleBudget | undefined = payload.order.budget;
    const client: IClient = payload.order.client;
    const destiny: ICity = payload.order.destiny;
    //const truckType = payload.order.truckType;
    const paymentForm: IPaymentForm = payload.order.paymentForm;
    const items: ISaleItem[] = payload.order.items;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const activeUser = ActiveUser.getInstance() as ActiveUser;
      const author = (await new Employee().findOne(runner, activeUser.getId()))
        ?.toAttributes as IEmployee;
      const order: ISaleOrder = {
        id: 0,
        ...payload.order,
        budget,
        salesman,
        client,
        destiny,
        //truckType,
        paymentForm,
        author,
        items: [],
      };
      const model = new SaleOrder(order);
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
        const responseItem = await new SaleItem(item).save(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      if (salesman != undefined) {
        const salesmanComission =
          (order.value / 100) * payload.order.salesmanComissionPorcent;
        const billSalesmanComission = new BillPay({
          id: 0,
          date: new Date(Date.now()).toISOString().substring(0, 10),
          bill:
            (await runner.manager.findAndCount(BillPayEntity))[1] > 0
              ? ((await new BillPay().find(runner)).pop() as BillPay).bill + 1
              : 1,
          type: 2,
          installment: 1,
          enterprise: (salesman.person.individual as IIndividualPerson).name,
          description:
            'Comissão vendedor: ' +
            (salesman.person.individual as IIndividualPerson).name +
            '. Pedido: ' +
            response.insertedId,
          amount: salesmanComission,
          situation: 1,
          comission: true,
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
            .toISOString()
            .substring(0, 10),
          amountPaid: 0.0,
          category: (
            (await new BillPayCategory().findOne(runner, 250)) as BillPayCategory
          ).toAttributes,
          saleOrder: order,
          author: author,
        });
        const responseSalesmanComission = await billSalesmanComission.save(runner);
        if (!responseSalesmanComission.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseSalesmanComission.message);
        }
      }
      for (const comission of payload.order.comissions) {
        const value = (comission.porcentagem * comission.valor) / 100;

        const responseComission = await new ReceiveBill({
          id: 0,
          date: new Date(Date.now()).toISOString().substring(0, 10),
          bill:
            (await runner.manager.findAndCount(ReceiveBillEntity))[1] > 0
              ? ((await new ReceiveBill().find(runner)).pop() as ReceiveBill).bill + 1
              : 1,
          description: `Recebimento comissão pedido: ${response.insertedId}`,
          payer: comission.representacao.nomeFantasia,
          amount: value,
          comission: true,
          situation: 1,
          amountReceived: 0.0,
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
            .toISOString()
            .substring(0, 10),
          representation: comission.representacao,
          saleOrder: order,
          author: author,
        }).save(runner);

        if (responseComission.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseComission);
        }
      }
      const bill = new ReceiveBill({
        id: 0,
        date: new Date(Date.now()).toISOString().substring(0, 10),
        bill:
          (await runner.manager.findAndCount(ReceiveBillEntity))[1] > 0
            ? ((await new ReceiveBill().find(runner)).pop() as ReceiveBill).bill + 1
            : 1,
        description: `Recebimento pedido: ${response.insertedId}`,
        payer:
          client.person.type == 1
            ? (client.person.individual as IIndividualPerson).name
            : (client.person.enterprise as IEnterprisePerson).fantasyName,
        amount: order.value,
        comission: false,
        situation: 3,
        amountReceived: order.value,
        receiveDate: new Date(Date.now()).toISOString().substring(0, 10),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .substring(0, 10),
        paymentForm: paymentForm,
        saleOrder: order,
        author: author,
      });
      const responseBill = await bill.save(runner);
      if (responseBill.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseBill);
      }
      const event = new Event({
        id: 0,
        description: `Abertura do pedido de venda ${order.id}: ${order.description}`,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        saleOrder: order,
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
      const order = await new SaleOrder().findOne(runner, { id });
      if (!order) {
        await runner.release();
        return res.status(400).json('pedido não encontrado.');
      }
      const freightOrder = await new FreightOrder().findOne(runner, {
        saleOrder: order.toAttributes,
      });
      if (freightOrder) {
        return res
          .status(400)
          .json(`Este pedido está vinculado ao pedido de frete "${freightOrder.id}"`);
      }
      await runner.startTransaction();
      const orderReceive = await new ReceiveBill().findOne(runner, {
        saleOrder: order.toAttributes,
      });
      if (orderReceive) {
        if (orderReceive.amountReceived > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res
            .status(400)
            .json('O pedido já foi pago pelo cliente, estorne o pagamento primeiro.');
        }
        if (orderReceive.pendency) {
          const orderReceivePendency = new ReceiveBill(orderReceive.pendency);
          const responseOrderReceivePendency = await orderReceivePendency.delete(runner);
          if (responseOrderReceivePendency.length > 0) {
            await runner.rollbackTransaction();
            await runner.release();
            return res.status(400).json(responseOrderReceivePendency);
          }
        }
        const responseOrderReceive = await orderReceive.delete(runner);
        if (responseOrderReceive.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseOrderReceive);
        }
      }
      if (order.salesman) {
        const salesmanComission = await new BillPay().findOne(runner, {
          saleOrder: order.toAttributes,
        });
        if (salesmanComission) {
          const responseSalesmanComission = await salesmanComission.delete(runner);
          if (responseSalesmanComission.length > 0) {
            await runner.rollbackTransaction();
            await runner.release();
            return res.status(400).json(responseSalesmanComission);
          }
        }
      }
      const comissions = await new ReceiveBill().find(runner, {
        saleOrder: order.toAttributes,
      });
      for (const comission of comissions) {
        if (comission.situation > 1) {
          await runner.rollbackTransaction();
          await runner.release();
          return res
            .status(400)
            .json('O pedido tem comissões recebidas, estorne o recebimento primeiro.');
        }
        const responseComission = await comission.delete(runner);
        if (responseComission.length > 0) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseComission);
        }
      }
      for (const item of order.items) {
        const responseItem = await new SaleItem(item).delete(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
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
        description: `O pedido de venda ${order.id} foi deletado.`,
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
