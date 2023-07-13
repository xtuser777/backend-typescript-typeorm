import { Router } from 'express';
import { EventController } from '../controller/EventController';

const router = Router();

router.get('/', new EventController().index);

router.get('/:id', new EventController().show);

router.get('/report/:filters', new EventController().report);

export default router;
