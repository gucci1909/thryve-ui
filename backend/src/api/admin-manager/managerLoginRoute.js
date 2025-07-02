import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import {
  loginManagerController,
  changeStatusManagerController,
} from '../../controllers/admin-manager/managerLogin.controller.js';
import authMiddleware, { adminCompanyMiddleware } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/', loginManagerController);

router.post('/change-status/:id', authMiddleware, adminCompanyMiddleware, changeStatusManagerController);

export default router;
