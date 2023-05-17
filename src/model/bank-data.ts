export class BankData {
  constructor(
    private id: number = 0,
    private bank: string = '',
    private agency: string = '',
    private account: string = '',
    private type: number = 0,
  ) {}

  getId = () => this.id;
  getBank = () => this.bank;
  getAgency = () => this.agency;
  getAccount = () => this.account;
  getType = () => this.type;

}
