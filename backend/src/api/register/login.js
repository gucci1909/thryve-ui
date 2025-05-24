import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import { loginController } from '../../controllers/login/login.controller.js';

const router = express.Router();

router.use(apiLimiter);

/**
 * @swagger
 * /api/onboarding/login:
 *   post:
 *     summary: Generate Leadership Report
 *     description: Validates leadership report input and returns a persona-based leadership analysis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meta:
 *                 type: object
 *                 properties:
 *                   include:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [leadership, roleInfo, psychographic]
 *             example:
 *               meta:
 *                 include: ["leadership", "roleInfo", "psychographic"]
 *               sections:
 *                 leadership:
 *                   DecisionMakingDelegation:
 *                     independentDecisions: 3
 *                     seekTeamInput: 4
 *                     delegateTasks: 3
 *                     struggleDelegation: 3
 *                   EmotionalIntelligenceEmpathy:
 *                     tuneIntoTeam: 2
 *                     constructiveFeedback: 4
 *                     resultsOverRelationships: 3
 *                     stayCalmInConflict: 3
 *                   VisionStrategy:
 *                     communicateVision: 4
 *                     shortTermFocus: 3
 *                     encourageInnovation: 2
 *                     preferTestedApproaches: 4
 *                   TeamDevelopmentCoaching:
 *                     mentoring: 5
 *                     designGrowthOpportunities: 4
 *                     energizedByHelping: 3
 *                     solveInsteadEnable: 2
 *                   AdaptabilityInfluence:
 *                     changeApproach: 4
 *                     influenceWithoutAuthority: 5
 *                     adaptToChange: 3
 *                     preferStructure: 4
 *                 roleInfo:
 *                   role: Director
 *                   teamSize: 20-50
 *                   industry: Health Care
 *                   challenges:
 *                     - Balancing regulatory compliance with innovation
 *                     - Driving team performance amid high patient-care demands
 *                     - Fostering cross-functional collaboration in a fast-paced environment
 *                 psychographic:
 *                   learningStyle: ["onDemand", "deepDive", "reading"]
 *                   coachingTone: ["warm", "direct"]
 *     responses:
 *       200:
 *         description: Leadership report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 persona:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: visionary
 *                       label:
 *                         type: string
 *                         example: Visionary
 *                       summary:
 *                         type: string
 *                 insights:
 *                   type: object
 *                   properties:
 *                     strengths:
 *                       type: array
 *                       items:
 *                         type: string
 *                     weaknesses:
 *                       type: array
 *                       items:
 *                         type: string
 *                     opportunities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     threats:
 *                       type: array
 *                       items:
 *                         type: string
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     persona:
 *                       type: array
 *                       items:
 *                         type: string
 *                     swot_analysis:
 *                       type: boolean
 *       400:
 *         description: Invalid input payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Not OK
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.post('/login', loginController);

export default router;
