import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Employee } from '../model/Employee';
import { IEmployee } from '../entity/Employee';

export class EmployeeController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const employees = await new Employee().find(runner);
    const response = [];
    for (const employee of employees) {
      const attributes = employee.toAttributes;
      attributes.passwordHash = '';
      response.push(attributes);
    }
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

    let attributes = undefined;

    if (employee) {
      attributes = employee.toAttributes;
      attributes.passwordHash = '';
    }

    return res.json(attributes);
  };

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');

    const payload = req.body;

    const employee: IEmployee = { id: 0, ...payload.employee };

    const model = new Employee(employee);

    model.password = payload.employee.password;

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    console.log(req.body.employee);

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

    const payload = req.body;

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const employee = (await new Employee().findOne(runner, id)) as Employee;
    if (!employee) {
      await runner.release();
      return res.status(400).json('funcionário não cadastrado.');
    }
    let attributes = employee.toAttributes;
    attributes = { ...payload.employee };

    const model = new Employee(attributes);

    model.password = payload.employee.password;

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
