import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';
import { getDb } from '../../config/db.js';
import { getRolePlayingPrompt } from './role-play-prompt-template.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../utils/logger.js';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

function safeParseJSON(content) {
  try {
    return JSON.parse(content);
  } catch (e) {
    return { chat_text: content };
  }
}

// Helper to get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rolePlayController = async (req, res) => {
  const db = getDb();
  const startTime = Date.now();

  try {
    const { question, userId } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: 'Question and userId are required' });
    }

    // Get user's company ID from users collection
    const usersCollection = db.collection('users');
    const companiesCollection = db.collection('companies');
    const leadershipReportsCollection = db.collection('leadership-reports');
    const learningPlansCollection = db.collection('learning-plans');
    const existingLearningPlans = await learningPlansCollection.findOne({ userId });
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error('User or company ID not found');
    }

    const currentTimestamp = new Date();

    // Prepare user message
    const userMessage = {
      from: 'user',
      chat_text: question,
      timestamp: currentTimestamp,
      messageType: 'question',
      chatType: 'roleplay',
    };

    const chatCollection = db.collection('chats');
    const existingChat = await chatCollection.findOne({ user_id: userId });

    const company = await companiesCollection.findOne({ INVITE_CODE: user?.companyId });

    const leadershipReport = await leadershipReportsCollection.findOne({ userId: userId });
    const { learning_plan, ...restOfAssessment } = leadershipReport?.assessment || {};

    const learning_cards = [
      ...(existingLearningPlans?.learning_plan || []),
      ...(learning_plan || []),
    ];

    const rolePlayPrompt = getRolePlayingPrompt(
      question,
      restOfAssessment || {},
      company || {},
      existingChat || {},
      learning_cards || {},
    );

    // File path to store prompt
    const filePath = path.join(__dirname, 'role-play-prompt.txt');

    // Append the prompt with a timestamp
    const timestamp = new Date().toISOString();
    const logContent = `\n\n===== ${timestamp} =====\n${rolePlayPrompt}\n`;

    fs.appendFile(filePath, logContent, (err) => {
      if (err) {
        console.error('❌ Error writing to file:', err);
      } else {
        console.log(`✅ Prompt successfully appended to: ${filePath}`);
      }
    });

    // Make OpenAI API call with timing
    const openAIStartTime = Date.now();
    const response = await fetch(process.env.OpenAIAPI, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OpenAIAPIKEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: getRolePlayingPrompt(
              question,
              restOfAssessment || {},
              company || {},
              existingChat || {},
              learning_cards || {},
            ),
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const openAIResponseTime = Date.now() - openAIStartTime;

    // Log OpenAI API call
    if (!response.ok || !data.choices || !data.choices[0]) {
      const error = new Error(data.error?.message || 'Invalid response from OpenAI');
      logger.logOpenAICall(req, {
        model: 'gpt-4o-mini',
        userInput: question,
        systemPrompt: rolePlayPrompt,
        error,
        responseTime: openAIResponseTime,
        chatType: 'ROLEPLAY',
        tokensUsed: data.usage?.total_tokens
      });
      throw error;
    }

    // Log successful OpenAI API call
    const responseContent = safeParseJSON(data.choices[0].message.content).chat_text;
    logger.logOpenAICall(req, {
      model: 'gpt-4o-mini',
      userInput: question,
      systemPrompt: rolePlayPrompt,
      response: responseContent,
      responseTime: openAIResponseTime,
      chatType: 'ROLEPLAY',
      tokensUsed: data.usage?.total_tokens
    });

    // Prepare server message
    const serverMessage = {
      from: 'aicoach',
      chat_text: responseContent,
      timestamp: new Date(),
      messageType: 'response',
      chatType: 'roleplay',
    };

    // Find existing conversation or create new one
    let thirdRound = false;

    if (existingChat) {
      // Count messages of roleplay type only
      const roleplayMessages = existingChat.chat_context.filter(
        (msg) => msg.chatType === 'roleplay',
      );
      const messageRound = roleplayMessages.length || 1;
      const updatedMessageRound = messageRound + 2;
      thirdRound = updatedMessageRound % 6 === 0;

      // Update existing conversation
      await chatCollection.updateOne(
        { user_id: userId },
        {
          $push: {
            chat_context: {
              $each: [userMessage, serverMessage],
            },
          },
        },
      );
    } else {
      // Create new conversation
      await chatCollection.insertOne({
        user_id: userId,
        chat_context: [userMessage, serverMessage],
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
      });
    }

    // start points to the user

    if (!user || !user.companyId) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'User or company ID not found',
      });
    }

    const points = company?.RoleplayInteractionPoint || 0;

    const interactionsCollection = db.collection('interactions');

    // Record the new interaction as a separate event
    const interactionDoc = {
      user_id: userId,
      interaction_type: 'ROLEPLAY',
      chat_question: question,
      points: points,
      interaction_timestamp: new Date(),
    };

    const result = await interactionsCollection.insertOne(interactionDoc);

    // Emit total points (aggregate for user)
    const totalPoints = await interactionsCollection
      .aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: null, total: { $sum: '$points' } } },
      ])
      .toArray();

    const updatedPoints = totalPoints[0]?.total || 0;

    // ✅ Update total points in users collection
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { totalPoints: updatedPoints } },
    );

    // Emit points update event
    const clients = req.app.locals.clients || new Map();
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify({ points: updatedPoints })}\n\n`);
      });
    }

    // Add comprehensive logging
    const logMetadata = {
      userId: userId,
      userEmail: user.email,
      companyId: user.companyId,
      chat_question: question,
      interactionType: 'ROLEPLAY',
      pointsAwarded: points,
      totalPoints: updatedPoints,
      timestamp: new Date().toISOString(),
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Roleplay Interaction recorded', logMetadata);

    // end points
    res.status(200).json({
      success: true,
      response: serverMessage.text,
      conversation: {
        userMessage,
        serverMessage,
      },
      thirdRound: thirdRound,
    });
  } catch (error) {
    console.error('Chat box error:', error);
    
    // Log the error with OpenAI call details if it's an OpenAI error
    if (error.message.includes('OpenAI') || error.message.includes('Invalid response from OpenAI')) {
      logger.logOpenAICall(req, {
        model: 'gpt-4o-mini',
        userInput: req.body?.question,
        systemPrompt: 'Roleplay prompt generation failed',
        error,
        responseTime: Date.now() - startTime,
        chatType: 'ROLEPLAY'
      });
    }
    
    res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message,
    });
  }
};
