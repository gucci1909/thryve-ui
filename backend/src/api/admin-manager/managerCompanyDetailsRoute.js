import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';
import { adminCompanyDetails } from '../../controllers/admin-manager/managerCompany.controller.js';

const router = express.Router();

router.use(apiLimiter, authAdminMiddleware, adminCompanyMiddleware);

router.get('/company', adminCompanyDetails);

export default router;
