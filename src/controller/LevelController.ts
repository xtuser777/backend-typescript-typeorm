import { Request, Response } from 'express';
import { Level } from '../model/Level';
import { AppDataSource } from '../data-source';

export class LevelController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const levels = await new Level().find(runner);
    await runner.release();
    const response = [];
    for (const level of levels) response.push(level.toAttributes);

    return res.json(response);
  };

  show = async (req: Request, res: Response) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro incorreto.');
    } catch {
      return res.status(400).json('parametro incorreto.');
    }
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const level = await new Level().findOne(runner, id);
    await runner.release();

    return res.json(level ? level.toAttributes : undefined);
  };
}
