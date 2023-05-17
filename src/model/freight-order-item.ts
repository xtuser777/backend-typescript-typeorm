export class FreightOrderItem {
  constructor(
    private productId: number = 0,
    private quantity: number = 0,
    private weight: number = 0.0,
  ) {}

  getProductId = () => this.productId;
  getQuantity = () => this.quantity;
  getWeight = () => this.weight;
}
