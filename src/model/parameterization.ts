export class Parameterization {
  constructor(
    private id: number = 0,
    private logotype: string = '',
    private personId: number = 0,
  ) {}

  getId = () => this.id;
  getLogotype = () => this.logotype;
  getPersonId = () => this.personId;
}
