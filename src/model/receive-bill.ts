export class ReceiveBill {
  constructor(
    private id: number = 0,
    private date: Date = new Date(),
    private bill: number = 0,
    private description: string = '',
    private payer: string = '',
    private amount: number = 0,
    private comission: boolean = false,
    private situation: number = 0,
    private dueDate: Date = new Date(),
    private receiveDate: Date | undefined = undefined,
    private amountReceived: number = 0,
    private pendencyId: number = 0,
    private paymentFormId: number = 0,
    private representationId: number = 0,
    private salesOrderId: number = 0,
    private freightOrderId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getDate = () => this.date;
  getBill = () => this.bill;
  getDescription = () => this.description;
  getPayer = () => this.payer;
  getAmount = () => this.amount;
  getComission = () => this.comission;
  getSituation = () => this.situation;
  getDueDate = () => this.dueDate;
  getReceiveDate = () => this.receiveDate;
  getAmountReceived = () => this.amountReceived;
  getPendencyId = () => this.pendencyId;
  getPaymentFormId = () => this.paymentFormId;
  getRepresentationId = () => this.representationId;
  getSalesOrderId = () => this.salesOrderId;
  getFreightOrderId = () => this.freightOrderId;
  getUserId = () => this.userId;

  setId = (id: number) => (this.id = id);
}
