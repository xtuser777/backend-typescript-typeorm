export class Product {
  constructor(
    private id: number = 0,
    private description: string = '',
    private measure: string = '',
    private weight: number = 0.0,
    private price: number = 0.0,
    private priceOut: number = 0.0,
    private representationId: number = 0,
  ) {}

  getId = () => this.id;
  getDescription = () => this.description;
  getMeasure = () => this.measure;
  getWeight = () => this.weight;
  getPrice = () => this.price;
  getPriceOut = () => this.priceOut;
  getRepresentationId = () => this.representationId;
}
