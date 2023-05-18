import { Employee } from '../entity/Employee';
import { Level } from '../entity/Level';
import { Person } from '../entity/Person';

export class EmployeeModel {
  private attributes: Employee;
  private _password: string;

  constructor(attributes: Employee) {
    this.attributes = attributes;
    this._password = '';
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get type(): number {
    return this.attributes.type;
  }
  set type(v: number) {
    this.attributes.type = v;
  }

  get login(): string {
    return this.attributes.login;
  }
  set login(v: string) {
    this.attributes.login = v;
  }

  get password(): string {
    return this._password;
  }
  set password(v: string) {
    this._password = v;
  }

  get admission(): string {
    return this.attributes.admission;
  }
  set admission(v: string) {
    this.attributes.admission = v;
  }

  get demission(): string | undefined {
    return this.attributes.demission;
  }
  set demission(v: string | undefined) {
    this.attributes.demission = v;
  }

  get person(): Person {
    return this.attributes.person;
  }
  set person(v: Person) {
    this.attributes.person = v;
  }

  get level(): Level {
    return this.attributes.level;
  }
  set level(v: Level) {
    this.attributes.level = v;
  }

  get toAttributes(): Employee {
    return this.attributes;
  }
}
