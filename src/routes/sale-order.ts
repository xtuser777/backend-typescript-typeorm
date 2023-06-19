import { Router } from 'express';
import { SaleOrderController } from '../controller/SaleOrderController';
import userAuthenticated from '../middleware/user-authenticated';

const router = Router();

router.get('/', userAuthenticated, new SaleOrderController().index);

router.get('/:id', userAuthenticated, new SaleOrderController().show);

router.post('/', userAuthenticated, new SaleOrderController().store);

router.delete('/:id', userAuthenticated, new SaleOrderController().delete);

export default router;
