import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Parameterization } from '../model/Parameterization';
import { City } from '../model/City';
import { IAddress } from '../entity/Address';
import { IContact } from '../entity/Contact';
import { IEnterprisePerson } from '../entity/EnterprisePerson';
import { IPerson } from '../entity/Person';
import { IParameterization } from '../entity/Parameterization';

export class ParameterizationController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const parameterization = await new Parameterization().findOne(runner);
    await runner.release();

    return res.json(parameterization ? parameterization.toAttributes : undefined);
  };

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');

    const payload = req.body;

    const parameterization: IParameterization = {
      ...payload.parameterization,
    };

    const model = new Parameterization(parameterization);

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
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');
    const payload = req.body;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const parameterization = (await new Parameterization().findOne(
      runner,
    )) as Parameterization;
    if (!parameterization) {
      return res.status(400).json('Parametrização não cadastrada.');
    }
    let attributes = parameterization.toAttributes;

    attributes = { ...payload.parameterization };

    const model = new Parameterization(attributes);

    await runner.startTransaction();
    const response = await model.update(runner);
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
