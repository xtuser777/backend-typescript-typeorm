import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export class TokenController {
  store = async (req: Request, res: Response) => {
    //   const { login = '', password = '' } = req.body;
    //   if (!login || !password)
    //     return res.status(400).json({ errors: ['Credenciais inválidas.'] });
    //   await Database.instance.open();
    //   const user = (await new User().find({ login, active: true }))[0];
    //   if (!user) {
    //     await Database.instance.close();
    //     return res.status(400).json({ errors: ['Usuário não cadastrado.'] });
    //   }
    //   if (!(await user.autenticate(password)))
    //     return res.status(400).json({ errors: ['Senha inválida.'] });
    //   const employee = (await new Employee().find({ id: user.getEmployeeId() }))[0];
    //   const person = (
    //     await new IndividualPerson().find({ id: employee.getPersonId() })
    //   )[0] as IndividualPerson;
    //   await Database.instance.close();
    //   const id = user.getId();
    //   const token = jwt.sign({ id, login }, process.env.TOKEN_SECRET as string, {
    //     expiresIn: process.env.TOKEN_EXPIRATION,
    //   });
    //   return res.json({
    //     token,
    //     user: { name: person.getName(), id, login, level: user.getLevelId() },
    //   });
  };
}
