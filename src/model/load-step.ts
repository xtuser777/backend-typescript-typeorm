export class LoadStep {
  constructor(
    private id: number = 0,
    private order: number = 0,
    private status: number = 0,
    private load: number = 0,
    private representationId: number = 0,
  ) {}

  getId = () => this.id;
  getOrder = () => this.order;
  getStatus = () => this.status;
  getLoad = () => this.load;
  getRepresentationId = () => this.representationId;
}
