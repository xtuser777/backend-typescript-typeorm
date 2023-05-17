export class FreightBudget {
  constructor(
    private id: number = 0,
    private description: string = '',
    private date: Date = new Date(),
    private distance: number = 0,
    private weight: number = 0,
    private value: number = 0,
    private shipping: string = '',
    private validate: Date = new Date(),
    private saleBudgetId: number = 0,
    private representationId: number = 0,
    private clientId: number = 0,
    private truckTypeId: number = 0,
    private cityId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getDescription = () => this.description;
  getDate = () => this.date;
  getDistance = () => this.distance;
  getWeight = () => this.weight;
  getValue = () => this.value;
  getShipping = () => this.shipping;
  getValidate = () => this.validate;
  getSaleBudgetId = () => this.saleBudgetId;
  getRepresentationId = () => this.representationId;
  getClientId = () => this.clientId;
  getTruckTypeId = () => this.truckTypeId;
  getCityId = () => this.cityId;
  getUserId = () => this.userId;

  calculateMinimumFloor = (km: number, axes: number): number => {
    let floor = 0.0;

    if (km <= 0.0 || axes <= 0) return floor;

    switch (axes) {
      case 4:
        floor = km * 2.3041;
        break;
      case 5:
        floor = km * 2.7446;
        break;
      case 6:
        floor = km * 3.1938;
        break;
      case 7:
        floor = km * 3.3095;
        break;
      case 9:
        floor = km * 3.6542;
        break;
    }

    return floor;
  };
}
