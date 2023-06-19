import { QueryRunner, TypeORMError } from 'typeorm';
import { IPerson, Person } from '../entity/Person';
import {
  IRepresentation,
  Representation as RepresentationEntity,
} from '../entity/Representation';
import isEmail from 'validator/lib/isEmail';
import { EnterprisePerson, IEnterprisePerson } from '../entity/EnterprisePerson';
import { Contact } from '../entity/Contact';
import { Address } from '../entity/Address';

export class Representation implements IRepresentation {
  private attributes!: IRepresentation;

  constructor(attributes?: IRepresentation) {
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

  get unity(): string {
    return this.attributes.unity;
  }
  set unity(v: string) {
    this.attributes.unity = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IRepresentation {
    return this.attributes;
  }

  async save(runner: QueryRunner) {
    if (this.attributes.id != 0) return 'método inválido.';
    if (this.attributes.register.length < 10) return 'data de cadastro inválida.';
    if (this.attributes.unity.length <= 0) return 'unidade da representação inválida.';
    if (this.attributes.person.type != 2) return 'tipo de pessoa invalido.';
    if (this.attributes.person.contact.phone.length < 14)
      return 'número de telefone inválido.';
    if (this.attributes.person.contact.cellphone.length < 15)
      return 'número de celular inválido.';
    if (!isEmail(this.attributes.person.contact.email)) return 'e-mail inválido.';
    if (this.attributes.person.contact.address.street.length <= 0) return 'rua inválida.';
    if (this.attributes.person.contact.address.number.length < 1)
      return 'número do endereço inválido.';
    if (this.attributes.person.contact.address.neighborhood.length < 1)
      return 'bairro ou distrito inválido.';
    if (this.attributes.person.contact.address.code.length < 10) return 'cep inválido.';
    if (this.attributes.person.contact.address.city.id <= 0) return 'cidade inválida.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).corporateName.length < 5)
      return 'razão social inválida.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).fantasyName.length < 2)
      return 'nome fantasia inválido.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).cnpj.length < 18)
      return 'cnpj inváiido.';

    try {
      const response = await runner.manager.save(RepresentationEntity, this.attributes);

      return response ? '' : 'erro ao inserir a representação.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async update(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido.';
    if (this.attributes.unity.length <= 0) return 'unidade da representação inválida.';
    if (this.attributes.person.contact.phone.length < 14)
      return 'número de telefone inválido.';
    if (this.attributes.person.contact.cellphone.length < 15)
      return 'número de celular inválido.';
    if (!isEmail(this.attributes.person.contact.email)) return 'e-mail inválido.';
    if (this.attributes.person.contact.address.street.length <= 0) return 'rua inválida.';
    if (this.attributes.person.contact.address.number.length < 1)
      return 'número do endereço inválido.';
    if (this.attributes.person.contact.address.neighborhood.length < 1)
      return 'bairro ou distrito inválido.';
    if (this.attributes.person.contact.address.code.length < 10) return 'cep inválido.';
    if (this.attributes.person.contact.address.city.id <= 0) return 'cidade inválida.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).corporateName.length < 5)
      return 'razão social inválida.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).fantasyName.length < 2)
      return 'nome fantasia inválido.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).cnpj.length < 18)
      return 'cnpj inváiido.';

    try {
      const response = await runner.manager.save(RepresentationEntity, this.attributes);

      return response ? '' : 'erro ao atualizar a representação.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async delete(runner: QueryRunner) {
    if (this.attributes.id <= 0) return 'método inválido.';

    try {
      const response = await runner.manager.remove(RepresentationEntity, this.attributes);
      if (!response) 'erro ao remover a representação.';

      const response1 = await runner.manager.remove(Person, this.attributes.person);
      if (!response1) 'erro ao remover a pessoa.';

      const response2 = await runner.manager.remove(
        Contact,
        this.attributes.person.contact,
      );
      if (!response2) 'erro ao remover o contato.';

      const response3 = await runner.manager.remove(
        EnterprisePerson,
        this.attributes.person.enterprise,
      );
      if (!response3) 'erro ao remover a pessoa.';

      const response4 = await runner.manager.remove(
        Address,
        this.attributes.person.contact.address,
      );
      return response4 ? '' : 'erro ao remover o endereço.';
    } catch (e) {
      console.log(e);

      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner, id: number) {
    if (id <= 0) return undefined;

    try {
      const entity = await runner.manager.findOne(RepresentationEntity, {
        where: { id },
        relations: {
          person: { enterprise: true, contact: { address: { city: { state: true } } } },
        },
      });

      return entity ? new Representation(entity) : undefined;
    } catch (e) {
      console.log(e);

      return undefined;
    }
  }

  async find(runner: QueryRunner) {
    try {
      const entities = await runner.manager.find(RepresentationEntity, {
        relations: {
          person: { enterprise: true, contact: { address: { city: { state: true } } } },
        },
      });
      const response: Representation[] = [];
      for (const entity of entities) response.push(new Representation(entity));

      return response;
    } catch (e) {
      console.log(e);

      return [];
    }
  }
}
