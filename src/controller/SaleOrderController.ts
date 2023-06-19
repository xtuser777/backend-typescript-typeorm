import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { SaleOrder } from '../model/SaleOrder';

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
      const order = await new SaleOrder().findOne(runner, id);
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
    const salesman = payload.order.salesman;
    const budget = payload.order.budget;
    const client = payload.order.client;
    const destiny = payload.order.destiny;
    const truckType = payload.order.truckType;
    const paymentForm = payload.order.paymentForm;
    const author = payload.order.author;
    const items = payload.orde.items;
    const order = {
      id: 0,
      ...payload.order,
      budget,
      salesman,
      client,
      destiny,
      truckType,
      paymentForm,
      author,
      items,
    };
    const model = new SaleOrder(order);
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      await runner.startTransaction();
      const response = await model.save(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json();
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
      const order = await new SaleOrder().findOne(runner, id);
      if (!order) {
        await runner.release();
        return res.status(400).json('pedido não encontrado.');
      }
      await runner.startTransaction();
      for (const item of order.items) {
        await runner.manager.query('delete from sale_item where id = ?', [item.id]);
      }
      await runner.commitTransaction();
      await runner.startTransaction();
      const response = await order.delete(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
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
