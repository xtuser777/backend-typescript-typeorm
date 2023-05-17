export class Contact {
  constructor(
    private id: number = 0,
    private phone: string = '',
    private cellphone: string = '',
    private email: string = '',
    private addressId: number = 0,
  ) {}

  getId = () => this.id;
  getPhone = () => this.phone;
  getCellphone = () => this.cellphone;
  getEmail = () => this.email;
  getAddressId = () => this.addressId;
}
