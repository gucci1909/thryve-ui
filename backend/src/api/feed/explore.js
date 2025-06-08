import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { changeGoalStatus, addGoalNotes, editGoalNote, deleteGoalNote, addReaction, getReactions } from '../../controllers/feed/feed.controller.js';
const router = express.Router();

router.use(apiLimiter, authenticate);

router.post('/change-status-saved', changeGoalStatus);

router.post('/add-notes', addGoalNotes);

router.put('/edit-note', editGoalNote);

router.delete('/delete-note', deleteGoalNote);

// New routes for reactions
router.post('/add-reaction', addReaction);
router.get('/reactions/:title', getReactions);

export default router;
