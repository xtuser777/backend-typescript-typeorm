export class Representation {
  constructor(
    private id: number = 0,
    private register: string = '',
    private unity: string = '',
    private personId: number = 0,
  ) {}

  getId = () => this.id;
  getRegister = () => this.register;
  getUnity = () => this.unity;
  getPersonId = () => this.personId;
}
