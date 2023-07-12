import { Router } from 'express';
import { LoadStepController } from '../controller/LoadStepController';
import userAuthenticated from '../middleware/user-authenticated';

const router = Router();

router.get('/:id', new LoadStepController().print);

router.put('/:id', userAuthenticated, new LoadStepController().update);

export default router;
