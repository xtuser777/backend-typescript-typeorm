import { Address } from '../entity/Address';
import { City } from '../entity/City';

export class AddressModel {
  constructor(private attributes: Address) {}

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get street(): string {
    return this.attributes.street;
  }
  set street(v: string) {
    this.attributes.street = v;
  }

  get number(): string {
    return this.attributes.number;
  }
  set number(v: string) {
    this.attributes.number = v;
  }

  get neighborhood(): string {
    return this.attributes.neighborhood;
  }
  set neighborhood(v: string) {
    this.attributes.neighborhood = v;
  }

  get complement(): string {
    return this.attributes.complement;
  }
  set complement(v: string) {
    this.attributes.complement = v;
  }

  get code(): string {
    return this.attributes.code;
  }
  set code(v: string) {
    this.attributes.code = v;
  }

  get city(): City {
    return this.attributes.city;
  }
  set city(v: City) {
    this.attributes.city = v;
  }
}
