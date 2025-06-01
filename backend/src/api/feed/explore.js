import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { changeGoalStatus, addGoalNotes } from '../../controllers/feed/feed.controller.js';
const router = express.Router();

router.use(apiLimiter, authenticate);

router.post('/change-status-saved', changeGoalStatus);

router.post('/add-notes', addGoalNotes);

export default router;
