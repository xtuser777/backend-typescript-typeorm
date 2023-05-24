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
    const individual: IndividualPerson = { id: 0, ...req.body.person };
    const person: Person = { id: 0, type: 1, individual, enterprise: undefined, contact };
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
    const city = ((await new CityModel().findOne(req.body.address.city)) as CityModel)
      .toAttributes;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const driver = (await new DriverModel().findOne(runner, id)) as DriverModel;
    driver.register = req.body.driver.register;
    driver.cnh = req.body.driver.cnh;

    driver.person.contact.phone = req.body.contact.phone;
    driver.person.contact.cellphone = req.body.contact.cellphone;
    driver.person.contact.email = req.body.contact.email;

    driver.person.contact.address.street = req.body.adress.street;
    driver.person.contact.address.number = req.body.address.number;
    driver.person.contact.address.neighborhood = req.body.address.neighborhood;
    driver.person.contact.address.complement = req.body.address.complement;
    driver.person.contact.address.code = req.body.address.code;
    driver.person.contact.address.city = city;

    (driver.person.individual as IndividualPerson).name = req.body.person.name;
    (driver.person.individual as IndividualPerson).cpf = req.body.person.cpf;
    (driver.person.individual as IndividualPerson).birth = req.body.person.birth;

    driver.bankData.bank = req.body.bank.bank;
    driver.bankData.agency = req.body.bank.agency;
    driver.bankData.account = req.body.bank.account;
    driver.bankData.type = req.body.bank.type;

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
