import { QueryRunner } from 'typeorm';
import { Driver } from '../Driver';

export class DriverModel {
  private attribute: Driver;
  
  constructor(attributes?: Driver) {
    this.attributes = attributes ? attributes : { id: 0, register: '', cnh: '', person: new Person(), bankData: new BankData() }
  }

  get id(): number { return this.attributes.id; }
  set id(v: number) { this.attributes.id = v; }

  get register(): { return this.attributes.register; }
  set register(v: string) { this.attributes.register = v; }

  get cnh(): string { return this.attributes.cnh; }
  set cnh(v: string) { this.attributes.cnh = v; }
}
