import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Parameterization } from '../model/Parameterization';
import { IClient } from '../entity/Client';
import { Report } from '../emits/Report';
import { Client } from '../model/Client';
import { ISaleOrder } from '../entity/SaleOrder';
import { IFreightOrder } from '../entity/FreightOrder';
import { ISaleBudget } from '../entity/SaleBudget';
import { IFreightBudget } from '../entity/FreightBudget';
import { IBillPay } from '../entity/BillPay';

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

  async saleOrders(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const orders: ISaleOrder[] = req.body.orders;
    const filters = req.body.filters;

    let filtersList = '';
    if (
      filters.filter == '' &&
      filters.dateInit == '' &&
      filters.dateEnd == '' &&
      filters.client == 0
    ) {
      filtersList = 'SEM FILTRAGEM';
    } else {
      if (
        filters.filter != '' &&
        filters.dateInit != '' &&
        filters.dateEnd != '' &&
        filters.client != 0
      ) {
        filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
      } else {
        if (
          filters.filter != '' &&
          filters.dateInit != '' &&
          filters.dateEnd != '' &&
          filters.client == 0
        ) {
          filtersList = `FILTRADO POR FILTRO (${filters.filter}) E PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
        } else {
          if (
            filters.filter != '' &&
            filters.dateInit == '' &&
            filters.dateEnd == '' &&
            filters.client != 0
          ) {
            filtersList = `FILTRADO POR FILTRO (${filters.filter}) E CLIENTE (${filters.client})`;
          } else {
            if (
              filters.filter != '' &&
              filters.dateInit == '' &&
              filters.dateEnd == '' &&
              filters.client == 0
            ) {
              filtersList = `FILTRADO POR FILTRO (${filters.filter})`;
            } else {
              if (
                filters.filter == '' &&
                filters.dateInit != '' &&
                filters.dateEnd != '' &&
                filters.client != 0
              ) {
                filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
              } else {
                if (
                  filters.filter == '' &&
                  filters.dateInit != '' &&
                  filters.dateEnd != '' &&
                  filters.client == 0
                ) {
                  filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
                } else {
                  if (
                    filters.filter == '' &&
                    filters.dateInit == '' &&
                    filters.dateEnd == '' &&
                    filters.client != 0
                  ) {
                    filtersList = `FILTRADO POR CLIENTE (${filters.client})`;
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
      report.ReportTitle('RELATÓRIO DE PEDIDOS DE VENDA', filtersList);

      const col1 = 'CÓD.';
      const col2 = 'DESCRIÇÃO';
      const col3 = 'CLIENTE';
      const col4 = 'VENDEDOR';
      const col5 = 'DATA';
      const col6 = 'DESTINO';
      const col7 = 'AUTOR';
      const col8 = 'FORMA PAGAMENTO';
      const col9 = 'VALOR (R$)';

      report.SetFont('Arial', 'B', 8);
      report.SetXY(10, 40);
      report.Cell(10, 4, col1, 'B');
      report.Cell(54, 4, col2, 'B');
      report.Cell(37, 4, col3, 'B');
      report.Cell(37, 4, col4, 'B');
      report.Cell(21, 4, col5, 'B');
      report.Cell(31, 4, col6, 'B');
      report.Cell(30, 4, col7, 'B');
      report.Cell(36, 4, col8, 'B');
      report.Cell(21, 4, col9, 'B');

      let y = 46;
      report.SetFont('Arial', '', 8);
      for (const order of orders) {
        const cod = order.id;
        const des = order.description;
        const cli =
          order.client.person.type == 1
            ? order.client.person.individual?.name
            : order.client.person.enterprise?.fantasyName;
        const vdd = order.salesman ? order.salesman.person.individual?.name : '';
        const dat = order.date;
        const dst = order.destiny.name + '/' + order.destiny.state.acronym;
        const aut = order.author.person.individual?.name;
        const frm = order.paymentForm.description;
        const vlr = order.value;

        report.SetXY(10, y);
        report.Cell(10, 4, cod);
        report.Cell(54, 4, des);
        report.Cell(37, 4, cli);
        report.Cell(37, 4, vdd);
        report.Cell(21, 4, dat);
        report.Cell(31, 4, dst);
        report.Cell(30, 4, aut);
        report.Cell(36, 4, frm);
        report.Cell(21, 4, vlr);

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
        `reports/RelatorioPedidosVenda${fileDate.replaceAll('-', '')}-${time
          .trim()
          .replaceAll(':', '')}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }

  async freightOrders(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const orders: IFreightOrder[] = req.body.orders;
    const filters = req.body.filters;

    let filtersList = '';
    if (
      filters.filter == '' &&
      filters.dateInit == '' &&
      filters.dateEnd == '' &&
      filters.status == 0 &&
      filters.client == 0
    ) {
      filtersList = 'SEM FILTRAGEM';
    } else {
      if (
        filters.filter != '' &&
        filters.dateInit != '' &&
        filters.dateEnd != '' &&
        filters.status > 0 &&
        filters.client > 0
      ) {
        filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}), STATUS (${filters.status}) E CLIENTE (${filters.client})`;
      } else {
        if (
          filters.filter != '' &&
          filters.dateInit != '' &&
          filters.dateEnd != '' &&
          filters.status > 0 &&
          filters.client == 0
        ) {
          filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E STATUS (${filters.status})`;
        } else {
          if (
            filters.filter != '' &&
            filters.dateInit != '' &&
            filters.dateEnd != '' &&
            filters.status == 0 &&
            filters.client > 0
          ) {
            filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
          } else {
            if (
              filters.filter != '' &&
              filters.dateInit != '' &&
              filters.dateEnd != '' &&
              filters.status == 0 &&
              filters.client == 0
            ) {
              filtersList = `FILTRADO POR FILTRO (${filters.filter}) E PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
            } else {
              if (
                filters.filter != '' &&
                filters.dateInit == '' &&
                filters.dateEnd == '' &&
                filters.status > 0 &&
                filters.client > 0
              ) {
                filtersList = `FILTRADO POR FILTRO (${filters.filter}), STATUS (${filters.status}) E CLIENTE (${filters.client})`;
              } else {
                if (
                  filters.filter != '' &&
                  filters.dateInit == '' &&
                  filters.dateEnd == '' &&
                  filters.status > 0 &&
                  filters.client == 0
                ) {
                  filtersList = `FILTRADO POR FILTRO (${filters.filter}) E STATUS (${filters.status})`;
                } else {
                  if (
                    filters.filter != '' &&
                    filters.dateInit == '' &&
                    filters.dateEnd == '' &&
                    filters.status == 0 &&
                    filters.client > 0
                  ) {
                    filtersList = `FILTRADO POR FILTRO (${filters.filter}) E CLIENTE (${filters.client})`;
                  } else {
                    if (
                      filters.filter != '' &&
                      filters.dateInit == '' &&
                      filters.dateEnd == '' &&
                      filters.status == 0 &&
                      filters.client == 0
                    ) {
                      filtersList = `FILTRADO POR FILTRO (${filters.filter})`;
                    } else {
                      if (
                        filters.filter == '' &&
                        filters.dateInit != '' &&
                        filters.dateEnd != '' &&
                        filters.status > 0 &&
                        filters.client > 0
                      ) {
                        filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}), STATUS (${filters.status}) E CLIENTE (${filters.client})`;
                      } else {
                        if (
                          filters.filter == '' &&
                          filters.dateInit != '' &&
                          filters.dateEnd != '' &&
                          filters.status > 0 &&
                          filters.client == 0
                        ) {
                          filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E STATUS (${filters.status})`;
                        } else {
                          if (
                            filters.filter == '' &&
                            filters.dateInit != '' &&
                            filters.dateEnd != '' &&
                            filters.status == 0 &&
                            filters.client > 0
                          ) {
                            filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
                          } else {
                            if (
                              filters.filter == '' &&
                              filters.dateInit != '' &&
                              filters.dateEnd != '' &&
                              filters.status == 0 &&
                              filters.client == 0
                            ) {
                              filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
                            } else {
                              if (
                                filters.filter == '' &&
                                filters.dateInit == '' &&
                                filters.dateEnd == '' &&
                                filters.status > 0 &&
                                filters.client > 0
                              ) {
                                filtersList = `FILTRADO POR STATUS (${filters.status}) E CLIENTE (${filters.client})`;
                              } else {
                                if (
                                  filters.filter == '' &&
                                  filters.dateInit == '' &&
                                  filters.dateEnd == '' &&
                                  filters.status > 0 &&
                                  filters.client == 0
                                ) {
                                  filtersList = `FILTRADO POR STATUS (${filters.status})`;
                                } else {
                                  if (
                                    filters.filter == '' &&
                                    filters.dateInit == '' &&
                                    filters.dateEnd == '' &&
                                    filters.status == 0 &&
                                    filters.client > 0
                                  ) {
                                    filtersList = `FILTRADO POR CLIENTE (${filters.client})`;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
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
      report.ReportTitle('RELATÓRIO DE PEDIDOS DE FRETE', filtersList);

      const col1 = 'CÓD.';
      const col2 = 'DESCRIÇÃO';
      const col3 = 'CLIENTE';
      const col4 = 'MOTORISTA';
      const col5 = 'DATA';
      const col6 = 'DESTINO';
      const col7 = 'AUTOR';
      const col8 = 'FORMA PAGAMENTO';
      const col9 = 'VALOR (R$)';

      report.SetFont('Arial', 'B', 8);
      report.SetXY(10, 40);
      report.Cell(10, 4, col1, 'B');
      report.Cell(54, 4, col2, 'B');
      report.Cell(37, 4, col3, 'B');
      report.Cell(37, 4, col4, 'B');
      report.Cell(21, 4, col5, 'B');
      report.Cell(31, 4, col6, 'B');
      report.Cell(30, 4, col7, 'B');
      report.Cell(36, 4, col8, 'B');
      report.Cell(21, 4, col9, 'B');

      let y = 46;
      report.SetFont('Arial', '', 8);
      for (const order of orders) {
        const cod = order.id;
        const des = order.description;
        const cli =
          order.client.person.type == 1
            ? order.client.person.individual?.name
            : order.client.person.enterprise?.fantasyName;
        const mot = order.driver.person.individual?.name;
        const dat = order.date;
        const dst = order.destiny.name + '/' + order.destiny.state.acronym;
        const aut = order.author.person.individual?.name;
        const frm = order.paymentFormFreight.description;
        const vlr = order.value;

        report.SetXY(10, y);
        report.Cell(10, 4, cod);
        report.Cell(54, 4, des);
        report.Cell(37, 4, cli);
        report.Cell(37, 4, mot);
        report.Cell(21, 4, dat);
        report.Cell(31, 4, dst);
        report.Cell(30, 4, aut);
        report.Cell(36, 4, frm);
        report.Cell(21, 4, vlr);

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
        `reports/RelatorioPedidosFrete${fileDate.replaceAll('-', '')}-${time
          .trim()
          .replaceAll(':', '')}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }

  async saleBudgets(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const budgets: ISaleBudget[] = req.body.budgets;
    const filters = req.body.filters;

    let filtersList = '';
    if (
      filters.filter == '' &&
      filters.dateInit == '' &&
      filters.dateEnd == '' &&
      filters.client == 0
    ) {
      filtersList = 'SEM FILTRAGEM';
    } else {
      if (
        filters.filter != '' &&
        filters.dateInit != '' &&
        filters.dateEnd != '' &&
        filters.client != 0
      ) {
        filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
      } else {
        if (
          filters.filter != '' &&
          filters.dateInit != '' &&
          filters.dateEnd != '' &&
          filters.client == 0
        ) {
          filtersList = `FILTRADO POR FILTRO (${filters.filter}) E PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
        } else {
          if (
            filters.filter != '' &&
            filters.dateInit == '' &&
            filters.dateEnd == '' &&
            filters.client != 0
          ) {
            filtersList = `FILTRADO POR FILTRO (${filters.filter}) E CLIENTE (${filters.client})`;
          } else {
            if (
              filters.filter != '' &&
              filters.dateInit == '' &&
              filters.dateEnd == '' &&
              filters.client == 0
            ) {
              filtersList = `FILTRADO POR FILTRO (${filters.filter})`;
            } else {
              if (
                filters.filter == '' &&
                filters.dateInit != '' &&
                filters.dateEnd != '' &&
                filters.client != 0
              ) {
                filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
              } else {
                if (
                  filters.filter == '' &&
                  filters.dateInit != '' &&
                  filters.dateEnd != '' &&
                  filters.client == 0
                ) {
                  filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
                } else {
                  if (
                    filters.filter == '' &&
                    filters.dateInit == '' &&
                    filters.dateEnd == '' &&
                    filters.client != 0
                  ) {
                    filtersList = `FILTRADO POR CLIENTE (${filters.client})`;
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
      report.ReportTitle('RELATÓRIO DE ORÇAMENTOS DE VENDA', filtersList);

      const col1 = 'CÓD.';
      const col2 = 'DESCRIÇÃO';
      const col3 = 'CLIENTE';
      const col4 = 'VENDEDOR';
      const col5 = 'DATA';
      const col6 = 'DESTINO';
      const col7 = 'AUTOR';
      const col8 = 'VENCIMENTO';
      const col9 = 'VALOR (R$)';

      report.SetFont('Arial', 'B', 8);
      report.SetXY(10, 40);
      report.Cell(10, 4, col1, 'B');
      report.Cell(54, 4, col2, 'B');
      report.Cell(37, 4, col3, 'B');
      report.Cell(37, 4, col4, 'B');
      report.Cell(21, 4, col5, 'B');
      report.Cell(31, 4, col6, 'B');
      report.Cell(30, 4, col7, 'B');
      report.Cell(36, 4, col8, 'B');
      report.Cell(21, 4, col9, 'B');

      let y = 46;
      report.SetFont('Arial', '', 8);
      for (const budget of budgets) {
        const cod = budget.id;
        const des = budget.description;
        const cli = budget.clientName;
        const vdd = budget.salesman ? budget.salesman.person.individual?.name : '';
        const dat = budget.date;
        const dst = budget.destiny.name + '/' + budget.destiny.state.acronym;
        const aut = budget.author.person.individual?.name;
        const val = budget.validate;
        const vlr = budget.value;

        report.SetXY(10, y);
        report.Cell(10, 4, cod);
        report.Cell(54, 4, des);
        report.Cell(37, 4, cli);
        report.Cell(37, 4, vdd);
        report.Cell(21, 4, dat);
        report.Cell(31, 4, dst);
        report.Cell(30, 4, aut);
        report.Cell(36, 4, val);
        report.Cell(21, 4, vlr);

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
        `reports/RelatorioOrcamentosVenda${fileDate.replaceAll('-', '')}-${time
          .trim()
          .replaceAll(':', '')}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }

  async freightBudgets(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const budgets: IFreightBudget[] = req.body.budgets;
    const filters = req.body.filters;

    let filtersList = '';
    if (
      filters.filter == '' &&
      filters.dateInit == '' &&
      filters.dateEnd == '' &&
      filters.client == 0
    ) {
      filtersList = 'SEM FILTRAGEM';
    } else {
      if (
        filters.filter != '' &&
        filters.dateInit != '' &&
        filters.dateEnd != '' &&
        filters.client != 0
      ) {
        filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
      } else {
        if (
          filters.filter != '' &&
          filters.dateInit != '' &&
          filters.dateEnd != '' &&
          filters.client == 0
        ) {
          filtersList = `FILTRADO POR FILTRO (${filters.filter}) E PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
        } else {
          if (
            filters.filter != '' &&
            filters.dateInit == '' &&
            filters.dateEnd == '' &&
            filters.client != 0
          ) {
            filtersList = `FILTRADO POR FILTRO (${filters.filter}) E CLIENTE (${filters.client})`;
          } else {
            if (
              filters.filter != '' &&
              filters.dateInit == '' &&
              filters.dateEnd == '' &&
              filters.client == 0
            ) {
              filtersList = `FILTRADO POR FILTRO (${filters.filter})`;
            } else {
              if (
                filters.filter == '' &&
                filters.dateInit != '' &&
                filters.dateEnd != '' &&
                filters.client != 0
              ) {
                filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
              } else {
                if (
                  filters.filter == '' &&
                  filters.dateInit != '' &&
                  filters.dateEnd != '' &&
                  filters.client == 0
                ) {
                  filtersList = `FILTRADO POR PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
                } else {
                  if (
                    filters.filter == '' &&
                    filters.dateInit == '' &&
                    filters.dateEnd == '' &&
                    filters.client != 0
                  ) {
                    filtersList = `FILTRADO POR FILTRO (${filters.filter}), PERÍODO (${filters.dateInit}) - (${filters.dateEnd}) E CLIENTE (${filters.client})`;
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
      report.ReportTitle('RELATÓRIO DE ORÇAMENTOS DE FRETE', filtersList);

      const col1 = 'CÓD.';
      const col2 = 'DESCRIÇÃO';
      const col3 = 'CLIENTE';
      const col4 = 'DATA';
      const col5 = 'DESTINO';
      const col6 = 'AUTOR';
      const col7 = 'VENCIMENTO';
      const col8 = 'VALOR (R$)';

      report.SetFont('Arial', 'B', 8);
      report.SetXY(10, 40);
      report.Cell(10, 4, col1, 'B');
      report.Cell(68, 4, col2, 'B');
      report.Cell(40, 4, col3, 'B');
      report.Cell(21, 4, col4, 'B');
      report.Cell(40, 4, col5, 'B');
      report.Cell(40, 4, col6, 'B');
      report.Cell(27, 4, col7, 'B');
      report.Cell(24, 4, col8, 'B');

      let y = 46;
      report.SetFont('Arial', '', 8);
      for (const budget of budgets) {
        const cod = budget.id;
        const des = budget.description;
        const cli =
          budget.client.person.type == 1
            ? budget.client.person.individual?.name
            : budget.client.person.enterprise?.fantasyName;
        const dat = budget.date;
        const dst = budget.destiny.name + '/' + budget.destiny.state.acronym;
        const aut = budget.author.person.individual?.name;
        const val = budget.validate;
        const vlr = budget.value;

        report.SetXY(10, y);
        report.Cell(10, 4, cod);
        report.Cell(68, 4, des);
        report.Cell(40, 4, cli);
        report.Cell(21, 4, dat);
        report.Cell(40, 4, dst);
        report.Cell(40, 4, aut);
        report.Cell(27, 4, val);
        report.Cell(24, 4, vlr);

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
        `reports/RelatorioOrcamentosFrete${fileDate.replaceAll('-', '')}-${time
          .trim()
          .replaceAll(':', '')}.pdf`,
      );
      return res.json(true);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as Error).message);
    }
  }

  async billsPay(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');
    const bills: IBillPay[] = req.body.bills;
    const filters = req.body.filters;

    let filtersList = '';
    if (
      filters.filter == '' &&
      filters.dateInit == '' &&
      filters.dateEnd == '' &&
      filters.dueDate == '' &&
      filters.comission == 0 &&
      filters.salesman == 0 &&
      filters.situation == 0
    ) {
      filtersList = 'SEM FILTRAGEM';
    } else {
      if (
        filters.filter != '' ||
        filters.dateInit != '' ||
        filters.dateEnd != '' ||
        filters.dueDate != '' ||
        filters.comission > 0 ||
        filters.salesman > 0 ||
        filters.situation != 0
      ) {
        filtersList = 'FILTRADO POR';

        if (filters.filter != '') {
          filtersList += ` FILTRO (${filters.filter})`;
        }

        if (filters.dateInit != '' && filters.dateEnd != '') {
          if (filtersList.length > 12) filtersList += ',';
          filtersList += ` PERÍODO (${filters.dateInit}) - (${filters.dateEnd})`;
        }

        if (filters.dueDate != '') {
          if (filtersList.length > 12) filtersList += ',';
          filtersList += ` VENCIMENTO (${filters.dueDate})`;
        }

        if (filters.comission > 0) {
          if (filtersList.length > 12) filtersList += ',';
          let com = '';
          switch (filters.comission) {
            case 1:
              com = 'SIM';
              break;
            case 2:
              com = 'NÂO';
              break;
          }
          filtersList += ` COMISSÃO (${com})`;
        }

        if (filters.salesman > 0) {
          if (filtersList.length > 12) filtersList += ',';
          filtersList += ` VENDEDOR (${filters.salesman})`;
        }

        if (filters.situation > 0) {
          if (filtersList.length > 12) filtersList += ',';
          let sit = '';
          switch (filters.situation) {
            case 1:
              sit = 'PENDENTE';
              break;
            case 2:
              sit = 'PAGO PARC.';
              break;
            case 3:
              sit = 'PAGO';
              break;
          }
          filtersList += ` SITUAÇÃO (${sit})`;
        }
      } else {
        if (
          (filters.dateInit != '' && filters.dateEnd == '') ||
          (filters.dateInit == '' && filters.dateEnd != '')
        ) {
          return res
            .status(400)
            .json('As datas de inicio e fim devem estar preenchidas.');
        }
      }
    }
  }
}
