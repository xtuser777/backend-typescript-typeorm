import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { BillPayCategory } from '../model/BillPayCategory';
import { IBillPayCategory } from '../entity/BillPayCategory';

export class BillPayCategoryController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const categories = await new BillPayCategory().find(runner);
      await runner.release();
      const response = [];
      for (const category of categories) response.push(category.toAttributes);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  show = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const category = await new BillPayCategory().findOne(runner, id);
      await runner.release();
      return res.json(category ? category.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  store = async (req: Request, res: Response) => {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('reqisição sem corpo.');
    const payload = req.body;
    const category: IBillPayCategory = { id: 0, ...payload.category };
    const model = new BillPayCategory(category);
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

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  update = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('reqisição sem corpo.');
    const payload = req.body;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const category = await new BillPayCategory().findOne(runner, id);
      if (!category) {
        await runner.release();
        return res.status(400).json('categoria não encontrada.');
      }
      category.description = payload.category.description;
      await runner.startTransaction();
      const response = await category.update(runner);
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
      const category = await new BillPayCategory().findOne(runner, id);
      if (!category) {
        await runner.release();
        return res.status(400).json('categoria não encontrada.');
      }
      await runner.startTransaction();
      const response = await category.delete(runner);
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
