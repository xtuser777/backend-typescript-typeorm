import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PaymentForm } from '../model/PaymentForm';
import { TypeORMError } from 'typeorm';
import { IPaymentForm } from '../entity/PaymentForm';

export class PaymentFormController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const forms = await new PaymentForm().find(runner);
      await runner.release();
      const response = [];
      for (const form of forms) response.push(form.toAttributes);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  show = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const form = await new PaymentForm().findOne(runner, id);
      await runner.release();
      return res.json(form ? form.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  store = async (req: Request, res: Response) => {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('reqisição sem corpo.');
    const payload = req.body;
    const form: IPaymentForm = { id: 0, ...payload.form };
    const model = new PaymentForm(form);
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      await runner.startTransaction();
      const response = await model.save(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  update = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('reqisição sem corpo.');
    const payload = req.body;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const form = await new PaymentForm().findOne(runner, id);
      if (!form) {
        await runner.release();
        return res.status(400).json('forma não encontrada.');
      }
      form.description = payload.form.description;
      form.link = payload.form.link;
      form.deadLine = payload.form.deadLine;
      await runner.startTransaction();
      const response = await form.update(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };

  delete = async (req: Request, res: Response) => {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parametro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const form = await new PaymentForm().findOne(runner, id);
      if (!form) {
        await runner.release();
        return res.status(400).json('forma não encontrada.');
      }
      await runner.startTransaction();
      const response = await form.delete(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  };
}
