import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { loginManagerController } from '../../controllers/admin-manager/managerLogin.controller.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/', loginManagerController);

export default router;
