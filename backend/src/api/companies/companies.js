import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { companiesController } from '../../controllers/companies/companies.js';
const router = express.Router();

router.use(apiLimiter);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check API
 *     description: Check if the API server is healthy.
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.get('/insert-data', companiesController);

export default router;
