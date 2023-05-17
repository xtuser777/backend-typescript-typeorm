export class OrderStatus {
  constructor(
    private statusId: number = 0,
    private date: Date = new Date(),
    private time: Date = new Date(),
    private observation: string = '',
    private current: boolean = false,
    private userId: number = 0,
  ) {}

  getStatusId = () => this.statusId;
  getDate = () => this.date;
  getTime = () => this.time;
  getObservation = () => this.observation;
  getCurrent = () => this.current;
  getUserId = () => this.userId;
}
