import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { EmployeeModel } from '../model/EmployeeModel';
import { Address } from '../entity/Address';
import { Contact } from '../entity/Contact';
import { IndividualPerson } from '../entity/IndividualPerson';
import { Employee } from '../entity/Employee';
import { Person } from '../entity/Person';
import { CityModel } from '../model/CityModel';
import { LevelModel } from '../model/LevelModel';

export class EmployeeController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const employees = await new EmployeeModel().find(runner);
    const response = [];
    for (const employee of employees) response.push(employee.toAttributes);
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
    const employee = await new EmployeeModel().findOne(runner, id);
    await runner.release();

    return res.json(employee?.toAttributes);
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = ((await new CityModel().findOne(req.body.address.city)) as CityModel)
      .toAttributes;
    const address: Address = { id: 0, ...req.body.address, city };
    const contact: Contact = { id: 0, ...req.body.contact, address };
    const individual: IndividualPerson = { id: 0, ...req.body.person, contact };
    const person: Person = { id: 0, type: 1, individual, enterprise: undefined };
    const employee: Employee = { id: 0, ...req.body.employee, person };

    const model = new EmployeeModel(employee);
    model.password = req.body.employee.password;

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const level = (
      (await new LevelModel().findOne(runner, req.body.employee.level)) as LevelModel
    ).toAttributes;
    employee.level = level;
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
    const employee = (await new EmployeeModel().findOne(runner, id)) as EmployeeModel;
    const level = (
      (await new LevelModel().findOne(runner, req.body.employee.level)) as LevelModel
    ).toAttributes;
    let attributes = employee?.toAttributes as Employee;
    let address = (attributes.person.individual as IndividualPerson).contact.address;
    let contact = (attributes.person.individual as IndividualPerson).contact;
    let individual = attributes.person.individual as IndividualPerson;
    const person = attributes.person;
    address = { id: address.id, ...req.body.address, city };
    contact = { id: contact.id, ...req.body.contact, address };
    individual = { id: individual.id, ...req.body.person, contact };
    person.individual = individual;
    attributes = {
      ...req.body.employee,
      passwordHash: attributes.passwordHash,
      person,
      level,
    };

    (employee as EmployeeModel).password = req.body.employee.password;

    await runner.startTransaction();
    const response = await employee.update(runner);
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
    const employee = await new EmployeeModel().findOne(runner, id);
    if (!employee) {
      await runner.release();
      return res.status(400).json('funcionario nao encontrado.');
    }
    await runner.startTransaction();
    const response = await employee.delete(runner);
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
