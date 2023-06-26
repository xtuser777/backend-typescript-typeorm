import { Router } from 'express';
import { EventController } from '../controller/EventController';

const router = Router();

router.get('/', new EventController().index);

router.get('/:id', new EventController().show);

export default router;
