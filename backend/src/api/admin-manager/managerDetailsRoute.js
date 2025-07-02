import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import {
  allManagerController,
  singleManagerController,
  singleManagerLearningPlanController,
} from '../../controllers/admin-manager/allManager.controller.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(apiLimiter, authAdminMiddleware, adminCompanyMiddleware);

router.get('/all-managers', allManagerController);

router.get('/single-manager', singleManagerController);

router.get('/manager-learning-plan', singleManagerLearningPlanController);

export default router;
