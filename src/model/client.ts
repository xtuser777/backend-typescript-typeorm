export class Client {
  constructor(
    private id: number = 0,
    private register: string = '',
    private type: number = 0,
    private personId: number = 0,
  ) {}

  getId = () => this.id;
  getRegister = () => this.register;
  getType = () => this.type;
  getPersonId = () => this.personId;

}
