import express from 'express';
import apiLimiter from '../../middleware/rateLimiter.js';
import authenticate from '../../middleware/authenticate.js';
import { chatBoxController, chatBoxGetAllTextController } from '../../controllers/chat-box/chat-box.js';
import { rolePlayController } from '../../controllers/role-play/role-play.js';
import { setupPointsSSEConnection, sseController } from '../../controllers/chat-box/sse-controller.js';

const router = express.Router();

router.use(apiLimiter, authenticate);

/**
 * @swagger
 * /api/chat-box/send-message:
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
 *                   properties:
 *                     userMessage:
 *                       type: object
 *                     serverMessage:
 *                       type: object
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/send-message', chatBoxController);

/**
 * @swagger
 * /api/chat-box/get-message:
 *   get:
 *     summary: Get chat history
 *     description: Retrieve all chat messages for the authenticated user
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
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       requestFrom:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                       messageType:
 *                         type: string
 *                 groupedConversations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: object
 *                       response:
 *                         type: object
 *                       timestamp:
 *                         type: string
 *       400:
 *         description: Bad request - User ID not found
 *       500:
 *         description: Server error
 */
router.get('/get-message', chatBoxGetAllTextController);

router.post('/send-role-play-message', rolePlayController);

// Add SSE endpoint
router.get('/events', authenticate, sseController);

router.get('/points', setupPointsSSEConnection);

export default router;
