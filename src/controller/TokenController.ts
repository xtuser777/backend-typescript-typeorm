import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { EmployeeModel } from '../model/EmployeeModel';
import { IndividualPerson } from '../entity/IndividualPerson';

export class TokenController {
  store = async (req: Request, res: Response) => {
    const { login = '', password = '' } = req.body;
    if (!login || !password)
      return res.status(400).json({ errors: ['Credenciais inválidas.'] });

    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const user = (
      await new EmployeeModel().find(runner, { login, demission: undefined })
    )[0];
    await runner.release();
    if (!user) return res.status(400).json({ errors: ['Usuário não cadastrado.'] });
    if (!(await user.autenticate(password)))
      return res.status(400).json({ errors: ['Senha inválida.'] });
    const id = user.id;
    const token = jwt.sign({ id, login }, process.env.TOKEN_SECRET as string, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({
      token,
      user: {
        name: (user.person.individual as IndividualPerson).name,
        id,
        login,
        level: user.level.id,
      },
    });
  };
}
