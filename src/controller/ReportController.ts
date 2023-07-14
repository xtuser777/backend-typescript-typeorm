import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Parameterization } from '../model/Parameterization';
import { IClient } from '../entity/Client';
import { Report } from '../emits/Report';
import { Client } from '../model/Client';

export class ReportController {
  async clients(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const clients: IClient[] = req.body.clients;
    const filters = req.body.filters;

    let filtersList = '';
    if (
      filters.filter == '' &&
      filters.dateInit == '' &&
      filters.dateEnd == '' &&
      filters.type == 0
    ) {
      filtersList = 'SEM FILTRAGEM';
    } else {
      if (
        filters.filter != '' &&
        filters.dateInit != '' &&
        filters.dateEnd != '' &&
        filters.type != 0
      ) {
        const type = filters.type == 1 ? 'FÍSICA' : 'JURÍDICA';
        filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E TIPO (${type})`;
      } else {
        if (
          filters.filter != '' &&
          filters.dateInit != '' &&
          filters.dateEnd != '' &&
          filters.type == 0
        ) {
          filtersList = `FILTRADO POR FILTRO (${filters.filter}) E PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
        } else {
          if (
            filters.filter != '' &&
            filters.dateInit == '' &&
            filters.dateEnd == '' &&
            filters.type != 0
          ) {
            const type = filters.type == 1 ? 'FÍSICA' : 'JURÍDICA';
            filtersList = `FILTRADO POR FILTRO (${filters.filter}) E TIPO (${type})`;
          } else {
            if (
              filters.filter != '' &&
              filters.dateInit == '' &&
              filters.dateEnd == '' &&
              filters.type == 0
            ) {
              filtersList = `FILTRADO POR FILTRO (${filters.filter})`;
            } else {
              if (
                filters.filter == '' &&
                filters.dateInit != '' &&
                filters.dateEnd != '' &&
                filters.type != 0
              ) {
                const type = filters.type == 1 ? 'FÍSICA' : 'JURÍDICA';
                filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E TIPO (${type})`;
              } else {
                if (
                  filters.filter == '' &&
                  filters.dateInit != '' &&
                  filters.dateEnd != '' &&
                  filters.type == 0
                ) {
                  filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
                } else {
                  if (
                    filters.filter == '' &&
                    filters.dateInit == '' &&
                    filters.dateEnd == '' &&
                    filters.type != 0
                  ) {
                    const type = filters.type == 1 ? 'FÍSICA' : 'JURÍDICA';
                    filtersList = `FILTRADO POR TIPO (${type})`;
                  }
                }
              }
            }
          }
        }
      }
    }
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const parameterization = (await new Parameterization().findOne(
        runner,
      )) as Parameterization;
      await runner.release();
      const report = new Report(parameterization);
      report.ReportTitle('RELATÓRIO DE CLIENTES', filtersList);
      const col1 = 'CÓD.';
      const col2 = 'NOME';
      const col3 = 'CPF/CNPJ';
      const col4 = 'CADASTRO';
      const col5 = 'TELEFONE';
      const col6 = 'CELULAR';
      const col7 = 'TIPO';
      const col8 = 'E-MAIL';

      report.SetFont('Arial', 'B', 9);
      report.SetXY(10, 40);
      report.Cell(10, 4, col1, 'B');
      report.Cell(70, 4, col2, 'B');
      report.Cell(32, 4, col3, 'B');
      report.Cell(22, 4, col4, 'B');
      report.Cell(24, 4, col5, 'B');
      report.Cell(26, 4, col6, 'B');
      report.Cell(18, 4, col7, 'B');
      report.Cell(74, 4, col8, 'B');

      let y = 46;
      report.SetFont('Arial', '', 9);

      for (const client of clients) {
        const cod = client.id;
        const nom =
          client.person.type == 1
            ? client.person.individual?.name
            : client.person.enterprise?.fantasyName;
        const doc =
          client.person.type == 1
            ? client.person.individual?.cpf
            : client.person.enterprise?.cnpj;
        const cad = client.register;
        const tel = client.person.contact.phone;
        const cel = client.person.contact.cellphone;
        const tip = client.person.type == 1 ? 'FÍSICA' : 'JURÍDICA';
        const ema = client.person.contact.email;

        report.SetXY(10, y);
        report.Cell(10, 4, cod);
        report.Cell(70, 4, nom);
        report.Cell(32, 4, doc);
        report.Cell(22, 4, cad);
        report.Cell(24, 4, tel);
        report.Cell(26, 4, cel);
        report.Cell(18, 4, tip);
        report.Cell(74, 4, ema);

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
        `reports/RelatorioClientes${fileDate.replaceAll('-', '')}-${time
          .trim()
          .replaceAll(':', '')}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }
}
