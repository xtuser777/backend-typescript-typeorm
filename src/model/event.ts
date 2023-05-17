export class Event {
  constructor(
    private id: number = 0,
    private description: string = '',
    private date: string = '',
    private time: string = '',
    private salesOrderId: number = 0,
    private freightOrderId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getDescription = () => this.description;
  getDate = () => this.date;
  getTime = () => this.time;
  getSalesOrderId = () => this.salesOrderId;
  getFreightOrderId = () => this.freightOrderId;
  getUserId = () => this.userId;
}
