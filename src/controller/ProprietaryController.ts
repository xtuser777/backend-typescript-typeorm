import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Proprietary } from '../model/Proprietary';
import { City } from '../model/City';
import { IAddress } from '../entity/Address';
import { IContact } from '../entity/Contact';
import { IIndividualPerson } from '../entity/IndividualPerson';
import { IEnterprisePerson } from '../entity/EnterprisePerson';
import { IPerson } from '../entity/Person';
import { Driver } from '../model/Driver';

export class ProprietaryController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const proprietaries = await new Proprietary().find(runner);
    const response = [];
    for (const proprietary of proprietaries) response.push(proprietary.toAttributes);
    await runner.release();

    return res.json(response);
  }

  async show(req: Request, res: Response) {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const proprietary = await new Proprietary().findOne(runner, id);
    await runner.release();

    return res.json(proprietary ? proprietary.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = ((await new City().findOne(req.body.address.city)) as City).toAttributes;
    const address: IAddress = { id: 0, ...req.body.address, city };
    const contact: IContact = { id: 0, ...req.body.contact, address };
    const individual: IIndividualPerson | undefined =
      req.body.person.type == 1
        ? {
            id: 0,
            ...req.body.person,
          }
        : undefined;
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
      individual: req.body.person.type == 1 ? individual : undefined,
      enterprise: req.body.person.type == 2 ? enterprise : undefined,
      contact,
    };
    const proprietary: Proprietary = { id: 0, ...req.body.prop, person };

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();

    const driver = req.body.prop.driver
      ? await new Driver().findOne(runner, req.body.prop.driver)
      : undefined;

    proprietary.driver = driver;

    const model = new Proprietary(proprietary);

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
    const proprietary = (await new Proprietary().findOne(runner, id)) as Proprietary;
    const driver = req.body.prop.driver
      ? await new Driver().findOne(runner, req.body.prop.driver)
      : undefined;
    proprietary.person.contact.phone = req.body.contact.phone;
    proprietary.person.contact.cellphone = req.body.contact.cellphone;
    proprietary.person.contact.email = req.body.contact.email;
    proprietary.person.contact.address.street = req.body.address.street;
    proprietary.person.contact.address.number = req.body.address.number;
    proprietary.person.contact.address.neighborhood = req.body.address.neighborhood;
    proprietary.person.contact.address.complement = req.body.address.complement;
    proprietary.person.contact.address.code = req.body.address.code;
    proprietary.person.contact.address.city = city;
    if (proprietary.person.type == 1) {
      (proprietary.person.individual as IIndividualPerson).name = req.body.person.name;
      (proprietary.person.individual as IIndividualPerson).cpf = req.body.person.cpf;
      (proprietary.person.individual as IIndividualPerson).birth = req.body.person.birth;
    } else {
      (proprietary.person.enterprise as IEnterprisePerson).corporateName =
        req.body.person.corporateName;
      (proprietary.person.enterprise as IEnterprisePerson).fantasyName =
        req.body.person.fantasyName;
      (proprietary.person.enterprise as IEnterprisePerson).cnpj = req.body.person.cnpj;
    }
    proprietary.driver = driver;

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
    const proprietary = await new Proprietary().findOne(runner, id);
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
