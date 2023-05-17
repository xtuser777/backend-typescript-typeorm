export class BillPay {
  constructor(
    private id: number = 0,
    private bill: number = 0,
    private date: Date = new Date(),
    private type: number = 0,
    private description: string = '',
    private enterprise: string = '',
    private installment: number = 0,
    private amount: number = 0.0,
    private comission: boolean = false,
    private situation: number = 0,
    private dueDate: Date = new Date(),
    private paymentDate: Date | undefined = undefined,
    private amountPaid: number = 0.0,
    private pendencyId: number = 0,
    private paymentFormId: number = 0,
    private driverId: number = 0,
    private employeeId: number = 0,
    private categoryId: number = 0,
    private freightOrderId: number = 0,
    private salesOrderId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getBill = () => this.bill;
  getDate = () => this.date;
  getType = () => this.type;
  getDescription = () => this.description;
  getEntreprise = () => this.enterprise;
  getInstallment = () => this.installment;
  getAmount = () => this.amount;
  getComission = () => this.comission;
  getSituation = () => this.situation;
  getDueDate = () => this.dueDate;
  getPaymentDate = () => this.paymentDate;
  getAmountPaid = () => this.amountPaid;
  getPendencyId = () => this.pendencyId;
  getPaymentFormId = () => this.paymentFormId;
  getDriverId = () => this.driverId;
  getEmployeeId = () => this.employeeId;
  getCategoryId = () => this.categoryId;
  getFreightOrderId = () => this.freightOrderId;
  getSalesOrderId = () => this.salesOrderId;
  getUserId = () => this.userId;

  setId = (id: number) => (this.id = id);

}
