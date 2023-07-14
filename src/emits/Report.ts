import { resolve } from 'path';
import { IParameterization } from '../entity/Parameterization';

/* eslint-disable @typescript-eslint/no-var-requires */
const FPDF = require('node-fpdf');

export class Report extends FPDF {
  private _parameterization: IParameterization;

  constructor(parameterization: IParameterization) {
    super('L', 'mm', 'A4');
    this._parameterization = parameterization;
    this.AddPage();
  }

  Header() {
    const enterprise = this._parameterization.person.enterprise?.corporateName;
    const contact = `${this._parameterization.person.contact.address.street}, ${this._parameterization.person.contact.address.number} - ${this._parameterization.person.contact.address.complement} - ${this._parameterization.person.contact.phone}`;
    const document = this._parameterization.person.enterprise?.cnpj;

    //this.Image(resolve(__dirname, '..', '..', 'images', 'logo.png'), 9, 4, 64, 64, 'png');

    this.SetFont('Arial', 'B', 14);
    const w1 = this.GetStringWidth(enterprise);
    this.SetX(287 - w1);
    this.Cell(w1, 1, enterprise, 0, 1, 'R');

    this.Ln(5);

    this.SetFont('Arial', '', 10);
    const w2 = this.GetStringWidth(contact);
    this.SetX(287 - w2);
    this.Cell(w2, 1, contact, 0, 1, 'R');

    this.Ln(4);

    this.SetFont('Arial', '', 9);
    const w3 = this.GetStringWidth(document);
    this.SetX(287 - w3);
    this.Cell(w3, 1, document, 0, 1, 'R');

    this.Ln(2);

    this.SetLineWidth(0.5);
    this.Line(7, 25, 290, 25);
  }

  Footer() {
    const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const address =
      this._parameterization.person.contact.address.street +
      ', ' +
      this._parameterization.person.contact.address.number +
      ' - ' +
      this._parameterization.person.contact.address.complement +
      ' - ' +
      this._parameterization.person.contact.address.neighborhood +
      ' - ' +
      this._parameterization.person.contact.address.city.name +
      ' - ' +
      this._parameterization.person.contact.address.city.state.acronym;
    const contact =
      this._parameterization.person.contact.phone +
      ' - ' +
      this._parameterization.person.contact.email;
    const page = 'Página ' + this.PageNo();

    this.SetLineWidth(0.5);
    this.Line(7, this.GetPageHeight() - 16, 290, this.GetPageHeight() - 16);

    this.Ln(2);

    this.SetFont('Times', '', 9);
    this.Text(8, this.GetPageHeight() - 12, date);

    this.SetFont('Arial', '', 9);
    this.Text(
      (297 - this.GetStringWidth(address)) / 2,
      this.GetPageHeight() - 12,
      address,
    );
    this.Text(
      (297 - this.GetStringWidth(contact)) / 2,
      this.GetPageHeight() - 8,
      contact,
    );

    this.SetFont('Times', '', 9);
    this.Text(289 - this.GetStringWidth(page), this.GetPageHeight() - 12, page);
  }

  ReportTitle(title: string, filters: string) {
    this.SetFont('Arial', 'B', 12);
    this.Text((297 - this.GetStringWidth(title)) / 2, 31, title);

    this.SetFont('Arial', 'B', 8);
    this.Text(
      (297 - this.GetStringWidth('"' + filters + '"')) / 2,
      36,
      '"' + filters + '"',
    );
  }
}
