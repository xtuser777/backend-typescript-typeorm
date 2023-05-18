export class Employee {
  constructor(
    private id: number = 0,
    private type: number = 0,
    private admission: Date | undefined = undefined,
    private demission: Date | undefined = undefined,
    private personId: number = 0,
  ) {}

  getId = () => this.id;
  getType = () => this.type;
  getAdmission = () => this.admission;
  getDemission = () => this.demission;
  getPersonId = () => this.personId;
}
