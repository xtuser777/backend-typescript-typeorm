import { Router } from 'express';
import { OrderStatusController } from '../controller/OrderStatusController';
import userAuthenticated from '../middleware/user-authenticated';

const router = Router();

router.put('/:id', userAuthenticated, new OrderStatusController().update);

export default router;
