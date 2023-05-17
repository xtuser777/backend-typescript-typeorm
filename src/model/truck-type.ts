export class TruckType {
  constructor(
    private id: number = 0,
    private description: string = '',
    private axes: number = 0,
    private capacity: number = 0,
  ) {}

  getId = (): number => this.id;
  getDescription = (): string => this.description;
  getAxes = (): number => this.axes;
  getCapacity = (): number => this.capacity;
}
