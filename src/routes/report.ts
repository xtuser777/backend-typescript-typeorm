import { Router } from 'express';
import { ReportController } from '../controller/ReportController';
import userAuthenticated from '../middleware/user-authenticated';

const router = Router();

router.post('/clients', userAuthenticated, new ReportController().clients);
router.post('/sale-orders', userAuthenticated, new ReportController().saleOrders);
router.post('/freight-orders', userAuthenticated, new ReportController().freightOrders);
router.post('/sale-budgets', userAuthenticated, new ReportController().saleBudgets);
router.post('/freight-budgets', userAuthenticated, new ReportController().freightBudgets);
router.post('/bills-pay', userAuthenticated, new ReportController().billsPay);
router.post('/receive-bills', userAuthenticated, new ReportController().receiveBills);
router.post('/products', userAuthenticated, new ReportController().products);

export default router;
