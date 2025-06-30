import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authMiddleware, { adminCompanyMiddleware } from '../../middleware/authenticate.js';
import { adminHRInviteController } from '../../controllers/admin-manager/adminHR.controller.js';

const router = express.Router();

router.use(apiLimiter, authMiddleware, adminCompanyMiddleware);

router.post('/hr-invite', adminHRInviteController);

export default router;
