import { State } from '../entity/State';
import { StateModel } from '../model/StateModel';
import { Request, Response } from 'express';

export class StateController {
  index = async (req: Request, res: Response): Promise<Response> => {
    const states = await new StateModel(new State()).find();
    const response = [];
    for (const state of states) {
      response.push(state.toAttributes);
    }

    return res.json(response);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('Parametro invalido.');
    } catch {
      return res.status(400).json('Parametro invalido.');
    }
    const state = await new StateModel().findOne(id);

    return res.json(state ? state.toAttributes : undefined);
  };
}
