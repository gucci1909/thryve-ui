import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';
import { adminHRInviteController } from '../../controllers/admin-manager/adminHR.controller.js';

const router = express.Router();

router.use(apiLimiter, authAdminMiddleware, adminCompanyMiddleware);

router.post('/hr-invite', adminHRInviteController);

export default router;
