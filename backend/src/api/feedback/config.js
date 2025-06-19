import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { configController } from '../../controllers/feedback/configController.js';

const router = express.Router();

router.use(apiLimiter, authenticate);

router.get('/config', configController);

export default router;
