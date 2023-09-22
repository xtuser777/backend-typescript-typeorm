import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Client } from '../model/Client';
import { City } from '../model/City';
import { IIndividualPerson } from '../entity/IndividualPerson';
import { IClient } from '../entity/Client';
import { IEnterprisePerson } from '../entity/EnterprisePerson';

export class ClientController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const clients = await new Client().find(runner);
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
    const client = await new Client().findOne(runner, id);
    await runner.release();

    return res.json(client?.toAttributes);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');

    const payload = req.body;

    const client: IClient = { id: 0, ...payload.client };
    const model = new Client(client);
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
    const city = ((await new City().findOne(req.body.address.city)) as City).toAttributes;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const client = (await new Client().findOne(runner, id)) as Client;
    client.person.contact.phone = req.body.contact.phone;
    client.person.contact.cellphone = req.body.contact.cellphone;
    client.person.contact.email = req.body.contact.email;
    client.person.contact.address.street = req.body.address.street;
    client.person.contact.address.number = req.body.address.number;
    client.person.contact.address.neighborhood = req.body.address.neighborhood;
    client.person.contact.address.complement = req.body.address.complement;
    client.person.contact.address.code = req.body.address.code;
    client.person.contact.address.city = city;
    if (client.person.type == 1) {
      (client.person.individual as IIndividualPerson).name = req.body.person.name;
      (client.person.individual as IIndividualPerson).cpf = req.body.person.cpf;
      (client.person.individual as IIndividualPerson).birth = req.body.person.birth;
    } else {
      (client.person.enterprise as IEnterprisePerson).corporateName =
        req.body.person.corporateName;
      (client.person.enterprise as IEnterprisePerson).fantasyName =
        req.body.person.fantasyName;
      (client.person.enterprise as IEnterprisePerson).cnpj = req.body.person.cnpj;
    }
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
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const client = await new Client().findOne(runner, id);
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
