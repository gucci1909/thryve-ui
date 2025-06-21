import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import {
  learningPlanController,
  learningPlanGetController,
} from '../../controllers/learning-plan/learning-plan.controller.js';
const router = express.Router();

router.use(apiLimiter, authenticate);

router.post('/create-learning-plan', learningPlanController);

router.get('/learning-plans', learningPlanGetController);

export default router;
