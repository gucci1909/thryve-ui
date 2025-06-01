import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { addTeamMembers } from '../../controllers/invite-team/invite-team.js';

const router = express.Router();

router.use(apiLimiter, authenticate);

router.post('/add-team-members', addTeamMembers);

export default router;
