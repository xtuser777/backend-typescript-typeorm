import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { Event } from '../model/Event';
import { Parameterization } from '../model/Parameterization';
import { Report } from '../emits/Report';

export class EventController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const events = await new Event().find(runner);
      await runner.release();
      const response = [];
      for (const event of events) response.push(event.toAttributes);
      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async show(req: Request, res: Response) {
    let id = 0;
    id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro inválido.');
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const event = await new Event().findOne(runner, id);
      await runner.release();
      return res.json(event ? event.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async report(req: Request, res: Response) {
    const filters = JSON.parse(req.params.filters);
    const filter = filters.filter;
    const date = filters.date;
    const type = Number.parseInt(filters.type);
    const runner = AppDataSource.createQueryRunner();

    try {
      await runner.connect();
      let events = await new Event().find(runner);
      let filtersList = '';
      if (filter === '' && date === '' && type === 0) {
        filtersList = 'SEM FILTRAGEM';
      } else {
        if (filter !== '' && date !== '' && type > 0) {
          const tip = type === 1 ? 'VENDA' : 'FRETE';
          filtersList = `FILTRADO POR FILTRO (${filter}), DATA (${date}) E TIPO (${tip})`;
          events = events.filter(
            (event) =>
              event.description.includes(filter) &&
              event.date == date &&
              (type == 1
                ? event.saleOrder != undefined
                : event.freightOrder != undefined),
          );
        } else {
          if (filter !== '' && date === '' && type > 0) {
            const tip = type === 1 ? 'VENDA' : 'FRETE';
            filtersList = `FILTRADO POR FILTRO (${filter}) E TIPO (${tip})`;
            events = events.filter(
              (event) =>
                event.description.includes(filter) &&
                (type == 1
                  ? event.saleOrder != undefined
                  : event.freightOrder != undefined),
            );
          } else {
            if (filter === '' && date !== '' && type > 0) {
              const tip = type === 1 ? 'VENDA' : 'FRETE';
              filtersList = `FILTRADO POR DATA (${date}) E TIPO (${tip})`;
              events = events.filter(
                (event) =>
                  event.date == date &&
                  (type == 1
                    ? event.saleOrder != undefined
                    : event.freightOrder != undefined),
              );
            } else {
              if (filter === '' && date === '' && type > 0) {
                const tip = type === 1 ? 'VENDA' : 'FRETE';
                filtersList = `FILTRADO POR TIPO (${tip})`;
                events = events.filter((event) =>
                  type == 1
                    ? event.saleOrder != undefined
                    : event.freightOrder != undefined,
                );
              } else {
                if (filter !== '' && date !== '' && type === 0) {
                  filtersList = `FILTRADO POR FILTRO (${filter}) E DATA (${date})`;
                  events = events.filter(
                    (event) => event.description.includes(filter) && event.date == date,
                  );
                } else {
                  if (filter !== '' && date === '' && type === 0) {
                    filtersList = `FILTRADO POR FILTRO (${filter})`;
                    events = events.filter((event) => event.description.includes(filter));
                  } else {
                    if (filter === '' && date !== '' && type === 0) {
                      filtersList = `FILTRADO POR DATA (${date})`;
                      events = events.filter((event) => event.date == date);
                    }
                  }
                }
              }
            }
          }
        }
      }
      const parameterization = (await new Parameterization().findOne(
        runner,
      )) as Parameterization;
      await runner.release();
      const report = new Report(parameterization);
      report.ReportTitle('RELATÓRIO DE EVENTOS DO SISTEMA', filtersList);

      const col1 = 'CÓD.';
      const col2 = 'DESCRIÇÃO';
      const col3 = 'DATA';
      const col4 = 'HORA';
      const col5 = 'PEDIDO';
      const col6 = 'AUTOR';

      report.SetFont('Arial', 'B', 9);
      report.SetXY(10, 40);
      report.Cell(12, 4, col1, 'B');
      report.Cell(122, 4, col2, 'B');
      report.Cell(19, 4, col3, 'B');
      report.Cell(15, 4, col4, 'B');
      report.Cell(58, 4, col5, 'B');
      report.Cell(50, 4, col6, 'B');

      let y = 46;
      report.SetFont('Arial', '', 9);
      /** @var Evento $evento */
      for (const event of events) {
        const cod = event.id;
        let des = event.description;
        const dat = `${event.date.split('-')[2]}/${event.date.split('-')[1]}/${
          event.date.split('-')[0]
        }`;
        const hor = event.time;

        if (des.length > 82) des = des.substring(0, 79) + '...';

        let ped = '';
        if (event.saleOrder) {
          ped = event.saleOrder.description;
        } else if (event.freightOrder) {
          ped = event.freightOrder.description;
        }
        if (ped.length > 38) ped = ped.substring(0, 35) + '...';

        let atr = event.author.person.individual?.name as string;
        if (atr.length > 35) atr = atr.substring(0, 32) + '...';

        report.SetXY(10, y);
        report.Cell(12, 4, cod);
        report.Cell(122, 4, des);
        report.Cell(19, 4, dat);
        report.Cell(15, 4, hor);
        report.Cell(58, 4, ped);
        report.Cell(50, 4, atr);

        y += 6;
        if (y == 190) {
          y = 28;
          report.AddPage();
        }
      }

      const fileDate = new Date().toISOString().substring(0, 10);
      const time = new Date()
        .toLocaleTimeString('en-US', {
          timeZone: 'America/Sao_Paulo',
        })
        .substring(0, 8);
      report.Output(
        'F',
        `reports/RelatorioEventos${fileDate}-${time.trim().replaceAll(':', '')}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }
}
