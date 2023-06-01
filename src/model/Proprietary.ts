import { QueryRunner, TypeORMError } from 'typeorm';
import { IDriver } from '../entity/Driver';
import { IPerson } from '../entity/Person';
import { IProprietary, Proprietary as ProprietaryEntity } from '../entity/Proprietary';
import { IIndividualPerson } from '../entity/IndividualPerson';
import { IEnterprisePerson } from '../entity/EnterprisePerson';
import isEmail from 'validator/lib/isEmail';

export class Proprietary implements IProprietary {
  private attributes!: IProprietary;

  constructor(attributes?: IProprietary) {
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

  get driver(): IDriver | undefined {
    return this.attributes.driver;
  }
  set driver(v: IDriver | undefined) {
    this.attributes.driver = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IProprietary {
    const attributes: IProprietary = { ...this.attributes };
    return attributes;
  }

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      (this.attributes.person.type == 1
        ? (this.attributes.person.individual as IIndividualPerson).id != 0
        : (this.attributes.person.enterprise as IEnterprisePerson).id != 0)
    )
      return 'metodo incorreto;';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa invalido';
    if (this.attributes.person.type == 1) {
      if ((this.attributes.person.individual as IIndividualPerson).name.length < 3)
        return 'nome invalido.';
      if ((this.attributes.person.individual as IIndividualPerson).cpf.length < 14)
        return 'cpf invalido';
      if ((this.attributes.person.individual as IIndividualPerson).birth.length < 10)
        return 'data de nascimento invalida.';

      if (this.attributes.person.contact.address.street.length <= 0)
        return 'rua invalida';
      if (this.attributes.person.contact.address.number.length <= 0)
        return 'numero do endereco invalido';
      if (this.attributes.person.contact.address.neighborhood.length <= 0)
        return 'bairro/distrito invalido';
      if (this.attributes.person.contact.address.code.length < 10) return 'cep invalido';
      if (this.attributes.person.contact.address.city.id <= 0) return 'cidade invalida';

      if (this.attributes.person.contact.phone.length < 14) return 'telefone invalido';
      if (this.attributes.person.contact.cellphone.length < 15) return 'celular invalido';
      if (!isEmail(this.attributes.person.contact.email)) return 'e-mail invalido';
    } else {
      if (
        (this.attributes.person.enterprise as IEnterprisePerson).corporateName.length < 3
      )
        return 'razao social invalida.';
      if ((this.attributes.person.enterprise as IEnterprisePerson).fantasyName.length < 2)
        return 'nome fantasia invalido';
      if ((this.attributes.person.enterprise as IEnterprisePerson).cnpj.length < 18)
        return 'cnpj invalido.';

      if (this.attributes.person.contact.address.street.length <= 0)
        return 'rua invalida';
      if (this.attributes.person.contact.address.number.length <= 0)
        return 'numero do endereco invalido';
      if (this.attributes.person.contact.address.neighborhood.length <= 0)
        return 'bairro/distrito invalido';
      if (this.attributes.person.contact.address.code.length < 10) return 'cep invalido';
      if (this.attributes.person.contact.address.city.id <= 0) return 'cidade invalida';

      if (this.attributes.person.contact.phone.length < 14) return 'telefone invalido';
      if (this.attributes.person.contact.cellphone.length < 15) return 'celular invalido';
      if (!isEmail(this.attributes.person.contact.email)) return 'e-mail invalido';
    }

    try {
      const response = await runner.manager.save(ProprietaryEntity, this.attributes);

      return response ? '' : 'erro ao inserir o proprietario';
    } catch (e) {
      console.error(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (
      this.attributes.id <= 0 ||
      this.attributes.person.id <= 0 ||
      (this.attributes.person.type == 1
        ? (this.attributes.person.individual as IIndividualPerson).id <= 0
        : (this.attributes.person.enterprise as IEnterprisePerson).id <= 0)
    )
      return 'metodo incorreto;';
    if (this.attributes.register.length < 10) return 'data de cadastro invalida.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa invalido';
    if (this.attributes.person.type == 1) {
      if ((this.attributes.person.individual as IIndividualPerson).name.length < 3)
        return 'nome invalido.';
      if ((this.attributes.person.individual as IIndividualPerson).cpf.length < 14)
        return 'cpf invalido';
      if ((this.attributes.person.individual as IIndividualPerson).birth.length < 10)
        return 'data de nascimento invalida.';

      if (this.attributes.person.contact.address.street.length <= 0)
        return 'rua invalida';
      if (this.attributes.person.contact.address.number.length <= 0)
        return 'numero do endereco invalido';
      if (this.attributes.person.contact.address.neighborhood.length <= 0)
        return 'bairro/distrito invalido';
      if (this.attributes.person.contact.address.code.length < 10) return 'cep invalido';
      if (this.attributes.person.contact.address.city.id <= 0) return 'cidade invalida';

      if (this.attributes.person.contact.phone.length < 14) return 'telefone invalido';
      if (this.attributes.person.contact.cellphone.length < 15) return 'celular invalido';
      if (!isEmail(this.attributes.person.contact.email)) return 'e-mail invalido';
    } else {
      if (
        (this.attributes.person.enterprise as IEnterprisePerson).corporateName.length < 3
      )
        return 'razao social invalida.';
      if ((this.attributes.person.enterprise as IEnterprisePerson).fantasyName.length < 2)
        return 'nome fantasia invalido';
      if ((this.attributes.person.enterprise as IEnterprisePerson).cnpj.length < 18)
        return 'cnpj invalido.';

      if (this.attributes.person.contact.address.street.length <= 0)
        return 'rua invalida';
      if (this.attributes.person.contact.address.number.length <= 0)
        return 'numero do endereco invalido';
      if (this.attributes.person.contact.address.neighborhood.length <= 0)
        return 'bairro/distrito invalido';
      if (this.attributes.person.contact.address.code.length < 10) return 'cep invalido';
      if (this.attributes.person.contact.address.city.id <= 0) return 'cidade invalida';

      if (this.attributes.person.contact.phone.length < 14) return 'telefone invalido';
      if (this.attributes.person.contact.cellphone.length < 15) return 'celular invalido';
      if (!isEmail(this.attributes.person.contact.email)) return 'e-mail invalido';
    }

    try {
      const response = await runner.manager.save(ProprietaryEntity, this.attributes);

      return response ? '' : 'erro ao atualizar o proprietario';
    } catch (e) {
      console.error(e);

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

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(ProprietaryEntity, {
        where: { id },
        relations: {
          driver: {
            person: { individual: true, contact: { address: { city: { state: true } } } },
          },
          person: {
            individual: true,
            enterprise: true,
            contact: { address: { city: { state: true } } },
          },
        },
      });

      return entity ? new Proprietary(entity) : undefined;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(ProprietaryEntity, {
        relations: {
          driver: {
            person: { individual: true, contact: { address: { city: { state: true } } } },
          },
          person: {
            individual: true,
            enterprise: true,
            contact: { address: { city: { state: true } } },
          },
        },
      });
      const proprietaries: Proprietary[] = [];
      for (const entity of entities) proprietaries.push(new Proprietary(entity));

      return proprietaries;
    } catch (e) {
      console.error(e);

      return [];
    }
  }
}
