import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { Event } from '../model/Event';

export class EventController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const events = await new Event().find(runner);
      await runner.release();
      const response = [];
      for (const event of events) response.push(event.toAttributes);
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
      const event = await new Event().findOne(runner, id);
      await runner.release();
      return res.json(event ? event.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }
}
