import isEmail from 'validator/lib/isEmail';
import { IEmployee, Employee as EmployeeEntity } from '../entity/Employee';
import { ILevel } from '../entity/Level';
import { IPerson, Person } from '../entity/Person';
import bcryptjs from 'bcryptjs';
import { QueryRunner, TypeORMError } from 'typeorm';
import { IIndividualPerson, IndividualPerson } from '../entity/IndividualPerson';
import { Address } from '../entity/Address';
import { Contact } from '../entity/Contact';
import { EnterprisePerson } from '../entity/EnterprisePerson';

export class Employee implements IEmployee {
  private attributes!: IEmployee;
  private _password?: string;

  constructor(attributes?: IEmployee) {
    if (attributes) this.attributes = attributes;
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

  get passwordHash(): string {
    return this.attributes.passwordHash;
  }
  set passwordHash(v: string) {
    this.attributes.passwordHash = v;
  }

  get password(): string | undefined {
    return this._password;
  }
  set password(v: string | undefined) {
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

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get level(): ILevel {
    return this.attributes.level;
  }
  set level(v: ILevel) {
    this.attributes.level = v;
  }

  get toAttributes(): IEmployee {
    const attributes: IEmployee = { ...this.attributes };
    return attributes;
  }

  autenticate = async (password: string) =>
    await bcryptjs.compare(password, this.attributes.passwordHash);

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      this.attributes.person.contact.id != 0 ||
      this.attributes.person.contact.address.id != 0 ||
      (this.attributes.person.individual as IIndividualPerson).id != 0
    )
      return 'operação incorreta.';
    if (this.attributes.type <= 0 || this.attributes.type > 2)
      return 'tipo de funcionário inválido.';
    if (this.type == 1 && this.attributes.login.length < 3) return 'login inválido.';
    if (
      this.type == 1 &&
      (!this._password || (this._password && this._password.length < 6))
    )
      return 'senha inválida.';
    if (this.attributes.admission.length < 10) return 'data de admissão inválida.';
    if (this.attributes.level.id <= 0) return 'nível de funcionário inválido.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa inválido';
    if ((this.attributes.person.individual as IIndividualPerson).name.length < 5)
      return 'nome do funcionário inválido.';
    if ((this.attributes.person.individual as IIndividualPerson).cpf.length < 14)
      return 'cpf do funcionário inválido.';
    if ((this.attributes.person.individual as IIndividualPerson).birth.length < 10)
      return 'data de nascimento inválida.';

    if (this.attributes.person.contact.phone.length < 14)
      return 'telefone do funcionário inválido.';
    if (this.attributes.person.contact.cellphone.length < 15)
      return 'celular do funcionário inválido.';
    if (
      this.attributes.person.contact.email.length < 5 ||
      !isEmail(this.attributes.person.contact.email)
    )
      return 'e-mail inválido.';

    if (this.attributes.person.contact.address.street.length <= 0) return 'rua inválida';
    if (this.attributes.person.contact.address.number.length <= 0)
      return 'número inválido';
    if (this.attributes.person.contact.address.neighborhood.length <= 0)
      return 'bairro ou distrito inválido.';
    if (this.attributes.person.contact.address.code.length < 10) return 'cep inválido';
    if (this.attributes.person.contact.address.city.id <= 0) return 'cidade inválida';

    if (this._password)
      this.attributes.passwordHash = await bcryptjs.hash(this._password, 8);
    else this.attributes.passwordHash = '';

    try {
      const response = await runner.manager.save(EmployeeEntity, this.attributes);
      return response ? '' : 'erro ao inserir o funcionário';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (
      this.attributes.id == 0 ||
      this.attributes.person.id == 0 ||
      (this.attributes.person.individual as IIndividualPerson).id == 0 ||
      this.attributes.person.contact.id == 0 ||
      this.attributes.person.contact.address.id == 0
    )
      return 'operação incorreta.';
    if (this.attributes.type <= 0 || this.attributes.type > 2)
      return 'tipo de funcionário inválido.';
    if (this.type == 1 && this.attributes.login.length < 3) return 'login inválido.';
    if (this.attributes.admission.length < 10) return 'data de admissão inválida.';
    if (this.attributes.level.id <= 0) return 'nível de funcionário inválido.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa inválido';
    if ((this.attributes.person.individual as IIndividualPerson).name.length < 5)
      return 'nome do funcionário inválido.';
    if ((this.attributes.person.individual as IIndividualPerson).cpf.length < 14)
      return 'cpf do funcionário inválido.';
    if ((this.attributes.person.individual as IIndividualPerson).birth.length < 10)
      return 'data de nascimento inválida.';

    if (this.attributes.person.contact.phone.length < 14)
      return 'telefone do funcionário inválido.';
    if (this.attributes.person.contact.cellphone.length < 15)
      return 'celular do funcionário inválido.';
    if (
      this.attributes.person.contact.email.length < 5 ||
      !isEmail(this.attributes.person.contact.email)
    )
      return 'e-mail inválido.';

    if (this.attributes.person.contact.address.street.length <= 0) return 'rua inválida';
    if (this.attributes.person.contact.address.number.length <= 0)
      return 'número inválido';
    if (this.attributes.person.contact.address.neighborhood.length <= 0)
      return 'bairro ou distrito inválido.';
    if (this.attributes.person.contact.address.code.length < 10) return 'cep inválido';
    if (this.attributes.person.contact.address.city.id <= 0) return 'cidade inválida';

    if (this._password)
      this.attributes.passwordHash = await bcryptjs.hash(this._password, 8);
    else this.attributes.passwordHash = '';

    try {
      const response = await runner.manager.save(EmployeeEntity, this.attributes);
      return response ? '' : 'erro ao atualizar o funcionário';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro incorreto.';

    try {
      const response = await runner.manager.remove(EmployeeEntity, this.attributes);
      if (!response) 'erro ao remover o funcionário.';

      const response1 = await runner.manager.remove(Person, this.attributes.person);
      if (!response1) 'erro ao remover a pessoa.';

      const response2 = await runner.manager.remove(
        Contact,
        this.attributes.person.contact,
      );
      if (!response2) 'erro ao remover o contato.';

      const response3 = await runner.manager.remove(
        IndividualPerson,
        this.attributes.person.individual,
      );
      if (!response3) 'erro ao remover a pessoa.';

      const response4 = await runner.manager.remove(
        Address,
        this.attributes.person.contact.address,
      );
      return response4 ? '' : 'erro ao remover o endereço.';
    } catch (e) {
      console.error(e);
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

      return [];
    }
  }
}
