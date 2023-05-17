export default class Proprietary {
  constructor(
    private id: number = 0,
    private register: string = '',
    private type: number = 0,
    private driverId: number = 0,
    private personId: number = 0,
  ) {}

  getId = () => this.id;
  getRegister = () => this.register;
  getType = () => this.type;
  getDriverId = () => this.driverId;
  getPersonId = () => this.personId;
}
