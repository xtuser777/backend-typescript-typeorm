export class PaymentForm {
  constructor(
    private id: number = 0,
    private description: string = '',
    private link: number = 0,
    private deadline: number = 0,
  ) {}

  getId = () => this.id;
  getDescription = () => this.description;
  getLink = () => this.link;
  getDeadline = () => this.deadline;
}
