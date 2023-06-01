import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Representation } from '../model/Representation';
import { City } from '../model/City';
import { IAddress } from '../entity/Address';
import { IContact } from '../entity/Contact';
import { IEnterprisePerson } from '../entity/EnterprisePerson';
import { IPerson } from '../entity/Person';
import { IRepresentation } from '../entity/Representation';

export class RepresentationController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const representations = await new Representation().find(runner);
    await runner.release();
    const response = [];
    for (const representation of representations)
      response.push(representation.toAttributes);

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
    const representation = await new Representation().findOne(runner, id);
    await runner.release();

    return res.json(representation ? representation.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = ((await new City().findOne(req.body.address.city)) as City).toAttributes;
    const address: IAddress = { id: 0, ...req.body.address, city };
    const contact: IContact = { id: 0, ...req.body.contact, address };
    const enterprise: IEnterprisePerson | undefined =
      req.body.person.type == 2
        ? {
            id: 0,
            ...req.body.person,
          }
        : undefined;
    const person: IPerson = {
      id: 0,
      type: req.body.person.type,
      individual: undefined,
      enterprise,
      contact,
    };
    const representation: Representation = { id: 0, ...req.body.representation, person };

    const model = new Representation(representation);

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
    const payload = req.body;
    const city = ((await new City().findOne(req.body.address.city)) as City).toAttributes;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const representation = await new Representation().findOne(runner, id);
    if (!representation) {
      await runner.release();
      return res.status(400).json('representação não cadastrada.');
    }
    representation.unity = payload.representation.unity;
    representation.person.contact.phone = payload.contact.phone;
    representation.person.contact.cellphone = payload.contact.cellphone;
    representation.person.contact.email = payload.contact.email;

    representation.person.contact.address.street = payload.address.street;
    representation.person.contact.address.number = payload.address.number;
    representation.person.contact.address.neighborhood = payload.address.neighborhood;
    representation.person.contact.address.complement = payload.address.complement;
    representation.person.contact.address.code = payload.address.code;
    representation.person.contact.address.city = city;

    await runner.startTransaction();
    const response = await representation.update(runner);
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
    const representation = await new Representation().findOne(runner, id);
    if (!representation) {
      await runner.release();
      return res.status(400).json('representacão não encontrada.');
    }
    await runner.startTransaction();
    const response = await representation.delete(runner);
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
