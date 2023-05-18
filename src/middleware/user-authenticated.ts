import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ActiveUser } from '../util/active-user';
import { AppDataSource } from '../data-source';
import { EmployeeModel } from '../model/EmployeeModel';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ errors: ['Acesso negado.'] });
  const [, token] = authorization.split(' ');
  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET as string) as jwt.JwtPayload;
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    const user = await new EmployeeModel().findOne(runner, dados.id);
    await runner.release();
    if (!user) return res.status(401).json({ errors: ['Usuário inválido.'] });
    ActiveUser.getInstance({
      id: user.id,
      login: user.login,
      level: user.level.id,
    });
    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ errors: ['Token inválido ou expirado.'] });
  }
};
