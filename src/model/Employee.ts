import isEmail from 'validator/lib/isEmail';
import { IEmployee, Employee as EmployeeEntity } from '../entity/Employee';
import { ILevel, Level } from '../entity/Level';
import { IPerson, Person } from '../entity/Person';
import bcryptjs from 'bcryptjs';
import { QueryRunner, TypeORMError } from 'typeorm';
import { IIndividualPerson } from '../entity/IndividualPerson';

export class Employee implements IEmployee {
  private _id: number;
  private _type: number;
  private _login: string;
  private _passwordHash: string;
  private _password?: string;
  private _admission: string;
  private _demission?: string;
  private _person!: IPerson;
  private _level!: ILevel;

  constructor(value?: IEmployee) {
    this._id = value ? value.id : 0;
    this._type = value ? value.type : 0;
    this._login = value ? value.login : '';
    this._passwordHash = value ? value.passwordHash : '';
    this._password = undefined;
    this._admission = value ? value.admission : '';
    this._demission = value ? value.demission : undefined;
    if (value) {
      this._person = value.person;
      this._level = value.level;
    }
  }

  get id(): number {
    return this._id;
  }
  set id(v: number) {
    this._id = v;
  }

  get type(): number {
    return this._type;
  }
  set type(v: number) {
    this._type = v;
  }

  get login(): string {
    return this._login;
  }
  set login(v: string) {
    this._login = v;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }
  set passwordHash(v: string) {
    this._passwordHash = v;
  }

  get password(): string | undefined {
    return this._password;
  }
  set password(v: string | undefined) {
    this._password = v;
  }

  get admission(): string {
    return this._admission;
  }
  set admission(v: string) {
    this._admission = v;
  }

  get demission(): string | undefined {
    return this._demission;
  }
  set demission(v: string | undefined) {
    this._demission = v;
  }

  get person(): IPerson {
    return this._person;
  }
  set person(v: IPerson) {
    this._person = v;
  }

  get level(): ILevel {
    return this._level;
  }
  set level(v: ILevel) {
    this._level = v;
  }

  autenticate = async (password: string) =>
    await bcryptjs.compare(password, this._passwordHash);

  async save(runner: QueryRunner) {
    if (
      this._id != 0 ||
      this._person.id != 0 ||
      this._person.contact.id != 0 ||
      this._person.contact.address.id != 0 ||
      (this._person.individual as IIndividualPerson).id != 0
    )
      return 'operação incorreta.';
    if (this._type <= 0 || this._type > 2) return 'tipo de funcionário inválido.';
    if (this._login.length < 3) return 'login inválido.';
    if (!this._password || (this._password && this._password.length < 6))
      return 'senha inválida.';
    if (this._admission.length < 10) return 'data de admissão inválida.';
    if (this._level.id <= 0) return 'nível de funcionário inválido.';

    if (this._person.type <= 0 || this._person.type > 2) return 'tipo de pessoa inválido';
    if ((this._person.individual as IIndividualPerson).name.length < 5)
      return 'nome do funcionário inválido.';
    if ((this._person.individual as IIndividualPerson).cpf.length < 14)
      return 'cpf do funcionário inválido.';
    if ((this._person.individual as IIndividualPerson).birth.length < 10)
      return 'data de nascimento inválida.';

    if (this._person.contact.phone.length < 14)
      return 'telefone do funcionário inválido.';
    if (this._person.contact.cellphone.length < 15)
      return 'celular do funcionário inválido.';
    if (this._person.contact.email.length < 5 || !isEmail(this._person.contact.email))
      return 'e-mail inválido.';

    if (this._person.contact.address.street.length <= 0) return 'rua inválida';
    if (this._person.contact.address.number.length <= 0) return 'número inválido';
    if (this._person.contact.address.neighborhood.length <= 0)
      return 'bairro ou distrito inválido.';
    if (this._person.contact.address.code.length < 10) return 'cep inválido';
    if (this._person.contact.address.city.id <= 0) return 'cidade inválida';

    if (this._password) this._passwordHash = await bcryptjs.hash(this._password, 8);

    try {
      const response = await runner.manager.save(EmployeeEntity, this);
      return response ? '' : 'erro ao inserir o funcionário';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (
      this._id == 0 ||
      this._person.id == 0 ||
      (this._person.individual as IIndividualPerson).id == 0 ||
      this._person.contact.id == 0 ||
      this._person.contact.address.id == 0
    )
      return 'operação incorreta.';
    if (this._type <= 0 || this._type > 2) return 'tipo de funcionário inválido.';
    if (this._login.length < 3) return 'login inválido.';
    if (this._admission.length < 10) return 'data de admissão inválida.';
    if (this._level.id <= 0) return 'nível de funcionário inválido.';

    if (this._person.type <= 0 || this._person.type > 2) return 'tipo de pessoa inválido';
    if ((this._person.individual as IIndividualPerson).name.length < 5)
      return 'nome do funcionário inválido.';
    if ((this._person.individual as IIndividualPerson).cpf.length < 14)
      return 'cpf do funcionário inválido.';
    if ((this._person.individual as IIndividualPerson).birth.length < 10)
      return 'data de nascimento inválida.';

    if (this._person.contact.phone.length < 14)
      return 'telefone do funcionário inválido.';
    if (this._person.contact.cellphone.length < 15)
      return 'celular do funcionário inválido.';
    if (this._person.contact.email.length < 5 || !isEmail(this._person.contact.email))
      return 'e-mail inválido.';

    if (this._person.contact.address.street.length <= 0) return 'rua inválida';
    if (this._person.contact.address.number.length <= 0) return 'número inválido';
    if (this._person.contact.address.neighborhood.length <= 0)
      return 'bairro ou distrito inválido.';
    if (this._person.contact.address.code.length < 10) return 'cep inválido';
    if (this._person.contact.address.city.id <= 0) return 'cidade inválida';

    if (this._password) this._passwordHash = await bcryptjs.hash(this._password, 8);

    try {
      const response = await runner.manager.save(EmployeeEntity, this);
      return response ? '' : 'erro ao atualizar o funcionário';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this._id <= 0) return 'registro incorreto.';

    try {
      const response = await runner.manager.remove(EmployeeEntity, this);

      return response ? '' : 'erro ao remover o funcionário.';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(EmployeeEntity, {
        relations: {
          level: true,
          person: { individual: true, contact: { address: { city: { state: true } } } },
        },
        where: { id },
      });

      return entity ? new Employee(entity) : undefined;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return undefined;
    }
  }

  async find(runner: QueryRunner, params?: { login: string; demission?: string }) {
    try {
      const entities = await runner.manager.find(EmployeeEntity, {
        relations: {
          level: true,
          person: { individual: true, contact: { address: { city: { state: true } } } },
        },
        where: params,
      });
      const employees: Employee[] = [];
      for (const entity of entities) {
        employees.push(new Employee(entity));
      }

      return employees;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return [];
    }
  }
}
