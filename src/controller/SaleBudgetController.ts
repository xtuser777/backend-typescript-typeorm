import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { SaleBudget } from '../model/SaleBudget';
import { ISaleBudget } from '../entity/SaleBudget';
import { IEmployee } from '../entity/Employee';
import { Employee } from '../model/Employee';
import { Client } from '../model/Client';
import { City } from '../model/City';
import { ActiveUser } from '../util/active-user';
import { ISaleItem, SaleItem } from '../entity/SaleItem';
import { ICity } from '../entity/City';
import { IClient } from '../entity/Client';

export class SaleBudgetController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budgets = await new SaleBudget().find(runner);
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
      const budget = await new SaleBudget().findOne(runner, id);

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
    const items: ISaleItem[] = payload.budget.items;
    const destiny = await new City().findOne(payload.budget.destiny);
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const salesman = await new Employee().findOne(runner, payload.budget.salesman);
      const client = await new Client().findOne(runner, payload.budget.client);
      const author = await new Employee().findOne(runner, activeUser.getId());
      const budget: ISaleBudget = {
        id: 0,
        ...payload.budget,
        salesman: salesman?.toAttributes,
        client: client?.toAttributes,
        destiny: destiny?.toAttributes,
        author: author?.toAttributes,
        items,
      };
      const model = new SaleBudget(budget);
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
    const items: ISaleItem[] = payload.budget.items;
    const destiny: ICity = payload.budget.destiny;
    const salesman: IEmployee | undefined = payload.budget.salesman;
    const client: IClient | undefined = payload.budget.client;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budget = await new SaleBudget().findOne(runner, id);
      if (!budget) {
        await runner.release();
        return res.status(400).json('orçamento não encontrado.');
      }
      budget.description = payload.budget.description;
      budget.clientName = payload.budget.clientName;
      budget.clientDocument = payload.budget.clientDocument;
      budget.clientPhone = payload.budget.clientPhone;
      budget.clientCellphone = payload.budget.clientCellphone;
      budget.clientEmail = payload.budget.clientEmail;
      budget.weight = payload.budget.weight;
      budget.value = payload.budget.value;
      budget.validate = payload.budget.validate;
      budget.salesman = salesman;
      budget.client = client;
      budget.destiny = destiny;
      await runner.startTransaction();
      for (const item of budget.items) {
        await runner.manager.query('delete from sale_item where id = ?', [item.id]);
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
      const budget = await new SaleBudget().findOne(runner, id);
      if (!budget) {
        await runner.release();
        return res.status(400).json('orçamento não encontrado.');
      }
      await runner.startTransaction();
      for (const item of budget.items) {
        await runner.manager.query('delete from sale_item where id = ?', [item.id]);
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
