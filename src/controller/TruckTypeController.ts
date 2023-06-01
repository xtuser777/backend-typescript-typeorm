import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TruckType } from '../model/TruckType';
import { ITruckType } from '../entity/TruckType';

export class TruckTypeController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const types = await new TruckType().find(runner);
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
    const type = await new TruckType().findOne(runner, id);
    if (!runner.isReleased) await runner.release();

    return res.json(type ? type.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const type: ITruckType = { id: 0, ...req.body.type };

    const model = new TruckType(type);

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    const response = await model.save(runner);
    if (response.length > 0) {
      if (runner.isTransactionActive) await runner.rollbackTransaction();
      if (!runner.isReleased) await runner.release();
      return res.status(400).json(response);
    }
    await runner.commitTransaction();
    await runner.release();

    return res.json(response);
  }

  async update(req: Request, res: Response) {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    } catch {
      return res.status(400).json('parametro invalido.');
    }
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const type = await new TruckType().findOne(runner, id);
    if (!type) {
      await runner.release();
      return res.status(400).json('tipo de caminhao nao cadastrado.');
    }
    type.description = req.body.type.description;
    type.axes = req.body.type.axes;
    type.capacity = req.body.type.capacity;

    await runner.startTransaction();
    const response = await type.update(runner);
    if (response.length > 0) {
      if (runner.isTransactionActive) await runner.rollbackTransaction();
      if (!runner.isReleased) await runner.release();
      return res.status(400).json(response);
    }
    await runner.commitTransaction();
    await runner.release();

    return res.json(response);
  }

  async delete(req: Request, res: Response) {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    } catch {
      return res.status(400).json('parametro invalido.');
    }
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const type = await new TruckType().findOne(runner, id);
    if (!type) {
      await runner.release();
      return res.status(400).json('tipo de caminhao nao cadastrado.');
    }
    await runner.startTransaction();
    const response = await type.delete(runner);
    if (response.length > 0) {
      if (runner.isTransactionActive) await runner.rollbackTransaction();
      if (!runner.isReleased) await runner.release();
      return res.status(400).json(response);
    }
    await runner.commitTransaction();
    await runner.release();

    return res.json(response);
  }
}
