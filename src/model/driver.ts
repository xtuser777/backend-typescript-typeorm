export default class Driver {
  constructor(
    private id: number = 0,
    private register: string = '',
    private cnh: string = '',
    private personId: number = 0,
    private bankDataId: number = 0,
  ) {}

  getId = () => this.id;
  getRegister = () => this.register;
  getChn = () => this.cnh;
  getPersonId = () => this.personId;
  getBankDataId = () => this.bankDataId;
}
