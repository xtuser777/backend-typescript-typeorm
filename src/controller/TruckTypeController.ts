import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TruckTypeModel } from '../model/TruckTypeModel';

export class TruckTypeController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const types = await new TruckTypeModel().find(runner);
    if (!runner.isReleased) await runner.release();
    const response = [];
    for (const type of types) response.push(type.toAttributes);

    return res.json(response);
  }

  async show(req: Request, res: Response) {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    } catch {
      return res.status(400).json('parametro invalido.');
    }
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const type = await new TruckTypeModel().findOne(runner, id);
    if (!runner.isReleased) await runner.release();

    return res.json(type ? type.toAttributes : undefined);
  }
}
