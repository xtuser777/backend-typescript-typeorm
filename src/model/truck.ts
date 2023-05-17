export class Truck {
  constructor(
    private id: number = 0,
    private plate: string = '',
    private brand: string = '',
    private model: string = '',
    private color: string = '',
    private manufactureYear: number = 0,
    private modelYear: number = 0,
    private typeId: number = 0,
    private proprietaryId: number = 0,
  ) {}

  getId = () => this.id;
  getPlate = () => this.plate;
  getBrand = () => this.brand;
  getModel = () => this.model;
  getColor = () => this.color;
  getManufactureYear = () => this.manufactureYear;
  getModelYear = () => this.modelYear;
  getTypeId = () => this.typeId;
  getProprietaryId = () => this.proprietaryId;
}
