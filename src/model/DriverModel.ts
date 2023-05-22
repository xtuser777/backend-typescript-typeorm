import { QueryRunner, TypeORMError } from 'typeorm';
import { Driver } from '../entity/Driver';
import { Person } from '../entity/Person';
import { BankData } from '../entity/BankData';
import { IndividualPerson } from '../entity/IndividualPerson';
import isEmail from 'validator/lib/isEmail';

export class DriverModel {
  private attributes: Driver;

  constructor(attributes?: Driver) {
    this.attributes = attributes
      ? attributes
      : { id: 0, register: '', cnh: '', person: new Person(), bankData: new BankData() };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get register(): string {
    return this.attributes.register;
  }
  set register(v: string) {
    this.attributes.register = v;
  }

  get cnh(): string {
    return this.attributes.cnh;
  }
  set cnh(v: string) {
    this.attributes.cnh = v;
  }

  get person(): Person {
    return this.attributes.person;
  }
  set person(v: Person) {
    this.attributes.person = v;
  }

  get bankData(): BankData {
    return this.attributes.bankData;
  }
  set bankData(v: BankData) {
    this.attributes.bankData = v;
  }

  get toAttributes(): Driver {
    return this.attributes;
  }

  async save(runner: QueryRunner) {
    console.log(this.attributes);
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      this.attributes.bankData.id != 0
    )
      return 'metodo invalido';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';
    if (this.attributes.cnh.length < 11) return 'cnh do motorista invalido';
    if (this.attributes.person.type != 1) return 'tipo de pessoa invalido.';

    if ((this.attributes.person.individual as IndividualPerson).name.length < 5)
      return 'nome do motorista invalido.';
    if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14)
      return 'cpf do motorista invalido.';
    if ((this.attributes.person.individual as IndividualPerson).birth.length < 10)
      return 'data de nascimento invalida.';

    if ((this.attributes.person.individual as IndividualPerson).contact.phone.length < 14)
      return 'telefone invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.cellphone.length <
      15
    )
      return 'celular invalido.';
    if (!isEmail((this.attributes.person.individual as IndividualPerson).contact.email))
      return 'e-mail invalido.';

    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.street
        .length <= 0
    )
      return 'rua invalida.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.number
        .length <= 0
    )
      return 'numero do endereco invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.neighborhood
        .length <= 0
    )
      return 'bairro invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.code
        .length < 10
    )
      return 'cep invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.city.id <= 0
    )
      return 'cidade invalida.';

    try {
      const response = await runner.manager.save(Driver, this.attributes);
      return response ? '' : 'erro ao inserir o motorista';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (
      this.attributes.id <= 0 ||
      this.attributes.person.id <= 0 ||
      this.attributes.bankData.id <= 0
    )
      return 'metodo invalido';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';
    if (this.attributes.cnh.length < 11) return 'cnh do motorista invalido';
    if (this.attributes.person.type != 1) return 'tipo de pessoa invalido.';

    if ((this.attributes.person.individual as IndividualPerson).name.length < 5)
      return 'nome do motorista invalido.';
    if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14)
      return 'cpf do motorista invalido.';
    if ((this.attributes.person.individual as IndividualPerson).birth.length < 10)
      return 'data de cadastro invalida.';

    if ((this.attributes.person.individual as IndividualPerson).contact.phone.length < 14)
      return 'telefone invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.cellphone.length <
      15
    )
      return 'celular invalido.';
    if (!isEmail((this.attributes.person.individual as IndividualPerson).contact.email))
      return 'e-mail invalido.';

    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.street
        .length <= 0
    )
      return 'rua invalida.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.number
        .length <= 0
    )
      return 'numero do endereco invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.neighborhood
        .length <= 0
    )
      return 'bairro invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.code
        .length < 10
    )
      return 'cep invalido.';
    if (
      (this.attributes.person.individual as IndividualPerson).contact.address.city.id <= 0
    )
      return 'cidade invalida.';

    try {
      const response = await runner.manager.save(Driver, this.attributes);
      return response ? '' : 'erro ao atualizar o motorista';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro invalido';

    try {
      const response = await runner.manager.remove(this.attributes);

      return response ? '' : 'erro ao remover o motorista.';
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
      const entity = await runner.manager.findOne(Driver, {
        where: { id },
        relations: {
          person: {
            individual: { contact: { address: { city: { state: true } } } },
            enterprise: { contact: { address: { city: { state: true } } } },
          },
          bankData: true,
        },
      });

      return entity ? new DriverModel(entity) : undefined;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(Driver, {
        relations: {
          person: {
            individual: { contact: { address: { city: { state: true } } } },
            enterprise: { contact: { address: { city: { state: true } } } },
          },
          bankData: true,
        },
      });
      const drivers: DriverModel[] = [];
      for (const entity of entities) drivers.push(new DriverModel(entity));

      return drivers;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return [];
    }
  }
}
