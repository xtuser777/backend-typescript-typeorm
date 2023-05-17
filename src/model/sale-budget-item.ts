export class SaleBudgetItem {
  constructor(
    private budgetId: number = 0,
    private productId: number = 0,
    private quantity: number = 0,
    private weight: number = 0.0,
    private price: number = 0.0,
  ) {}

  getBudgetId = () => this.budgetId;
  getProductId = () => this.productId;
  getQuatity = () => this.quantity;
  getWeight = () => this.weight;
  getPrice = () => this.price;
}
