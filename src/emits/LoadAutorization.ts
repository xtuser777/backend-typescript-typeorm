import { IFreightOrder } from '../entity/FreightOrder';
import { ILoadStep } from '../entity/LoadStep';
import { IParameterization } from '../entity/Parameterization';

/* eslint-disable @typescript-eslint/no-var-requires */
const FPDF = require('node-fpdf');

export class LoadAutorization extends FPDF {
  private _parameterization: IParameterization;
  private _order: IFreightOrder;
  private _step: ILoadStep;

  constructor(
    parameterization: IParameterization,
    order: IFreightOrder,
    step: ILoadStep,
  ) {
    super('P', 'mm', 'A4');
    this._parameterization = parameterization;
    this._order = order;
    this._step = step;
    this.AddPage();
  }

  Header() {
    const contact = `${this._parameterization.person.contact.address.street}, ${this._parameterization.person.contact.address.number} - ${this._parameterization.person.contact.address.complement} - ${this._parameterization.person.contact.phone}`;

    this.SetFont('Times', 'BI', 14);
    const enterpriseWidth = this.GetStringWidth(
      this._parameterization.person.enterprise?.corporateName,
    );
    this.SetX(200 - enterpriseWidth);
    this.Cell(
      enterpriseWidth,
      1,
      this._parameterization.person.enterprise?.corporateName,
      0,
      1,
      'R',
    );

    this.Ln(5);

    this.SetFont('Times', 'BI', 12);
    const contactWidth = this.GetStringWidth(contact);
    this.SetX(200 - contactWidth);
    this.Cell(contactWidth, 1, contact, 0, 1, 'R');

    this.Ln(5);

    this.SetFont('Times', 'BI', 9);
    const docuemntWidth = this.GetStringWidth(
      this._parameterization.person.enterprise?.cnpj,
    );
    this.SetX(200 - docuemntWidth);
    this.Cell(
      docuemntWidth,
      1,
      this._parameterization.person.enterprise?.cnpj,
      0,
      1,
      'R',
    );

    this.Ln(2);

    this.SetLineWidth(0.5);
    this.Line(7, 25, 203, 25);
  }

  Footer() {
    const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const email = this._parameterization.person.contact.email;
    const page = 'Página ' + this.PageNo();

    this.SetLineWidth(0.5);
    this.Line(7, this.GetPageHeight() - 18, 203, this.GetPageHeight() - 18);

    this.Ln(2);

    this.SetFont('Times', '', 9);
    this.Text(9, this.GetPageHeight() - 14, date);

    this.SetFont('Times', 'BI', 9);
    this.Text(200 - this.GetStringWidth(email), this.GetPageHeight() - 15, email);

    this.SetFont('Times', '', 9);
    this.Text(200 - this.GetStringWidth(page), this.GetPageHeight() - 9, page);
  }

  DocumentData() {
    const dateDay = new Date().toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    this.SetFont('Arial', '', 10);
    this.Text(42, 34, dateDay);
  }

  RepresentationData() {
    const rep =
      this._step.representation?.person.enterprise?.fantasyName +
      ' (' +
      this._step.representation?.unity +
      ')';
    const resp = '';

    this.SetFont('Arial', 'B', 10);
    this.Text(12, 49, 'À');

    this.SetFont('Arial', '', 10);
    this.Text(12, 54, rep);

    this.SetFont('Arial', 'B', 10);
    this.Text(12, 58, 'NÚMERO DO PEDIDO DA FÁBRICA:');

    this.SetFont('Arial', '', 10);
    this.Text(
      12 + this.GetStringWidth('NÚMERO DO PEDIDO DA FÁBRICA:') + 2,
      58,
      this._order.id,
    );

    this.SetFont('Arial', 'B', 10);
    this.Text(12, 67, 'ATT.:');

    this.SetFont('Arial', '', 10);
    this.Text(12 + this.GetStringWidth('ATT.:') + 2, 67, resp);
  }

  DocumentTitle() {
    const title = 'AUTORIZAÇÃO DE CARREGAMENTO';

    this.SetFont('Times', 'BI', 14);
    this.Text((210 - this.GetStringWidth(title)) / 2, 80, title);
  }

  DriverData() {
    const driverId = this._order.driver.id.toString();
    const driverName = this._order.driver.person.individual?.name;
    const driverCpf = this._order.driver.person.individual?.cpf;
    const driverRg = '';
    const driverCnh = this._order.driver.cnh;
    const driverTruckPlate = this._order.truck.plate;
    const driverTruckCar = '';

    this.SetFont('Arial', 'B', 10);
    this.Text(22, 89, 'AUTORIZAMOS O');

    this.SetFont('Arial', 'B', 10);
    this.Text(22, 94.5, 'SR. MOTORISTA:');

    this.SetFont('Arial', '', 10);
    this.Text(
      22 + this.GetStringWidth('SR. MOTORISTA:') + 2,
      94.5,
      driverId + '     ' + driverName,
    );

    this.SetFont('Arial', 'B', 10);
    this.Text(22, 100, 'CPF:');

    this.SetFont('Arial', '', 10);
    this.Text(22 + this.GetStringWidth('CPF:') + 2, 100, driverCpf);

    this.SetFont('Arial', 'B', 10);
    this.Text(85, 100, 'RG:');

    this.SetFont('Arial', '', 10);
    this.Text(85 + this.GetStringWidth('RG:') + 2, 100, driverRg);

    this.SetFont('Arial', 'B', 10);
    this.Text(150, 100, 'CNH:');

    this.SetFont('Arial', '', 10);
    this.Text(150 + this.GetStringWidth('CNH:') + 2, 100, driverCnh);

    this.SetFont('Arial', 'B', 10);
    this.Text(22, 105, 'PLACA VEIC.:');

    this.SetFont('Arial', '', 10);
    this.Text(22 + this.GetStringWidth('PLACA VEIC.:') + 2, 105, driverTruckPlate);

    this.SetFont('Arial', 'B', 10);
    this.Text(128, 105, 'PLACA CARROC.:');

    this.SetFont('Arial', '', 10);
    this.Text(128 + this.GetStringWidth('PLACA CARROC.:') + 3, 105, driverTruckCar);
  }

  ProprietaryData() {
    const proprietaryName =
      this._order.proprietary.person.type == 1
        ? this._order.proprietary.person.individual?.name
        : this._order.proprietary.person.enterprise?.fantasyName;
    const proprietaryDocument =
      this._order.proprietary.person.type == 1
        ? this._order.proprietary.person.individual?.cpf
        : this._order.proprietary.person.enterprise?.cnpj;

    this.SetFont('Arial', 'B', 10);
    this.Text(22, 111, 'PROPRIETÁRIO:');

    this.SetFont('Arial', '', 10);
    this.Text(22 + this.GetStringWidth('PROPRIETÁRIO:') + 2, 111, proprietaryName);

    this.SetFont('Arial', 'B', 10);
    this.Text(140.2, 111, 'CPF/CNPJ:');

    this.SetFont('Arial', '', 10);
    this.Text(140.2 + this.GetStringWidth('CPF/CNPJ:') + 2, 111, proprietaryDocument);
  }

  ClientData() {
    const clientName =
      this._order.client.person.type == 1
        ? this._order.client.person.individual?.name
        : this._order.client.person.enterprise?.fantasyName;
    const clientId = this._order.client.id;
    const clientDoc1 =
      this._order.client.person.type == 1
        ? this._order.client.person.individual?.cpf
        : this._order.client.person.enterprise?.cnpj;
    const clientDoc2 = '';
    const clientCity = this._order.client.person.contact.address.city.name;
    const clientState = this._order.client.person.contact.address.city.state.name;
    const representation =
      this._step.representation?.person.enterprise?.fantasyName +
      ' (' +
      this._step.representation?.unity +
      ')';

    this.SetFont('Arial', 'B', 10);
    this.Text(22, 120, 'A CARREGAR PARA O(S) CLIENTE(S) ABAIXO DESCRITO(S):');

    this.Text(40, 126, 'CLIENTE:');

    this.SetFont('Arial', '', 10);
    this.Text(40 + this.GetStringWidth('CLIENTE:') + 2, 126, clientName);

    this.SetFont('Arial', 'B', 10);
    this.Text(130, 126, 'CÓDIGO:');

    this.SetFont('Arial', '', 10);
    this.Text(130 + this.GetStringWidth('CÓDIGO:') + 1, 126, clientId);

    this.SetFont('Arial', 'B', 10);
    this.Text(37.5, 130.5, 'CPF/CNPJ:');

    this.SetFont('Arial', '', 10);
    this.Text(37.5 + this.GetStringWidth('CPF/CNPJ:') + 2, 130.5, clientDoc1);

    this.SetFont('Arial', 'B', 10);
    this.Text(134.5, 130.5, 'RG/IE:');

    this.SetFont('Arial', '', 10);
    this.Text(134.5 + this.GetStringWidth('RG/IE:') + 2, 130.5, clientDoc2);

    this.SetFont('Arial', 'B', 10);
    this.Text(41.5, 135, 'CIDADE:');

    this.SetFont('Arial', '', 10);
    this.Text(41.5 + this.GetStringWidth('CIDADE:') + 2, 135, clientCity);

    this.SetFont('Arial', 'B', 10);
    this.Text(129.4, 135, 'ESTADO:');

    this.SetFont('Arial', '', 10);
    this.Text(129.4 + this.GetStringWidth('ESTADO:') + 2, 135, clientState);

    this.SetFont('Arial', 'B', 10);
    this.Text(24, 139.5, 'REPRESENTANTE:');

    this.SetFont('Arial', '', 10);
    this.Text(24 + this.GetStringWidth('REPRESENTANTE:') + 2, 139.5, representation);
  }

  ItemsTable() {
    this.SetFont('Arial', 'B', 10);
    this.Text(22, 148, 'O(S) SEGUINTE(S) PRODUTO(S):');

    this.SetFont('Arial', 'BI', 10);
    this.SetXY(62, 152);
    this.Cell(12, 5, 'Qtde.:');
    this.Cell(8, 5, '');
    this.Cell(60, 5, 'Descrição do Produto:');

    let weight = 0.0;
    let y = 157;

    const items = this._order.items;

    for (const item of items) {
      const weightUn = item.weight / 1000;
      const desc = item.product.description;

      this.SetXY(62, y);
      this.SetFont('Arial', '', 10);
      this.Cell(12, 5, weightUn.toString());
      this.SetFont('Arial', 'BI', 10);
      this.Cell(8, 5, 'Ton');
      this.SetFont('Arial', '', 10);
      this.Cell(60, 5, desc);

      weight += weightUn;
      y += 5;
    }

    this.SetFont('Arial', 'BI', 10);
    this.SetXY(52, y);
    this.Cell(10, 5, 'Total', 0, 0, 'R');
    this.Cell(12, 5, weight.toString(), 'T');
    this.Cell(8, 5, 'Ton', 'T');
  }

  Observation() {
    this.SetFont('Arial', 'B', 8);
    this.Text(18, 189, 'OBSERVAÇÃO:');
  }

  Message() {
    const msg = 'CERTOS DE SUAS PROVIDÊNCIAS, ANTECIPAMOS NOSSOS AGRADECIMENTOS.';

    this.SetFont('Arial', 'B', 10);
    this.Text((210 - this.GetStringWidth(msg)) / 2, 232, msg);
  }

  Signature() {
    this.SetXY(12, 269);
    this.SetFont('Arial', 'B', 10);
    this.Cell(
      this.GetStringWidth(this._parameterization.person.enterprise?.corporateName) + 2,
      5,
      this._parameterization.person.enterprise?.corporateName,
      'T',
      0,
      'C',
    );
  }
}
