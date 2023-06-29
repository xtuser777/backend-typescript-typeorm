import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { SaleBudget } from '../model/SaleBudget';
import { ISaleBudget } from '../entity/SaleBudget';
import { IEmployee } from '../entity/Employee';
import { Employee } from '../model/Employee';
import { ActiveUser } from '../util/active-user';
import { ISaleItem } from '../entity/SaleItem';
import { ICity } from '../entity/City';
import { IClient } from '../entity/Client';
import { FreightBudget } from '../model/FreightBudget';
import { SaleOrder } from '../model/SaleOrder';
import { SaleItem } from '../model/SaleItem';

export class SaleBudgetController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const budgets = await new SaleBudget().find(runner);
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
      const budget = await new SaleBudget().findOne(runner, id);
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
    const items: ISaleItem[] = payload.budget.items;
    const destiny: ICity = payload.budget.destiny;
    const salesman: IEmployee | undefined = payload.budget.salesman;
    const client: IClient | undefined = payload.budget.client;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const author = await new Employee().findOne(runner, activeUser.getId());
      const budget: ISaleBudget = {
        id: 0,
        ...payload.budget,
        salesman: salesman,
        client: client,
        destiny: destiny,
        author: author?.toAttributes,
        items: [],
      };
      const model = new SaleBudget(budget);
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
        const responseItem = await new SaleItem(item).save(runner);
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
        const responseItem = await new SaleItem(item).delete(runner);
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
        const responseItem = await new SaleItem(item).save(runner);
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
      const budget = await new SaleBudget().findOne(runner, id);
      if (!budget) {
        await runner.release();
        return res.status(400).json('orçamento não encontrado.');
      }
      const freight = await new FreightBudget().findOne(runner, {
        saleBudget: budget.toAttributes,
      });
      if (freight) {
        await runner.release();
        return res
          .status(400)
          .json(
            'Este orçamento possui um vínculo com o orçamento de frete:' + freight.id,
          );
      }
      const order = await new SaleOrder().findOne(runner, {
        budget: budget.toAttributes,
      });
      if (order) {
        await runner.release();
        return res
          .status(400)
          .json('Este orçamento possui um vínculo com o pedido de venda:' + order.id);
      }
      await runner.startTransaction();
      for (const item of budget.items) {
        const responseItem = await new SaleItem(item).delete(runner);
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
