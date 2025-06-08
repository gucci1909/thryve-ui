import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';
import { getDb } from '../../config/db.js';
import { getRolePlayingPrompt } from './role-play-prompt-template.js';
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

export const rolePlayController = async (req, res) => {
  const db = getDb();

  try {
    const { question, userId } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: 'Question and userId are required' });
    }

    // Get user's company ID from users collection
    const usersCollection = db.collection('users');
    const companiesCollection = db.collection('companies');
    const leadershipReportsCollection = db.collection('leadership-reports');
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
    };

    const chatCollection = db.collection('chats');
    const existingChat = await chatCollection.findOne({ user_id: userId });

    const company = await companiesCollection.findOne({ INVITE_CODE: user?.companyId });

    const leadershipReport = await leadershipReportsCollection.findOne({ userId: userId });

    const response = await fetch(process.env.OpenAIAPI, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OpenAIAPIKEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: getRolePlayingPrompt(
              question,
              leadershipReport || {},
              company || {},
              existingChat || {},
            ),
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    // Prepare server message
    const serverMessage = {
      from: 'aicoach',
      chat_text: safeParseJSON(data.choices[0].message.content).chat_text,
      timestamp: new Date(),
      messageType: 'response',
    };

    // Find existing conversation or create new one

    if (existingChat) {
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

    const companyId = user.companyId;
    const pointsKey = `RoleplayInteractionPoint_${companyId}`;
    const points = parseInt(process.env[pointsKey]) || 0;

    if (!points) {
      console.warn(`No points configuration found for ${pointsKey}`);
    }

    const interactionsCollection = db.collection('interactions');

    // Check if user has already interacted with this title
    const existingInteraction = await interactionsCollection.findOne({
      user_id: userId,
    });

    if (existingInteraction) {
      // Check if LEARNING is already in the interacted_with array
      const hasLearningInteraction = existingInteraction.interacted_with.includes('ROLEPLAY');

      // Update points and add LEARNING to interacted_with if not present
      await interactionsCollection.updateOne(
        { _id: existingInteraction._id },
        {
          $set: {
            points: existingInteraction.points + points,
            interaction_timestamp: new Date(),
          },
          ...(!hasLearningInteraction
            ? {
                $push: { interacted_with: 'ROLEPLAY' },
              }
            : {}),
        },
      );
    } else {
      // Create new interaction
      await interactionsCollection.insertOne({
        user_id: userId,
        interaction_timestamp: new Date(),
        interacted_with: ['ROLEPLAY'],
        points: points,
      });
    }

    // After updating points, emit the new total to connected clients
    const updatedPoints = existingInteraction ? existingInteraction.points + points : points;

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
      interactionType: 'ROLEPLAY',
      pointsAwarded: points,
      isFirstInteraction: !existingInteraction,
      currentInteractionTypes: existingInteraction
        ? [
            ...existingInteraction.interacted_with,
            ...(!existingInteraction.interacted_with.includes('ROLEPLAY') ? ['ROLEPLAY'] : []),
          ]
        : ['ROLEPLAY'],
      totalPoints: existingInteraction ? existingInteraction.points + points : points,
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
    });
  } catch (error) {
    console.error('Chat box error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message,
    });
  }
};
