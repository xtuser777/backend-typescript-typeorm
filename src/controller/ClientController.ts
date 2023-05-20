import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ClientModel } from '../model/ClientModel';
import { CityModel } from '../model/CityModel';
import { Address } from '../entity/Address';
import { Contact } from '../entity/Contact';
import { IndividualPerson } from '../entity/IndividualPerson';
import { Person } from '../entity/Person';
import { Client } from '../entity/Client';
import { EnterprisePerson } from '../entity/EnterprisePerson';

export class ClientController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const clients = await new ClientModel().find(runner);
    const response = [];
    for (const client of clients) response.push(client.toAttributes);
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
    const client = await new ClientModel().findOne(runner, id);
    await runner.release();

    return res.json(client?.toAttributes);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
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
    const client: Client = { id: 0, ...req.body.client, person };

    const model = new ClientModel(client);

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
    const client = (await new ClientModel().findOne(runner, id)) as ClientModel;
    let attributes = client?.toAttributes as Client;
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
    attributes = {
      ...req.body.client,
      person,
    };

    await runner.startTransaction();
    const response = await client.update(runner);
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
    const client = await new ClientModel().findOne(runner, id);
    if (!client) {
      await runner.release();
      return res.status(400).json('funcionario nao encontrado.');
    }
    await runner.startTransaction();
    const response = await client.delete(runner);
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
