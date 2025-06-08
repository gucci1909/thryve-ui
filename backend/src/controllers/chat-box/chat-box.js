import { getDb } from '../../config/db.js';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';
import { getCoachPrompt } from './chat-box-prompt-template.js';
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
    console.log({ safe: 'safe_content' });
    return { chat_text: content };
  }
}

export const chatBoxController = async (req, res) => {
  const db = getDb();

  try {
    const { question, userId } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: 'Question and userId are required' });
    }

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    const companiesCollection = db.collection('companies');
    const leadershipReportsCollection = db.collection('leadership-reports');

    if (!user) {
      throw new Error('User or company ID not found');
    }

    const currentTimestamp = new Date();

    // Create a session ID based on 12-hour window
    const sessionStartTime = new Date(currentTimestamp);
    sessionStartTime.setHours(Math.floor(sessionStartTime.getHours() / 12) * 12, 0, 0, 0);
    const sessionId = `${userId}_${sessionStartTime.getTime()}`;

    // Prepare user message
    const userMessage = {
      from: 'user',
      chat_text: question,
      timestamp: currentTimestamp,
      messageType: 'question',
      sessionId: sessionId,
    };

    const chatCollection = db.collection('chats');
    const existingChat = await chatCollection.findOne({ user_id: userId });

    if (user?.companyId) {
    }

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
            content: getCoachPrompt(
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

    // Prepare server message with session ID
    const serverMessage = {
      from: 'aicoach',
      chat_text: safeParseJSON(data.choices[0].message.content).chat_text,
      timestamp: new Date(),
      messageType: 'response',
      sessionId: sessionId,
    };

    if (existingChat) {
      await chatCollection.updateOne(
        { user_id: userId },
        {
          $push: {
            chat_context: {
              $each: [userMessage, serverMessage],
            },
          },
          $set: {
            updated_at: currentTimestamp,
          },
        },
      );
    } else {
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
    const pointsKey = `CoachingChatInteractionPoint_${companyId}`;
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
      const hasLearningInteraction = existingInteraction.interacted_with.includes('COACHING');

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
                $push: { interacted_with: 'COACHING' },
              }
            : {}),
        },
      );
    } else {
      // Create new interaction
      await interactionsCollection.insertOne({
        user_id: userId,
        interaction_timestamp: new Date(),
        interacted_with: ['COACHING'],
        points: points,
      });
    }

      // After updating points, emit the new total to connected clients
    const updatedPoints = existingInteraction ? existingInteraction.points + points : points;
    
    // Emit points update event
    const clients = req.app.locals.clients || new Map();
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ points: updatedPoints })}\n\n`);
      });
    }

    // Add comprehensive logging
    const logMetadata = {
      userId: userId,
      userEmail: user.email,
      companyId: user.companyId,
      interactionType: 'COACHING',
      pointsAwarded: points,
      isFirstInteraction: !existingInteraction,
      currentInteractionTypes: existingInteraction 
        ? [...existingInteraction.interacted_with, ...(!existingInteraction.interacted_with.includes('COACHING') ? ['COACHING'] : [])]
        : ['COACHING'],
      totalPoints: existingInteraction ? existingInteraction.points + points : points,
      timestamp: new Date().toISOString()
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Coaching Interaction recorded', logMetadata);

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

export const chatBoxGetAllTextController = async (req, res) => {
  const db = getDb();

  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Calculate timestamp for 12 hours ago
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    // Find chat messages for the user
    const chatCollection = db.collection('chats');
    const userChat = await chatCollection.findOne({ user_id: userId });

    if (!userChat) {
      return res.status(200).json({
        success: true,
        chat_context: [],
        message: 'No chat history found for this user',
      });
    }

    // Filter messages from the last 12 hours
    const recentMessages = userChat.chat_context.filter((msg) => {
      try {
        const msgDate = new Date(msg.timestamp);
        return !isNaN(msgDate.getTime()) && msgDate >= twelveHoursAgo;
      } catch (error) {
        console.error('Invalid timestamp in message:', msg);
        return false;
      }
    });

    res.status(200).json({
      success: true,
      chat_context: recentMessages || [],
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching chat history',
      details: error.message,
    });
  }
};
