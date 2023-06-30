import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { Status } from '../model/Status';

export class StatusController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const statuses = await new Status().find(runner);
      const response = [];
      for (const status of statuses) response.push(status.toAttributes);
      await runner.release();
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
      const status = await new Status().findOne(runner, id);
      await runner.release();
      return res.json(status ? status.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }
}
