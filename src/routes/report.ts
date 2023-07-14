import { Router } from 'express';
import { ReportController } from '../controller/ReportController';
import userAuthenticated from '../middleware/user-authenticated';

const router = Router();

router.post('/clients', userAuthenticated, new ReportController().clients);

export default router;
