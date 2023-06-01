import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Truck } from '../model/Truck';
import { TruckType } from '../model/TruckType';
import { Proprietary } from '../model/Proprietary';
import { ITruck } from '../entity/Truck';

export class TruckController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const trucks = await new Truck().find(runner);
    const response = [];
    for (const truck of trucks) response.push(truck.toAttributes);
    if (!runner.isReleased) await runner.release();

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
    const truck = await new Truck().findOne(runner, id);
    if (!runner.isReleased) await runner.release();

    return res.json(truck ? truck.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const type = (await new TruckType().findOne(
      runner,
      req.body.truck.type,
    )) as TruckType;
    const proprietary = (await new Proprietary().findOne(
      runner,
      req.body.truck.prop,
    )) as Proprietary;
    const truck: ITruck = {
      id: 0,
      ...req.body.truck,
      type: type.toAttributes,
      proprietary: proprietary.toAttributes,
    };

    const model = new Truck(truck);

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
      if (Number.isNaN(id)) return res.status(400).json('parametro incorreto.');
    } catch {
      return res.status(400).json('parametro incorreto.');
    }
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const type = (await new TruckType().findOne(
      runner,
      req.body.truck.type,
    )) as TruckType;
    const proprietary = (await new Proprietary().findOne(
      runner,
      req.body.truck.prop,
    )) as Proprietary;
    const truck = await new Truck().findOne(runner, id);
    if (!truck) {
      await runner.release();
      return res.status(400).json('caminhao nao cadastrado.');
    }
    truck.plate = req.body.truck.plate;
    truck.brand = req.body.truck.brand;
    truck.model = req.body.truck.model;
    truck.color = req.body.truck.color;
    truck.manufactureYear = req.body.truck.manufactureYear;
    truck.modelYear = req.body.truck.modelYear;
    truck.type = type.toAttributes;
    truck.proprietary = proprietary.toAttributes;

    await runner.startTransaction();
    const response = await truck.update(runner);
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
      if (Number.isNaN(id)) return res.status(400).json('parametro incorreto.');
    } catch {
      return res.status(400).json('parametro incorreto.');
    }
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const truck = await new Truck().findOne(runner, id);
    if (!truck) {
      await runner.release();
      return res.status(400).json('caminhao nao cadastrado.');
    }

    await runner.startTransaction();
    const response = await truck.delete(runner);
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
