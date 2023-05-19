import { Router } from 'express';
import { StateController } from '../controller/StateController';

const router = Router();

router.get('/', new StateController().index);

router.get('/:id', new StateController().show);

export default router;
