import { Router } from 'express';
import { CityController } from '../controller/CityController';

const router = Router();

router.get('/', new CityController().index);

router.get('/:id', new CityController().show);

export default router;
