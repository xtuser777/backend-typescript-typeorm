import { Router } from 'express';
import { ReportController } from '../controller/ReportController';
import userAuthenticated from '../middleware/user-authenticated';

const router = Router();

router.post('/clients', userAuthenticated, new ReportController().clients);
router.post('/sale-orders', userAuthenticated, new ReportController().saleOrders);
router.post('/freight-orders', userAuthenticated, new ReportController().freightOrders);

export default router;
