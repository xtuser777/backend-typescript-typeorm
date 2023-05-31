import { QueryRunner, TypeORMError } from 'typeorm';
import {
  IParameterization,
  Parameterization as ParameterizationEntity,
} from '../entity/Parameterization';
import { IPerson } from '../entity/Person';
import { IEnterprisePerson } from '../entity/EnterprisePerson';
import isEmail from 'validator/lib/isEmail';

export class Parameterization implements IParameterization {
  private attributes!: IParameterization;

  constructor(attributes?: IParameterization) {
    if (attributes) this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get logotype(): string {
    return this.attributes.logotype;
  }
  set logotype(v: string) {
    this.attributes.logotype = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IParameterization {
    return this.attributes;
  }

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      (this.attributes.person.enterprise as IEnterprisePerson).id != 0 ||
      this.attributes.person.contact.id != 0 ||
      this.attributes.person.contact.address.id != 0
    )
      return 'operação incorreta.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa inválido';
    if ((this.attributes.person.enterprise as IEnterprisePerson).corporateName.length < 6)
      return 'razao social invalida.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).fantasyName.length < 3)
      return 'nome fantasia invalido.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).cnpj.length < 10)
      return 'cnpj invalido.';

    if (this.attributes.person.contact.phone.length < 14) return 'telefone inválido.';
    if (this.attributes.person.contact.cellphone.length < 15) return 'celular inválido.';
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

    try {
      const response = await runner.manager.save(ParameterizationEntity, this);
      return response ? '' : 'erro ao registrar a parametrizacao';
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
      (this.attributes.person.enterprise as IEnterprisePerson).id <= 0 ||
      this.attributes.person.contact.id <= 0 ||
      this.attributes.person.contact.address.id <= 0
    )
      return 'operação incorreta.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
      return 'tipo de pessoa inválido';
    if ((this.attributes.person.enterprise as IEnterprisePerson).corporateName.length < 6)
      return 'razao social invalida.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).fantasyName.length < 3)
      return 'nome fantasia invalido.';
    if ((this.attributes.person.enterprise as IEnterprisePerson).cnpj.length < 10)
      return 'cnpj invalido.';

    if (this.attributes.person.contact.phone.length < 14) return 'telefone inválido.';
    if (this.attributes.person.contact.cellphone.length < 15) return 'celular inválido.';
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

    const entity: IParameterization = {
      id: this.id,
      logotype: this.logotype,
      person: this.person,
    };

    try {
      const response = await runner.manager.save(ParameterizationEntity, entity);
      return response ? '' : 'erro ao registrar a parametrizacao';
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();
      return (e as TypeORMError).message;
    }
  }

  async findOne(runner: QueryRunner) {
    try {
      const entity = await runner.manager.findOne(ParameterizationEntity, {
        where: { id: 1 },
        relations: {
          person: { enterprise: true, contact: { address: { city: { state: true } } } },
        },
      });

      return entity ? new Parameterization(entity) : undefined;
    } catch (e) {
      console.error(e);
      await runner.rollbackTransaction();
      await runner.release();

      return undefined;
    }
  }
}
