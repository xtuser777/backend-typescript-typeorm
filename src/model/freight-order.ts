export class FreightOrder {
  constructor(
    private id: number = 0,
    private date: Date = new Date(),
    private description: string = '',
    private distance: number = 0,
    private weight: number = 0.0,
    private value: number = 0.0,
    private driverValue: number = 0.0,
    private driverEntry: number = 0.0,
    private shipping: string = '',
    private budgetId: number = 0,
    private salesOrderId: number = 0,
    private representationId: number = 0,
    private clientId: number = 0,
    private cityId: number = 0,
    private truckTypeId: number = 0,
    private proprietaryId: number = 0,
    private driverId: number = 0,
    private truckId: number = 0,
    private statusId: number = 0,
    private paymentFormFreightId: number = 0,
    private paymentFormDriverId: number = 0,
    private userId: number = 0,
  ) {}

  getId = () => this.id;
  getDate = () => this.date;
  getDescription = () => this.description;
  getDistance = () => this.distance;
  getWeight = () => this.weight;
  getValue = () => this.value;
  getDriverValue = () => this.driverValue;
  getDriverEntry = () => this.driverEntry;
  getShipping = () => this.shipping;
  getBudgetId = () => this.budgetId;
  getSalesOrderId = () => this.salesOrderId;
  getRespresentationId = () => this.representationId;
  getClientId = () => this.clientId;
  getCityId = () => this.cityId;
  getTruckTypeId = () => this.truckTypeId;
  getProprietaryId = () => this.proprietaryId;
  getDriverId = () => this.driverId;
  getTruckId = () => this.truckId;
  getStatusId = () => this.statusId;
  getPaymentFormFreightId = () => this.paymentFormFreightId;
  getPaymentFormDriverId = () => this.paymentFormDriverId;
  getUserId = () => this.userId;

  setId = (id: number) => (this.id = id);

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
