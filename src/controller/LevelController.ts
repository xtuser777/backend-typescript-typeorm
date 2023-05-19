import { Request, Response } from 'express';
import { LevelModel } from '../model/LevelModel';
import { AppDataSource } from '../data-source';

export class LevelController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const levels = await new LevelModel().find(runner);
    await runner.release();
    const response = [];
    for (const level of levels) response.push(level.toAttributes);

    return res.json(response);
  }

  async show(req: Request, res: Response) {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro incorreto.');
    } catch {
      return res.status(400).json('parametro incorreto.');
    }
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const level = await new LevelModel().findOne(runner, id);
    await runner.release();

    return res.json(level?.toAttributes);
  }
}
