import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Employee } from '../model/Employee';
import { IAddress } from '../entity/Address';
import { IContact } from '../entity/Contact';
import { IIndividualPerson } from '../entity/IndividualPerson';
import { IEmployee } from '../entity/Employee';
import { IPerson } from '../entity/Person';
import { City } from '../model/City';
import { Level } from '../model/Level';

export class EmployeeController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const employees = await new Employee().find(runner);
    const response = [];
    for (const employee of employees) response.push(employee.toAttributes);
    await runner.release();

    return res.json(response);
  };

  show = async (req: Request, res: Response) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    } catch {
      return res.status(400).json('parametro invalido.');
    }
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const employee = await new Employee().findOne(runner, id);
    await runner.release();

    return res.json(employee ? employee.toAttributes : undefined);
  };

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = (await new City().findOne(req.body.address.city)) as City;
    const address: IAddress = { id: 0, ...req.body.address, city };
    const contact: IContact = { id: 0, ...req.body.contact, address };
    const individual: IIndividualPerson = { id: 0, ...req.body.person };
    const person: IPerson = {
      id: 0,
      type: 1,
      individual,
      enterprise: undefined,
      contact,
    };
    const employee: IEmployee = { id: 0, ...req.body.employee, person };

    const model = new Employee(employee);
    model.password = req.body.employee.password;

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const level = (await new Level().findOne(runner, req.body.employee.level)) as Level;
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
    const city = (await new City().findOne(req.body.address.city)) as City;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const employee = (await new Employee().findOne(runner, id)) as Employee;
    if (!employee) {
      await runner.release();
      return res.status(400).json('fincionario nao cadastrado.');
    }
    const level = (await new Level().findOne(runner, req.body.employee.level)) as Level;
    employee.type = req.body.employee.type;
    employee.login = req.body.employee.login;
    employee.admission = req.body.employee.admission;
    employee.demission = req.body.employee.demission;
    (employee.person.individual as IIndividualPerson).name = req.body.person.name;
    (employee.person.individual as IIndividualPerson).cpf = req.body.person.cpf;
    (employee.person.individual as IIndividualPerson).birth = req.body.person.birth;
    employee.person.contact.phone = req.body.contact.phone;
    employee.person.contact.cellphone = req.body.contact.cellphone;
    employee.person.contact.email = req.body.contact.email;
    employee.person.contact.address.street = req.body.address.street;
    employee.person.contact.address.number = req.body.address.number;
    employee.person.contact.address.neighborhood = req.body.address.neighborhood;
    employee.person.contact.address.complement = req.body.address.complement;
    employee.person.contact.address.code = req.body.address.code;
    employee.person.contact.address.city = city;
    employee.level = level;

    (employee as Employee).password = req.body.employee.password;

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
    const employee = await new Employee().findOne(runner, id);
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
