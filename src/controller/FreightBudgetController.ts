import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { FreightBudget } from '../model/FreightBudget';
import { TypeORMError } from 'typeorm';
import { ActiveUser } from '../util/active-user';
import { IFreightItem } from '../entity/FreightItem';
import { City } from '../model/City';
import { Client } from '../model/Client';
import { Employee } from '../model/Employee';
import { IFreightBudget } from '../entity/FreightBudget';
import { SaleBudget } from '../model/SaleBudget';
import { Representation } from '../model/Representation';
import { TruckType } from '../model/TruckType';

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
      const budget = await new FreightBudget().findOne(runner, id);
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
        items,
      };
      const model = new FreightBudget(budget);
      await runner.startTransaction();
      const response = await model.save(runner);
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
      const budget = await new FreightBudget().findOne(runner, id);
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
        await runner.manager.query('delete from freight_item where id = ?', [item.id]);
      }
      await runner.commitTransaction();
      budget.items = items;
      await runner.startTransaction();
      const response = await budget.update(runner);
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

  delete = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budget = await new FreightBudget().findOne(runner, id);
      if (!budget) {
        await runner.release();
        return res.status(400).json('orçamento não encontrado.');
      }
      await runner.startTransaction();
      for (const item of budget.items) {
        await runner.manager.query('delete from freight_item where id = ?', [item.id]);
      }
      await runner.commitTransaction();
      await runner.startTransaction();
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
