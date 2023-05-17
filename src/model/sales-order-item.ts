export class SalesOrderItem {
  constructor(
    private productId: number = 0,
    private quantity: number = 0,
    private price: number = 0.0,
    private weight: number = 0.0,
  ) {}

  getProductId = () => this.productId;
  getQuantity = () => this.quantity;
  getPrice = () => this.price;
  getWeight = () => this.weight;
}
