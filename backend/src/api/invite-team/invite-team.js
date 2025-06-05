import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { addTeamMembers, getMemberInfo, saveFeedbackData } from '../../controllers/invite-team/invite-team.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/add-team-members', authenticate, addTeamMembers);

router.get('/get-member-info/:inviteCode', getMemberInfo);

router.post('/save-feedback/:inviteCode', saveFeedbackData);

export default router;
