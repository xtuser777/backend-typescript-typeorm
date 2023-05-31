// import { QueryRunner, TypeORMError } from 'typeorm';
// import { Parameterization } from '../entity/Parameterization';
// import { Person } from '../entity/Person';
// import { EnterprisePerson } from '../entity/EnterprisePerson';
// import isEmail from 'validator/lib/isEmail';

// export class ParameterizationModel {
//   private attributes: Parameterization;

//   constructor(attributes?: Parameterization) {
//     this.attributes = attributes
//       ? attributes
//       : { id: 0, logotype: '', person: new Person() };
//   }

//   get id(): number {
//     return this.attributes.id;
//   }
//   set id(v: number) {
//     this.attributes.id = v;
//   }

//   get logotype(): string {
//     return this.attributes.logotype;
//   }
//   set logotype(v: string) {
//     this.attributes.logotype = v;
//   }

//   get person(): Person {
//     return this.attributes.person;
//   }
//   set person(v: Person) {
//     this.attributes.person = v;
//   }

//   get toAttributes(): Parameterization {
//     return this.attributes;
//   }

//   async save(runner: QueryRunner) {
//     if (
//       this.attributes.id != 0 ||
//       this.attributes.person.id != 0 ||
//       (this.attributes.person.enterprise as EnterprisePerson).id != 0 ||
//       this.attributes.person.contact.id != 0 ||
//       this.attributes.person.contact.address.id != 0
//     )
//       return 'operação incorreta.';

//     if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
//       return 'tipo de pessoa inválido';
//     if ((this.attributes.person.enterprise as EnterprisePerson).corporateName.length < 6)
//       return 'razao social invalida.';
//     if ((this.attributes.person.enterprise as EnterprisePerson).fantasyName.length < 3)
//       return 'nome fantasia invalido.';
//     if ((this.attributes.person.enterprise as EnterprisePerson).cnpj.length < 10)
//       return 'cnpj invalido.';

//     if (this.attributes.person.contact.phone.length < 14) return 'telefone inválido.';
//     if (this.attributes.person.contact.cellphone.length < 15) return 'celular inválido.';
//     if (
//       this.attributes.person.contact.email.length < 5 ||
//       !isEmail(this.attributes.person.contact.email)
//     )
//       return 'e-mail inválido.';

//     if (this.attributes.person.contact.address.street.length <= 0) return 'rua inválida';
//     if (this.attributes.person.contact.address.number.length <= 0)
//       return 'número inválido';
//     if (this.attributes.person.contact.address.neighborhood.length <= 0)
//       return 'bairro ou distrito inválido.';
//     if (this.attributes.person.contact.address.code.length < 10) return 'cep inválido';
//     if (this.attributes.person.contact.address.city.id <= 0) return 'cidade inválida';

//     try {
//       const response = await runner.manager.save(Parameterization, this.attributes);
//       return response ? '' : 'erro ao registrar a parametrizacao';
//     } catch (e) {
//       console.error(e);
//       await runner.rollbackTransaction();
//       await runner.release();
//       return (e as TypeORMError).message;
//     }
//   }

//   async update(runner: QueryRunner) {
//     if (
//       this.attributes.id <= 0 ||
//       this.attributes.person.id <= 0 ||
//       (this.attributes.person.enterprise as EnterprisePerson).id <= 0 ||
//       this.attributes.person.contact.id <= 0 ||
//       this.attributes.person.contact.address.id <= 0
//     )
//       return 'operação incorreta.';

//     if (this.attributes.person.type <= 0 || this.attributes.person.type > 2)
//       return 'tipo de pessoa inválido';
//     if ((this.attributes.person.enterprise as EnterprisePerson).corporateName.length < 6)
//       return 'razao social invalida.';
//     if ((this.attributes.person.enterprise as EnterprisePerson).fantasyName.length < 3)
//       return 'nome fantasia invalido.';
//     if ((this.attributes.person.enterprise as EnterprisePerson).cnpj.length < 10)
//       return 'cnpj invalido.';

//     if (this.attributes.person.contact.phone.length < 14) return 'telefone inválido.';
//     if (this.attributes.person.contact.cellphone.length < 15) return 'celular inválido.';
//     if (
//       this.attributes.person.contact.email.length < 5 ||
//       !isEmail(this.attributes.person.contact.email)
//     )
//       return 'e-mail inválido.';

//     if (this.attributes.person.contact.address.street.length <= 0) return 'rua inválida';
//     if (this.attributes.person.contact.address.number.length <= 0)
//       return 'número inválido';
//     if (this.attributes.person.contact.address.neighborhood.length <= 0)
//       return 'bairro ou distrito inválido.';
//     if (this.attributes.person.contact.address.code.length < 10) return 'cep inválido';
//     if (this.attributes.person.contact.address.city.id <= 0) return 'cidade inválida';

//     try {
//       const response = await runner.manager.save(Parameterization, this.attributes);
//       return response ? '' : 'erro ao registrar a parametrizacao';
//     } catch (e) {
//       console.error(e);
//       await runner.rollbackTransaction();
//       await runner.release();
//       return (e as TypeORMError).message;
//     }
//   }

//   async findOne(runner: QueryRunner) {
//     try {
//       const entity = await runner.manager.findOne(Parameterization, {
//         where: { id: 1 },
//         relations: {
//           person: { enterprise: true, contact: { address: { city: { state: true } } } },
//         },
//       });

//       return entity ? new ParameterizationModel(entity) : undefined;
//     } catch (e) {
//       console.error(e);
//       await runner.rollbackTransaction();
//       await runner.release();

//       return undefined;
//     }
//   }
// }
