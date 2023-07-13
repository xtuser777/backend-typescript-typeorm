import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { LoadStep } from '../model/LoadStep';
import { OrderStatus } from '../model/OrderStatus';
import { Status } from '../model/Status';
import { Parameterization } from '../model/Parameterization';
import { LoadAutorization } from '../emits/LoadAutorization';

export class LoadStepController {
  async update(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const payload = req.body;
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const step = await new LoadStep().findOne(runner, { id });
      if (!step) {
        await runner.release();
        return res.status(400).json('etapa de carregamento não encontrada.');
      }
      const orderStatus = (await new OrderStatus().findOne(
        runner,
        step.freightOrder.status.id,
      )) as OrderStatus;
      step.status = payload.step.status;
      await runner.startTransaction();
      const response = await step.update(runner);
      if (!response.success) {
        await runner.release();
        await runner.rollbackTransaction();
        return res.status(400).json(response.message);
      }
      orderStatus.status = (
        (await new Status().findOne(runner, 2)) as Status
      ).toAttributes;
      orderStatus.date = new Date().toISOString().substring(0, 10);
      orderStatus.time = new Date()
        .toLocaleTimeString('en-US', {
          timeZone: 'America/Sao_Paulo',
        })
        .substring(0, 8);
      const responseStatus = await orderStatus.update(runner);
      if (responseStatus.length > 0) {
        await runner.release();
        await runner.rollbackTransaction();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();
      return res.json(response.message);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async print(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const step = await new LoadStep().findOne(runner, { id });
      if (!step) {
        await runner.release();
        return res.status(400).json('etapa de carregamento não encontrada.');
      }
      const parameterization = (await new Parameterization().findOne(
        runner,
      )) as Parameterization;
      await runner.release();
      const autorization = new LoadAutorization(
        parameterization?.toAttributes,
        step.freightOrder,
        step.toAttributes,
      );
      autorization.DocumentData();
      autorization.RepresentationData();
      autorization.DocumentTitle();
      autorization.DriverData();
      autorization.ProprietaryData();
      autorization.ClientData();
      autorization.ItemsTable();
      autorization.Observation();
      autorization.Message();
      autorization.Signature();
      autorization.Output(
        'F',
        `reports/AutorizacaoCarregamentoPedido${step.freightOrder.id}Etapa${step.order}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }
}
