// import { Request, Response } from 'express';
// import { AppDataSource } from '../data-source';
// import { ParameterizationModel } from '../model/ParameterizationModel';
// import { CityModel } from '../model/CityModel';
// import { Address } from '../entity/Address';
// import { Contact } from '../entity/Contact';
// import { EnterprisePerson } from '../entity/EnterprisePerson';
// import { Person } from '../entity/Person';
// import { Parameterization } from '../entity/Parameterization';

// export class ParameterizationController {
//   async index(req: Request, res: Response) {
//     const runner = AppDataSource.createQueryRunner();
//     await runner.connect();
//     const parameterization = await new ParameterizationModel().findOne(runner);
//     await runner.release();

//     return res.json(parameterization?.toAttributes);
//   }

//   async store(req: Request, res: Response) {
//     if (Object.keys(req.body).length == 0)
//       return res.status(400).json('requisicao sem corpo.');
//     const city = ((await new CityModel().findOne(req.body.address.city)) as CityModel)
//       .toAttributes;
//     const address: Address = { id: 0, ...req.body.address, city };
//     const contact: Contact = { id: 0, ...req.body.contact, address };
//     const enterprise: EnterprisePerson = { id: 0, ...req.body.person };
//     const person: Person = { id: 0, type: 2, individual: undefined, enterprise, contact };
//     const parameterization: Parameterization = {
//       id: 1,
//       ...req.body.parameterization,
//       person,
//     };

//     const model = new ParameterizationModel(parameterization);

//     const runner = AppDataSource.createQueryRunner();
//     await runner.connect();
//     await runner.startTransaction();
//     const response = await model.save(runner);
//     if (response.length > 0) {
//       if (runner.isTransactionActive) await runner.rollbackTransaction();
//       if (!runner.isReleased) await runner.release();
//       return res.status(400).json(response);
//     }
//     await runner.commitTransaction();
//     await runner.release();

//     return res.json(response);
//   }

//   async update(req: Request, res: Response) {
//     if (Object.keys(req.body).length == 0)
//       return res.status(400).json('requisicao sem corpo.');
//     const city = ((await new CityModel().findOne(req.body.address.city)) as CityModel)
//       .toAttributes;
//     const runner = AppDataSource.createQueryRunner();
//     await runner.connect();
//     const parameterization = (await new ParameterizationModel().findOne(
//       runner,
//     )) as ParameterizationModel;
//     parameterization.toAttributes.logotype = req.body.parameterization.logotype;
//     parameterization.toAttributes.person.contact.phone = req.body.contact.phone;
//     parameterization.toAttributes.person.contact.cellphone = req.body.contact.cellphone;
//     parameterization.toAttributes.person.contact.email = req.body.contact.email;
//     parameterization.toAttributes.person.contact.address.street = req.body.address.street;
//     parameterization.toAttributes.person.contact.address.number = req.body.address.number;
//     parameterization.toAttributes.person.contact.address.neighborhood =
//       req.body.address.neighborhood;
//     parameterization.toAttributes.person.contact.address.complement =
//       req.body.address.complement;
//     parameterization.toAttributes.person.contact.address.code = req.body.address.code;
//     parameterization.toAttributes.person.contact.address.city = city;
//     (parameterization.toAttributes.person.enterprise as EnterprisePerson).corporateName =
//       req.body.person.corporateName;
//     (parameterization.toAttributes.person.enterprise as EnterprisePerson).fantasyName =
//       req.body.person.fantasyName;
//     (parameterization.toAttributes.person.enterprise as EnterprisePerson).cnpj =
//       req.body.person.cnpj;

//     await runner.startTransaction();
//     const response = await parameterization.update(runner);
//     if (response.length > 0) {
//       if (runner.isTransactionActive) await runner.rollbackTransaction();
//       if (!runner.isReleased) await runner.release();
//       return res.status(400).json(response);
//     }
//     await runner.commitTransaction();
//     await runner.release();

//     return res.json(response);
//   }
// }
