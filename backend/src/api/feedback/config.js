import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';

const router = express.Router();

router.use(apiLimiter, authenticate);

router.get('/config', configController);

export default router;
