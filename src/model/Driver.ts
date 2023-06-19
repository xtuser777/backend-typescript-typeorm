import { QueryRunner, TypeORMError } from 'typeorm';
import { Driver as DriverEntity, IDriver } from '../entity/Driver';
import { IPerson, Person } from '../entity/Person';
import { BankData, IBankData } from '../entity/BankData';
import { IIndividualPerson, IndividualPerson } from '../entity/IndividualPerson';
import isEmail from 'validator/lib/isEmail';
import { Contact } from '../entity/Contact';
import { EnterprisePerson } from '../entity/EnterprisePerson';
import { Address } from '../entity/Address';

export class Driver implements IDriver {
  private attributes!: IDriver;

  constructor(attributes?: IDriver) {
    if (attributes) this.attributes = attributes;
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

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get bankData(): IBankData {
    return this.attributes.bankData;
  }
  set bankData(v: IBankData) {
    this.attributes.bankData = v;
  }

  get toAttributes(): IDriver {
    const attributes: IDriver = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      this.attributes.bankData.id != 0
    )
      return 'metodo invalido';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';
    if (this.attributes.cnh.length < 11) return 'cnh do motorista invalido';
    if (this.attributes.person.type != 1) return 'tipo de pessoa invalido.';
    if ((this.attributes.person.individual as IIndividualPerson).name.length < 5)
      return 'nome do motorista invalido.';
    if ((this.attributes.person.individual as IIndividualPerson).cpf.length < 14)
      return 'cpf do motorista invalido.';
    if ((this.attributes.person.individual as IIndividualPerson).birth.length < 10)
      return 'data de nascimento invalida.';
    if (this.attributes.person.contact.phone.length < 14) return 'telefone invalido.';
    if (this.attributes.person.contact.cellphone.length < 15) return 'celular invalido.';
    if (!isEmail(this.attributes.person.contact.email)) return 'e-mail invalido.';
    if (this.attributes.person.contact.address.street.length <= 0) return 'rua invalida.';
    if (this.attributes.person.contact.address.number.length <= 0)
      return 'numero do endereco invalido.';
    if (this.attributes.person.contact.address.neighborhood.length <= 0)
      return 'bairro invalido.';
    if (this.attributes.person.contact.address.code.length < 10) return 'cep invalido.';
    if (this.attributes.person.contact.address.city.id <= 0) return 'cidade invalida.';
    try {
      const response = await runner.manager.save(DriverEntity, this.attributes);

      return response ? '' : 'erro ao inserir o motorista';
    } catch (e) {
      console.error(e);

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
    if ((this.attributes.person.individual as IIndividualPerson).name.length < 5)
      return 'nome do motorista invalido.';
    if ((this.attributes.person.individual as IIndividualPerson).cpf.length < 14)
      return 'cpf do motorista invalido.';
    if ((this.attributes.person.individual as IIndividualPerson).birth.length < 10)
      return 'data de cadastro invalida.';
    if (this.attributes.person.contact.phone.length < 14) return 'telefone invalido.';
    if (this.attributes.person.contact.cellphone.length < 15) return 'celular invalido.';
    if (!isEmail(this.attributes.person.contact.email)) return 'e-mail invalido.';
    if (this.attributes.person.contact.address.street.length <= 0) return 'rua invalida.';
    if (this.attributes.person.contact.address.number.length <= 0)
      return 'numero do endereco invalido.';
    if (this.attributes.person.contact.address.neighborhood.length <= 0)
      return 'bairro invalido.';
    if (this.attributes.person.contact.address.code.length < 10) return 'cep invalido.';
    if (this.attributes.person.contact.address.city.id <= 0) return 'cidade invalida.';
    try {
      const response = await runner.manager.save(DriverEntity, this.attributes);

      return response ? '' : 'erro ao atualizar o motorista';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'registro invalido';
    try {
      const response = await runner.manager.remove(DriverEntity, this.attributes);
      if (!response) 'erro ao remover o motorista.';

      const response0 = await runner.manager.remove(BankData, this.attributes.bankData);
      if (!response0) 'erro ao remover os dados bancários.';

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
      const entity = await runner.manager.findOne(DriverEntity, {
        where: { id },
        relations: {
          person: {
            individual: true,
            enterprise: true,
            contact: { address: { city: { state: true } } },
          },
          bankData: true,
        },
      });

      return entity ? new Driver(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(DriverEntity, {
        relations: {
          person: {
            individual: true,
            enterprise: true,
            contact: { address: { city: { state: true } } },
          },
          bankData: true,
        },
      });
      const drivers: Driver[] = [];
      for (const entity of entities) drivers.push(new Driver(entity));

      return drivers;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
