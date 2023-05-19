import isEmail from 'validator/lib/isEmail';
import { Employee } from '../entity/Employee';
import { Level } from '../entity/Level';
import { Person } from '../entity/Person';
import bcryptjs from 'bcryptjs';
import { QueryRunner, TypeORMError } from 'typeorm';
import { IndividualPerson } from '../entity/IndividualPerson';

export class EmployeeModel {
  private attributes: Employee;
  private _password?: string;

  constructor(attributes?: Employee) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          type: 0,
          login: '',
          passwordHash: '',
          admission: '',
          demission: undefined,
          person: new Person(),
          level: new Level(),
        };
    this._password = undefined;
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

  autenticate = async (password: string) =>
    await bcryptjs.compare(password, this.attributes.passwordHash);

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      (this.attributes.person.individual as IndividualPerson).id != 0 ||
      (this.attributes.person.individual as IndividualPerson).contact.id != 0 ||
      (this.attributes.person.individual as IndividualPerson).contact.address.id != 0
    )
      return 'operação incorreta.';
    if (this.attributes.type <= 0 || this.attributes.type > 2)
      return 'tipo de funcionário inválido.';
    if (this.attributes.login.length < 3) return 'login inválido.';
    if (!this._password || (this._password && this._password.length < 6))
      return 'senha inválida.';
    if (this.attributes.admission.length < 10) return 'data de admissão inválida.';
    if (this.attributes.level.id <= 0) return 'nível de funcionário inválido.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa inválido';
    if ((this.attributes.person.individual as IndividualPerson).name.length < 5)
      return 'nome do funcionário inválido.';
    if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14)
      return 'cpf do funcionário inválido.';
    if ((this.attributes.person.individual as IndividualPerson).birth.length < 10)
      return 'data de nascimento inválida.';

    if ((this.attributes.person.individual as IndividualPerson).contact.phone.length < 14)
      return 'telefone do funcionário inválido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.cellphone.length <
      15
    )
      return 'celular do funcionário inválido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.email.length < 5 ||
      !isEmail((this.attributes.person.individual as IndividualPerson).contact.email)
    )
      return 'e-mail inválido.';

    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.street
        .length <= 0
    )
      return 'rua inválida';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.number
        .length <= 0
    )
      return 'número inválido';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.neighborhood
        .length <= 0
    )
      return 'bairro ou distrito inválido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.code
        .length < 10
    )
      return 'cep inválido';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.city.id <= 0
    )
      return 'cidade inválida';

    if (this._password)
      this.attributes.passwordHash = await bcryptjs.hash(this._password, 8);

    try {
      const response = await runner.manager.save(Employee, this.attributes);
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
      this.attributes.id == 0 ||
      this.attributes.person.id == 0 ||
      (this.attributes.person.individual as IndividualPerson).id == 0 ||
      (this.attributes.person.individual as IndividualPerson).contact.id == 0 ||
      (this.attributes.person.individual as IndividualPerson).contact.address.id == 0
    )
      return 'operação incorreta.';
    if (this.attributes.type <= 0 || this.attributes.type > 2)
      return 'tipo de funcionário inválido.';
    if (this.attributes.login.length < 3) return 'login inválido.';
    if (this.attributes.admission.length < 10) return 'data de admissão inválida.';
    if (this.attributes.level.id <= 0) return 'nível de funcionário inválido.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa inválido';
    if ((this.attributes.person.individual as IndividualPerson).name.length < 5)
      return 'nome do funcionário inválido.';
    if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14)
      return 'cpf do funcionário inválido.';
    if ((this.attributes.person.individual as IndividualPerson).birth.length < 10)
      return 'data de nascimento inválida.';

    if ((this.attributes.person.individual as IndividualPerson).contact.phone.length < 14)
      return 'telefone do funcionário inválido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.cellphone.length <
      15
    )
      return 'celular do funcionário inválido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.email.length < 5 ||
      !isEmail((this.attributes.person.individual as IndividualPerson).contact.email)
    )
      return 'e-mail inválido.';

    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.street
        .length <= 0
    )
      return 'rua inválida';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.number
        .length <= 0
    )
      return 'número inválido';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.neighborhood
        .length <= 0
    )
      return 'bairro ou distrito inválido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.code
        .length < 10
    )
      return 'cep inválido';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.city.id <= 0
    )
      return 'cidade inválida';

    if (this._password)
      this.attributes.passwordHash = await bcryptjs.hash(this._password, 8);

    try {
      const response = await runner.manager.save(Employee, this.attributes);
      return response ? '' : 'erro ao atualizar o funcionário';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro incorreto.';

    try {
      const response = await runner.manager.remove(this.attributes);

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
      const entity = await runner.manager.findOne(Employee, {
        relations: {
          level: true,
          person: { individual: { contact: { address: { city: { state: true } } } } },
        },
        where: { id },
      });

      return entity ? new EmployeeModel(entity) : undefined;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return undefined;
    }
  }

  async find(runner: QueryRunner, params?: { login: string; demission?: string }) {
    try {
      const entities = await runner.manager.find(Employee, {
        relations: {
          level: true,
          person: { individual: { contact: { address: { city: { state: true } } } } },
        },
        where: params,
      });
      const employees: EmployeeModel[] = [];
      for (const entity of entities) {
        employees.push(new EmployeeModel(entity));
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
