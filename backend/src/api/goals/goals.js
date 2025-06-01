import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { getGoals, addGoal, changeGoalStatus, deleteGoal } from '../../controllers/goals/goals.js';
const router = express.Router();

router.use(apiLimiter, authenticate);

router.get('/goals', getGoals);

router.post('/add-goals', addGoal);

router.post('/change-status', changeGoalStatus);

router.delete('/delete-goal', deleteGoal);

export default router;
