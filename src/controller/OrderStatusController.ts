import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { OrderStatus } from '../model/OrderStatus';
import { IStatus } from '../entity/Status';
import { ActiveUser } from '../util/active-user';
import { Employee } from '../model/Employee';
import { IEmployee } from '../entity/Employee';
import { FreightOrder } from '../model/FreightOrder';
import { Event } from '../model/Event';

export class OrderStatusController {
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    const payload = req.body;
    const status: IStatus = payload.status.status;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const activeUser = ActiveUser.getInstance() as ActiveUser;
      const author = (await new Employee().findOne(runner, activeUser.getId()))
        ?.toAttributes as IEmployee;
      const order = await new FreightOrder().findOne(runner, { id });
      if (!order) {
        await runner.release();
        return res.status(400).json('status não encontrado.');
      }
      const orderStatus = new OrderStatus(order.status);
      orderStatus.date = payload.status.date;
      orderStatus.time = payload.status.time;
      orderStatus.status = status;
      orderStatus.observation = payload.status.observation;
      orderStatus.author = author;
      await runner.startTransaction();
      const responseOrderStatus = await orderStatus.update(runner);
      if (responseOrderStatus.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseOrderStatus);
      }
      const responseEvent = await new Event({
        id: 0,
        description: `Alteração do status do pedido ${order.id} para ${status.description}`,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        freightOrder: order,
        author: author,
      }).save(runner);
      if (responseEvent.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(responseEvent);
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json(responseOrderStatus);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }
}
