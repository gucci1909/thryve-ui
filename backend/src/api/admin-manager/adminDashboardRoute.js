import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';
import { adminDashboardController } from '../../controllers/admin-manager/adminDashboard.controller.js';

const router = express.Router();

router.use(apiLimiter, authAdminMiddleware, adminCompanyMiddleware);

router.get('/manager-dashboard', adminDashboardController);

export default router;
