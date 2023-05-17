export class SaleBudget {
  constructor(
    private id: number = 0,
    private description: string = '',
    private date: Date = new Date(),
    private clientName: string = '',
    private clientDocument: string = '',
    private clientPhone: string = '',
    private clientCellphone: string = '',
    private clientEmail: string = '',
    private weight: number = 0.0,
    private value: number = 0.0,
    private validate: Date = new Date(),
    private employeeId: number = 0,
    private clientId: number = 0,
    private cityId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getDescription = () => this.description;
  getDate = () => this.date;
  getClientName = () => this.clientName;
  getClientDocument = () => this.clientDocument;
  getClientPhone = () => this.clientPhone;
  getClientCellphone = () => this.clientCellphone;
  getClientEmail = () => this.clientEmail;
  getWeight = () => this.weight;
  getValue = () => this.value;
  getValidate = () => this.validate;
  getEmployeeId = () => this.employeeId;
  getClientId = () => this.clientId;
  getCityId = () => this.cityId;
  getUserId = () => this.userId;
}
