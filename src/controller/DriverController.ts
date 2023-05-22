import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { DriverModel } from '../model/DriverModel';
import { CityModel } from '../model/CityModel';
import { Address } from '../entity/Address';
import { Contact } from '../entity/Contact';
import { IndividualPerson } from '../entity/IndividualPerson';
import { Person } from '../entity/Person';
import { Driver } from '../entity/Driver';
import { BankData } from '../entity/BankData';

export class DriverController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const drivers = await new DriverModel().find(runner);
    const response = [];
    for (const driver of drivers) response.push(driver.toAttributes);
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
    const driver = await new DriverModel().findOne(runner, id);
    await runner.release();

    return res.json(driver ? driver.toAttributes : undefined);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length <= 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = ((await new CityModel().findOne(req.body.address.city)) as CityModel)
      .toAttributes;
    const address: Address = { id: 0, ...req.body.address, city };
    const contact: Contact = { id: 0, ...req.body.contact, address };
    const individual: IndividualPerson = { id: 0, ...req.body.person, contact };
    const person: Person = { id: 0, type: 1, individual, enterprise: undefined };
    const bank: BankData = { id: 0, ...req.body.bank };
    const driver: Driver = { id: 0, ...req.body.driver, person, bankData: bank };

    const model = new DriverModel(driver);

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
    const driver = (await new DriverModel().findOne(runner, id)) as DriverModel;
    let attributes = driver?.toAttributes as Driver;
    let address = (attributes.person.individual as IndividualPerson).contact.address;
    let contact = (attributes.person.individual as IndividualPerson).contact;
    let individual = attributes.person.individual as IndividualPerson;
    const person = attributes.person;
    let bankData = attributes.bankData;
    address = { id: address.id, ...req.body.address, city };
    contact = { id: contact.id, ...req.body.contact, address };
    individual = { id: individual.id, ...req.body.person, contact };
    person.individual = individual;
    bankData = { id: bankData.id, ...req.body.bank };
    attributes = {
      ...req.body.driver,
      person,
      bankData,
    };

    await runner.startTransaction();
    const response = await driver.update(runner);
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
    const driver = await new DriverModel().findOne(runner, id);
    if (!driver) {
      await runner.release();
      return res.status(400).json('motorista nao encontrado.');
    }
    await runner.startTransaction();
    const response = await driver.delete(runner);
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
