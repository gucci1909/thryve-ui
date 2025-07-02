import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';
import { existingManagerController, newManagerInviteController } from '../../controllers/admin-manager/inviteManager.controller.js';

const router = express.Router();

router.use(apiLimiter, authAdminMiddleware, adminCompanyMiddleware);

router.post('/existing-manager', existingManagerController);

router.post('/new-manager', newManagerInviteController);

export default router;
