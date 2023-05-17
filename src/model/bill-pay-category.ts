export class BillPayCategory {
  constructor(private id: number = 0, private description: string = '') {}

  getId = () => this.id;
  getDescription = () => this.description;

}
