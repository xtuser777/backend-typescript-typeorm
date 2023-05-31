import { IState } from '../entity/State';
import { State } from '../model/State';
import { Request, Response } from 'express';

export class StateController {
  index = async (req: Request, res: Response): Promise<Response> => {
    const states = await new State(new State()).find();
    // const response = [];
    // for (const state of states) {
    //   response.push(state.toAttributes);
    // }

    return res.json(states);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json('Parametro invalido.');
    } catch {
      return res.status(400).json('Parametro invalido.');
    }
    const state = await new State().findOne(id);

    return res.json(state ? state : undefined);
  };
}
