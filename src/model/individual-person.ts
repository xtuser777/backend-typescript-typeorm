import { Person } from './person';

export class IndividualPerson extends Person {
  constructor(
    protected id: number = 0,
    private name: string = '',
    private rg: string = '',
    private cpf: string = '',
    private birthDate: Date = new Date(),
    private contactId: number = 0,
  ) {
    super(id);
  }

  getName = () => this.name;
  getRg = () => this.rg;
  getCpf = () => this.cpf;
  getBirthDate = () => this.birthDate;
  getContactId = () => this.contactId;

  isCpf = (cpf: string): boolean => {
    if (cpf === '') return false;

    cpf = cpf.replaceAll('.', '');
    cpf = cpf.replace('-', '');

    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false;

    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) {
      add += Number(cpf[i]) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf[9])) {
      return false;
    }

    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) {
      add += Number(cpf[i]) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf[10])) {
      return false;
    }

    return true;
  };
}
