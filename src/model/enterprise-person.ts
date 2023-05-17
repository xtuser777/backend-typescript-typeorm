import { Person } from './person';

export class EnterprisePerson extends Person {
  constructor(
    protected id: number = 0,
    private corporateName: string = '',
    private fantasyName: string = '',
    private cnpj: string = '',
    private contactId: number = 0,
  ) {
    super(id);
  }

  getCorporateName = () => this.corporateName;
  getFantasyName = () => this.fantasyName;
  getCnpj = () => this.cnpj;
  getContactId = () => this.contactId;

  isCnpj = (cnpj: string): boolean => {
    cnpj = cnpj.replaceAll('.', '');
    cnpj = cnpj.replace('/', '');
    cnpj = cnpj.replace('-', '');

    if (cnpj === '') return false;

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999'
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado.toString()[0] !== digitos[0]) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += Number(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado.toString()[0] !== digitos[1]) return false;

    return true;
  };
}
