import { Request, Response } from 'express';
import { CityModel } from '../model/CityModel';
import { City } from '../entity/City';

export class CityController {
  index = async (req: Request, res: Response): Promise<Response> => {
    const cities = await new CityModel().find();
    const response = [];
    for (const city of cities) {
      response.push(city.toAttributes);
    }

    return res.json(response);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    if (!req.params.id) return res.status(400).json('Parametro ausente.');
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('parametro invalido.');
    } catch {
      return res.status(400).json('parametro invalido.');
    }
    const city = await new CityModel().findOne(id);

    return res.json(city ? city.toAttributes : undefined);
  };
}
