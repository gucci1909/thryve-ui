import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import {
  loginController,
  changePasswordController,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController,
} from '../../controllers/login/login.controller.js';
import authenticate from '../../middleware/authenticate.js';

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

/**
 * @swagger
 * /api/onboarding/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change the password for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 */
router.post('/change-password', authenticate, changePasswordController);

/**
 * @swagger
 * /api/onboarding/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send OTP to user's email for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', forgotPasswordController);

/**
 * @swagger
 * /api/onboarding/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     description: Verify the OTP sent to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       401:
 *         description: Invalid OTP
 *       404:
 *         description: User not found
 */
router.post('/verify-otp', verifyOtpController);

/**
 * @swagger
 * /api/onboarding/reset-password:
 *   post:
 *     summary: Reset password after OTP verification
 *     description: Set new password for user after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       401:
 *         description: Invalid or expired OTP verification
 *       404:
 *         description: User not found
 */
router.post('/reset-password', resetPasswordController);

export default router;
