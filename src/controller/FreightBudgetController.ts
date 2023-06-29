import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { FreightBudget } from '../model/FreightBudget';
import { TypeORMError } from 'typeorm';
import { ActiveUser } from '../util/active-user';
import { IFreightItem } from '../entity/FreightItem';
import { Employee } from '../model/Employee';
import { IFreightBudget } from '../entity/FreightBudget';
import { FreightOrder } from '../model/FreightOrder';
import { FreightItem } from '../model/FreightItem';

export class FreightBudgetController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budgets = await new FreightBudget().find(runner);
      await runner.release();
      const response = [];
      for (const budget of budgets) response.push(budget.toAttributes);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  show = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budget = await new FreightBudget().findOne(runner, { id });
      await runner.release();
      return res.json(budget ? budget.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  store = async (req: Request, res: Response) => {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const activeUser = ActiveUser.getInstance() as ActiveUser;
    const payload = req.body;
    const items: IFreightItem[] = payload.budget.items;
    const destiny = payload.budget.destiny;
    const sale = payload.budget.saleBudget;
    const representation = payload.budget.representation;
    const client = payload.budget.client;
    const truckType = payload.budget.truckType;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const author = await new Employee().findOne(runner, activeUser.getId());
      const budget: IFreightBudget = {
        id: 0,
        ...payload.budget,
        sale: sale,
        representation: representation,
        client: client,
        truckType: truckType,
        destiny: destiny,
        author: author?.toAttributes,
        items: [],
      };
      const model = new FreightBudget(budget);
      await runner.startTransaction();
      const response = await model.save(runner);
      if (!response.success) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response.message);
      }
      budget.id = response.insertedId;
      for (const item of items) {
        item.budget = budget;
        const responseItem = await new FreightItem(item).save(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response.message);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  update = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const payload = req.body;
    const items: IFreightItem[] = payload.budget.items;
    const destiny = payload.budget.destiny;
    const sale = payload.budget.saleBudget;
    const representation = payload.budget.representation;
    const client = payload.budget.client;
    const truckType = payload.budget.truckType;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budget = await new FreightBudget().findOne(runner, { id });
      if (!budget) {
        await runner.release();
        return res.status(400).json('orçamento não encontrado.');
      }
      budget.description = payload.budget.description;
      budget.distance = payload.budget.distance;
      budget.weight = payload.budget.weight;
      budget.value = payload.budget.value;
      budget.shipping = payload.budget.shipping;
      budget.validate = payload.budget.validate;
      budget.saleBudget = sale;
      budget.representation = representation;
      budget.client = client;
      budget.truckType = truckType;
      budget.destiny = destiny;
      await runner.startTransaction();
      for (const item of budget.items) {
        const responseItem = await new FreightItem(item).delete(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      budget.items = [];
      const response = await budget.update(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      for (const item of items) {
        item.budget = budget.toAttributes;
        const responseItem = await new FreightItem(item).save(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  delete = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budget = await new FreightBudget().findOne(runner, { id });
      if (!budget) {
        await runner.release();
        return res.status(400).json('orçamento não encontrado.');
      }
      const order = await new FreightOrder().findOne(runner, {
        budget: budget.toAttributes,
      });
      if (order) {
        await runner.release();
        return res
          .status(400)
          .json('Este orçamento possui um vínculo com o pedido de frete:' + order.id);
      }
      await runner.startTransaction();
      for (const item of budget.items) {
        const responseItem = await new FreightItem(item).delete(runner);
        if (!responseItem.success) {
          await runner.rollbackTransaction();
          await runner.release();
          return res.status(400).json(responseItem.message);
        }
      }
      const response = await budget.delete(runner);
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
  };
}
