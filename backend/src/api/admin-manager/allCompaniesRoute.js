import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { adminCompanyMiddleware, authAdminMiddleware } from '../../middleware/authenticate.js';
import {
  allCompaniesDetailsController,
  allCompaniesIDsController,
  companyChangePasswordController,
  companyDetailByIdController,
  companyEditTextController,
  companyChangeStatusController,
  companyEditHrEmailController,
} from '../../controllers/admin-manager/allCompanies.controller.js';

const router = express.Router();

router.use(apiLimiter, authAdminMiddleware, adminCompanyMiddleware);

router.get('/list', allCompaniesIDsController);

router.get('/details', allCompaniesDetailsController);

router.get('/details/:companyId', companyDetailByIdController);

router.post('/edit-company-text', companyEditTextController);

router.post('/edit-hr-email', companyEditHrEmailController);

router.post('/change-password', companyChangePasswordController);

router.post('/change-status/:id', companyChangeStatusController);

export default router;
