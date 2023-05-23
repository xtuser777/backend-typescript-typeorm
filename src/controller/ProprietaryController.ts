import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ProprietaryModel } from '../model/ProprietaryModel';
import { CityModel } from '../model/CityModel';
import { Address } from '../entity/Address';
import { Contact } from '../entity/Contact';
import { IndividualPerson } from '../entity/IndividualPerson';
import { EnterprisePerson } from '../entity/EnterprisePerson';
import { Person } from '../entity/Person';
import { Proprietary } from '../entity/Proprietary';
import { Driver } from '../entity/Driver';
import { DriverModel } from '../model/DriverModel';

export class ProprietaryController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const proprietaries = await new ProprietaryModel().find(runner);
    const response = [];
    for (const proprietary of proprietaries) response.push(proprietary.toAttributes);
    await runner.release();

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
    const proprietary = await new ProprietaryModel().findOne(runner, id);
    await runner.release();

    return res.json(proprietary ? proprietary.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = ((await new CityModel().findOne(req.body.address.city)) as CityModel)
      .toAttributes;
    const address: Address = { id: 0, ...req.body.address, city };
    const contact: Contact = { id: 0, ...req.body.contact, address };
    const individual: IndividualPerson | undefined =
      req.body.person.type == 1
        ? {
            id: 0,
            ...req.body.person,
            contact,
          }
        : undefined;
    const enterprise: EnterprisePerson | undefined =
      req.body.person.type == 2
        ? {
            id: 0,
            ...req.body.person,
            contact,
          }
        : undefined;
    const person: Person = {
      id: 0,
      type: req.body.person.type,
      individual: req.body.person.type == 1 ? individual : undefined,
      enterprise: req.body.person.type == 2 ? enterprise : undefined,
    };
    const proprietary: Proprietary = { id: 0, ...req.body.prop, person };

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();

    const driver = req.body.prop.driver
      ? await new DriverModel().findOne(runner, req.body.prop.driver)
      : undefined;

    proprietary.driver = driver;

    const model = new ProprietaryModel(proprietary);

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
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    } catch {
      return res.status(400).json('parametro invalido.');
    }
    const city = (await new CityModel().findOne(req.body.address.city))?.toAttributes;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const proprietary = (await new ProprietaryModel().findOne(
      runner,
      id,
    )) as ProprietaryModel;
    let attributes = proprietary?.toAttributes as Proprietary;
    let address =
      attributes.person.type == 1
        ? (attributes.person.individual as IndividualPerson).contact.address
        : (attributes.person.enterprise as EnterprisePerson).contact.address;
    let contact =
      attributes.person.type == 1
        ? (attributes.person.individual as IndividualPerson).contact
        : (attributes.person.enterprise as EnterprisePerson).contact;
    let individual = attributes.person.individual;
    let enterprise = attributes.person.enterprise;
    const person = attributes.person;
    address = { id: address.id, ...req.body.address, city };
    contact = { id: contact.id, ...req.body.contact, address };
    individual = individual
      ? { id: individual.id, ...req.body.person, contact }
      : undefined;
    enterprise = enterprise
      ? { id: enterprise.id, ...req.body.person, contact }
      : undefined;
    person.individual = individual;
    person.enterprise = enterprise;
    const driver = req.body.prop.driver
      ? await new DriverModel().findOne(runner, req.body.prop.driver)
      : undefined;
    attributes = {
      ...req.body.proprietary,
      driver,
      person,
    };

    await runner.startTransaction();
    const response = await proprietary.update(runner);
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
    const proprietary = await new ProprietaryModel().findOne(runner, id);
    if (!proprietary) {
      await runner.release();
      return res.status(400).json('proprietario nao encontrado.');
    }
    await runner.startTransaction();
    const response = await proprietary.delete(runner);
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
