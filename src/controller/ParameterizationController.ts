import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Parameterization } from '../model/Parameterization';
import { City } from '../model/City';
import { IAddress } from '../entity/Address';
import { IContact } from '../entity/Contact';
import { IEnterprisePerson } from '../entity/EnterprisePerson';
import { IPerson } from '../entity/Person';
import { IParameterization } from '../entity/Parameterization';

export class ParameterizationController {
  index = async (req: Request, res: Response) => {
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const parameterization = await new Parameterization().findOne(runner);
    await runner.release();

    return res.json(parameterization ? parameterization.toAttributes : undefined);
  };

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = (await new City().findOne(req.body.address.city)) as City;
    const address: IAddress = { id: 0, ...req.body.address, city };
    const contact: IContact = { id: 0, ...req.body.contact, address };
    const enterprise: IEnterprisePerson = { id: 0, ...req.body.person };
    const person: IPerson = {
      id: 0,
      type: 2,
      individual: undefined,
      enterprise,
      contact,
    };
    const parameterization: IParameterization = {
      id: 1,
      ...req.body.parameterization,
      person,
    };

    const model = new Parameterization(parameterization);

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    const response = await model.save(runner);
    if (response.length > 0) {
      if (runner.isTransactionActive) await runner.rollbackTransaction();
      if (!runner.isReleased) await runner.release();
      return res.status(400).json(response);
    }
    await runner.commitTransaction();
    await runner.release();

    return res.json(response);
  }

  async update(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisicao sem corpo.');
    const city = (await new City().findOne(req.body.address.city)) as City;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const parameterization = (await new Parameterization().findOne(
      runner,
    )) as Parameterization;
    parameterization.logotype = req.body.parameterization.logotype;
    parameterization.person.contact.phone = req.body.contact.phone;
    parameterization.person.contact.cellphone = req.body.contact.cellphone;
    parameterization.person.contact.email = req.body.contact.email;
    parameterization.person.contact.address.street = req.body.address.street;
    parameterization.person.contact.address.number = req.body.address.number;
    parameterization.person.contact.address.neighborhood = req.body.address.neighborhood;
    parameterization.person.contact.address.complement = req.body.address.complement;
    parameterization.person.contact.address.code = req.body.address.code;
    parameterization.person.contact.address.city = city;
    (parameterization.person.enterprise as IEnterprisePerson).corporateName =
      req.body.person.corporateName;
    (parameterization.person.enterprise as IEnterprisePerson).fantasyName =
      req.body.person.fantasyName;
    (parameterization.person.enterprise as IEnterprisePerson).cnpj = req.body.person.cnpj;

    console.log(parameterization);

    await runner.startTransaction();
    const response = await parameterization.update(runner);
    if (response.length > 0) {
      if (runner.isTransactionActive) await runner.rollbackTransaction();
      if (!runner.isReleased) await runner.release();
      return res.status(400).json(response);
    }
    await runner.commitTransaction();
    await runner.release();

    return res.json(response);
  }
}
