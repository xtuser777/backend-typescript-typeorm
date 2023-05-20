import { QueryRunner } from 'typeorm';
import { isEmail } from 'validator/lib';
import { Client } from '../entity/Client';
import { Person } from '../entity/Person';
import { IndividualPerson } from '../entity/IndividualPerson';
import { EnterprisePerson } from '../entity/EnterprisePerson';

export class ClientModel {
  private attributes: Client;

  constructor(attributes?: Client) {
    this.attributes = 
      attributes 
        ? attributes 
        : { id: 0, register: '', person: Person };
  }

  get id(): number { return this.attributes.id; }
  set id(v: number) { this.attributes = v; }

  get register(): string { return this.attributes.register; }
  set register(v: string) { this.attributes.register = v; }

  get person(): Person { return this.attributes.person; }
  set person(v: Person) { this.attributes.person = v; }

  get toAttributes(): Client { return this.attributes; }

  async save(runner: QueryRunner) {
    if (
      this.attributes.id != 0 ||
      this.attributes.person.id != 0 ||
      (
        this.attributes.person.type == 1 
          ? (this.attributes.person.individual as IndividualPerson).id != 0 
          : (this.attributes.person.enterprise as EnterprisePerson).id != 0
      ) 
    ) return 'metodo invalido.';

    if (this.attributes.person.type <= 0 || this.attributes.person.type > 2) return 'tipo de pessoa invalido';
    if (this.attributes.person.type == 1) {
      if ((this.attributes.person.individual as IndividualPerson).name.length < 3) return 'nome invalido.';
      if ((this.attributes.person.individual as IndividualPerson).cpf.length < 14) return 'cpf invalido';
      if ((this.attributes.person.individual as IndividualPerson).birth.length < 10) return 'data de nascimento invalida.';

      if ((this.attributes.person.individual as IndividualPerson).contact.address.street.length <= 0) return 'rua invalida';
      if ((this.attributes.person.individual as IndividualPerson).contact.address.number.length <= 0) return 'numero do endereco invalido';
      if ((this.attributes.person.individual as IndividualPerson).contact.address.neighborhood.length <= 0) return 'bairro/distrito invalido';
      if ((this.attributes.person.individual as IndividualPerson).contact.address.cep.length < 10) return 'cep invalido';
      if ((this.attributes.person.individual as IndividualPerson).contact.address.city.id <= 0) return 'cidade invalida';

      if ((this.attributes.person.individual as IndividualPerson).contact.phone.length < 14) return 'telefone invalido';
      if ((this.attributes.person.individual as IndividualPerson).contact.cellphone.length < 15) return 'celular invalido';
      if (!isEmail((this.attributes.person.individual as IndividualPerson).contact.email)) return 'e-mail invalido';
    } else {
      if ((this.attributes.person.enterprise as EnterprisePerson).contact.address.street.length <= 0) return 'rua invalida';
      if ((this.attributes.person.enterprise as EnterprisePerson).contact.address.number.length <= 0) return 'numero do endereco invalido';
      if ((this.attributes.person.enterprise as EnterprisePerson).contact.address.neighborhood.length <= 0) return 'bairro/distrito invalido';
      if ((this.attributes.person.enterprise as EnterprisePerson).contact.address.code.length < 10) return 'cep invalido';
      if ((this.attributes.person.enterprise as EnterprisePerson).contact.address.city.id <= 0) return 'cidade invalida';

      if ((this.attributes.person.enterprise as EnterprisePerson).contact.phone length <= 14) return 'telefone invalido';
      if ((this.attributes.person.enterprise as EnterprisePerson).contact.cellphone.length < 15) return 'celular invalido';
      if (!isEmail((this.attributes.person.enterprise as EnterprisePerson).contact.email)) return 'e-mail invalido';
    }
  }
}
