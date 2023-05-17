export class SalesOrder {
  constructor(
    private id: number = 0,
    private date: Date = new Date(),
    private description: string = '',
    private weight: number = 0.0,
    private value: number = 0.0,
    private employeeId: number = 0,
    private cityId: number = 0,
    private budgetId: number = 0,
    private truckTypeId: number = 0,
    private clientId: number = 0,
    private paymentFormId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getDate = () => this.date;
  getDescription = () => this.description;
  getWeight = () => this.weight;
  getValue = () => this.value;
  getEmployeeId = () => this.employeeId;
  getCityId = () => this.cityId;
  getBudgetId = () => this.budgetId;
  getTruckTypeId = () => this.truckTypeId;
  getClientId = () => this.clientId;
  getPaymentFormId = () => this.paymentFormId;
  getUserId = () => this.userId;
}
