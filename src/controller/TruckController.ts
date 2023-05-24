import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TruckModel } from '../model/TruckModel';
import { DriverModel } from '../model/DriverModel';
import { TruckTypeModel } from '../model/TruckTypeModel';
import { ProprietaryModel } from '../model/ProprietaryModel';
import { Truck } from '../entity/Truck';

export class TruckController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const trucks = await new TruckModel().find(runner);
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
    const truck = await new TruckModel().findOne(runner, id);
    if (!runner.isReleased) await runner.release();

    return res.json(truck ? truck.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const type = (await new TruckTypeModel().findOne(
      runner,
      req.body.truck.type,
    )) as TruckTypeModel;
    const proprietary = (await new ProprietaryModel().findOne(
      runner,
      req.body.truck.prop,
    )) as ProprietaryModel;
    const truck: Truck = {
      id: 0,
      ...req.body.truck,
      type: type.toAttributes,
      proprietary: proprietary.toAttributes,
    };

    const model = new TruckModel(truck);

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
    const type = (await new TruckTypeModel().findOne(
      runner,
      req.body.truck.type,
    )) as TruckTypeModel;
    const proprietary = (await new ProprietaryModel().findOne(
      runner,
      req.body.truck.prop,
    )) as ProprietaryModel;
    const truck = await new TruckModel().findOne(runner, id);
    if (!truck) {
      await runner.release();
      return res.status(400).json('caminhao nao cadastrado.');
    }
    truck.toAttributes.plate = req.body.truck.plate;
    truck.toAttributes.brand = req.body.truck.brand;
    truck.toAttributes.model = req.body.truck.model;
    truck.toAttributes.color = req.body.truck.color;
    truck.toAttributes.manufactureYear = req.body.truck.manufactureYear;
    truck.toAttributes.modelYear = req.body.truck.modelYear;
    truck.toAttributes.type = type.toAttributes;
    truck.toAttributes.proprietary = proprietary.toAttributes;

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
    const truck = await new TruckModel().findOne(runner, id);
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
