import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import {
  loginManagerController,
  changeStatusManagerController,
  findByEmailController,
  findAllChatsController,
  findChatByIDController,
} from '../../controllers/admin-manager/managerLogin.controller.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/', loginManagerController);

router.post(
  '/change-status/:id',
  authAdminMiddleware,
  adminCompanyMiddleware,
  changeStatusManagerController,
);

router.post('/find-by-email', authAdminMiddleware, adminCompanyMiddleware, findByEmailController);

router.post('/find-all-chats', authAdminMiddleware, adminCompanyMiddleware, findAllChatsController);

router.post('/find-chat-by-id', authAdminMiddleware, adminCompanyMiddleware, findChatByIDController);

export default router;
