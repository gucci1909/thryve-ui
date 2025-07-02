import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import {
  loginManagerController,
  changeStatusManagerController,
} from '../../controllers/admin-manager/managerLogin.controller.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/', loginManagerController);

router.post('/change-status/:id', authAdminMiddleware, adminCompanyMiddleware, changeStatusManagerController);

export default router;
