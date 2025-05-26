import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { chatBoxController } from '../../controllers/chat-box/chat-box.js';
const router = express.Router();

router.use(apiLimiter, authenticate);

/**
 * @swagger
 * /api/chat-box:
 *   post:
 *     summary: Chat interaction endpoint
 *     description: Send a question to ChatGPT and store the conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - userId
 *             properties:
 *               question:
 *                 type: string
 *                 description: The user's question
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: string
 *                 conversation:
 *                   type: object
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/send-message', chatBoxController);

export default router;
