import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authMiddleware, { adminCompanyMiddleware } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(apiLimiter, authMiddleware, adminCompanyMiddleware);

router.post('/existing-manager', existingManagerController);

router.post('/new-manager', newManagerInviteController);

export default router;
