import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { createAndGetInsightsOfTeamAndManager, getNPSScoresOfTeamAndCompany, getScoresOfTeamAndManager } from '../../controllers/team-and-manager-score/t-and-m.controller.js';

const router = express.Router();

router.use(apiLimiter, authenticate);

router.get('/insights', createAndGetInsightsOfTeamAndManager);

router.get('/leadership-assessment-score', getScoresOfTeamAndManager);

router.get('/nps-score', getNPSScoresOfTeamAndCompany);

export default router;
