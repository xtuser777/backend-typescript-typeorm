import { QueryRunner, TypeORMError } from 'typeorm';
import { Driver } from '../entity/Driver';
import { Person } from '../entity/Person';
import { Proprietary } from '../entity/Proprietary';
import { IndividualPerson } from '../entity/IndividualPerson';
import { EnterprisePerson } from '../entity/EnterprisePerson';
import isEmail from 'validator/lib/isEmail';

export class ProprietaryModel {
  private attributes: Proprietary;

  constructor(attributes: Proprietary) {
    this.attributes = attributes
      ? attributes
      : { id: 0, register: '', driver: new Driver(), person: new Person() };
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

  get driver(): Driver | undefined {
    return this.attributes.driver;
  }
  set driver(v: Driver | undefined) {
    this.attributes.driver = v;
  }

  get person(): Person {
    return this.attributes.person;
  }
  set person(v: Person) {
    this.attributes.person = v;
  }

  get toAttributes(): Proprietary {
    return this.attributes;
  }

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      (this.attributes.person.type == 1
        ? (this.attributes.person.individual as IndividualPerson).id != 0
        : (this.attributes.person.enterprise as EnterprisePerson).id != 0)
    )
      return 'metodo incorreto;';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa invalido';
    if (this.attributes.person.type == 1) {
      if ((this.attributes.person.individual as IndividualPerson).name.length < 3)
        return 'nome invalido.';
      if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14)
        return 'cpf invalido';
      if ((this.attributes.person.individual as IndividualPerson).birth.length < 10)
        return 'data de nascimento invalida.';

      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.street
          .length <= 0
      )
        return 'rua invalida';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.number
          .length <= 0
      )
        return 'numero do endereco invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address
          .neighborhood.length <= 0
      )
        return 'bairro/distrito invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.code
          .length < 10
      )
        return 'cep invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.city.id <=
        0
      )
        return 'cidade invalida';

      if (
        (this.attributes.person.individual as IndividualPerson).contact.phone.length < 14
      )
        return 'telefone invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.cellphone.length <
        15
      )
        return 'celular invalido';
      if (!isEmail((this.attributes.person.individual as IndividualPerson).contact.email))
        return 'e-mail invalido';
    } else {
      if (
        (this.attributes.person.enterprise as EnterprisePerson).corporateName.length < 3
      )
        return 'razao social invalida.';
      if ((this.attributes.person.enterprise as EnterprisePerson).fantasyName.length < 2)
        return 'nome fantasia invalido';
      if ((this.attributes.person.enterprise as EnterprisePerson).cnpj.length < 18)
        return 'cnpj invalido.';

      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.street
          .length <= 0
      )
        return 'rua invalida';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.number
          .length <= 0
      )
        return 'numero do endereco invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address
          .neighborhood.length <= 0
      )
        return 'bairro/distrito invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.code
          .length < 10
      )
        return 'cep invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.city.id <=
        0
      )
        return 'cidade invalida';

      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.phone.length < 14
      )
        return 'telefone invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.cellphone.length <
        15
      )
        return 'celular invalido';
      if (!isEmail((this.attributes.person.enterprise as EnterprisePerson).contact.email))
        return 'e-mail invalido';
    }

    try {
      const response = await runner.manager.save(Proprietary, this.attributes);
      return response ? '' : 'erro ao inserir o proprietario';
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
      (this.attributes.person.type == 1
        ? (this.attributes.person.individual as IndividualPerson).id <= 0
        : (this.attributes.person.enterprise as EnterprisePerson).id <= 0)
    )
      return 'metodo incorreto;';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa invalido';
    if (this.attributes.person.type == 1) {
      if ((this.attributes.person.individual as IndividualPerson).name.length < 3)
        return 'nome invalido.';
      if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14)
        return 'cpf invalido';
      if ((this.attributes.person.individual as IndividualPerson).birth.length < 10)
        return 'data de nascimento invalida.';

      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.street
          .length <= 0
      )
        return 'rua invalida';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.number
          .length <= 0
      )
        return 'numero do endereco invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address
          .neighborhood.length <= 0
      )
        return 'bairro/distrito invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.code
          .length < 10
      )
        return 'cep invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.address.city.id <=
        0
      )
        return 'cidade invalida';

      if (
        (this.attributes.person.individual as IndividualPerson).contact.phone.length < 14
      )
        return 'telefone invalido';
      if (
        (this.attributes.person.individual as IndividualPerson).contact.cellphone.length <
        15
      )
        return 'celular invalido';
      if (!isEmail((this.attributes.person.individual as IndividualPerson).contact.email))
        return 'e-mail invalido';
    } else {
      if (
        (this.attributes.person.enterprise as EnterprisePerson).corporateName.length < 3
      )
        return 'razao social invalida.';
      if ((this.attributes.person.enterprise as EnterprisePerson).fantasyName.length < 2)
        return 'nome fantasia invalido';
      if ((this.attributes.person.enterprise as EnterprisePerson).cnpj.length < 18)
        return 'cnpj invalido.';

      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.street
          .length <= 0
      )
        return 'rua invalida';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.number
          .length <= 0
      )
        return 'numero do endereco invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address
          .neighborhood.length <= 0
      )
        return 'bairro/distrito invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.code
          .length < 10
      )
        return 'cep invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.address.city.id <=
        0
      )
        return 'cidade invalida';

      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.phone.length < 14
      )
        return 'telefone invalido';
      if (
        (this.attributes.person.enterprise as EnterprisePerson).contact.cellphone.length <
        15
      )
        return 'celular invalido';
      if (!isEmail((this.attributes.person.enterprise as EnterprisePerson).contact.email))
        return 'e-mail invalido';
    }

    try {
      const response = await runner.manager.save(Proprietary, this.attributes);
      return response ? '' : 'erro ao atualizar o proprietario';
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

      return response ? '' : 'erro ao remover o proprietary.';
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
      const entity = await runner.manager.findOne(Proprietary, {
        where: { id },
        relations: {
          driver: {
            person: { individual: { contact: { address: { city: { state: true } } } } },
          },
          person: {
            individual: { contact: { address: { city: { state: true } } } },
            enterprise: { contact: { address: { city: { state: true } } } },
          },
        },
      });

      return entity ? new ProprietaryModel(entity) : undefined;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(Proprietary, {
        relations: {
          driver: {
            person: { individual: { contact: { address: { city: { state: true } } } } },
          },
          person: {
            individual: { contact: { address: { city: { state: true } } } },
            enterprise: { contact: { address: { city: { state: true } } } },
          },
        },
      });
      const proprietaries: ProprietaryModel[] = [];
      for (const entity of entities) proprietaries.push(new ProprietaryModel(entity));

      return proprietaries;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return [];
    }
  }
}
