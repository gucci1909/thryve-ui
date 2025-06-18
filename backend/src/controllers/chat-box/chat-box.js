import { getDb } from '../../config/db.js';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';
import { getCoachPrompt } from './chat-box-prompt-template.js';
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

// Helper to get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const startTime = Date.now();

  try {
    const { question, userId, sessionStart } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: 'Question and userId are required' });
    }

    const usersCollection = db.collection('users');
    const companiesCollection = db.collection('companies');
    const leadershipReportsCollection = db.collection('leadership-reports');
    const chatCollection = db.collection('chats');
    const sessionsCollection = db.collection('sessions');
    const learningPlansCollection = db.collection('learning-plans');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error('User or company ID not found');
    }

    const currentTimestamp = new Date();

    let sessionId;

    if (sessionStart === true) {
      await sessionsCollection.updateMany(
        { userId: userId, chatMode: 'coaching', status: 'active' },
        { $set: { status: 'closed', endedAt: currentTimestamp } },
      );

      // Create new sessionId
      sessionId = `${userId}_${currentTimestamp.getTime()}`;

      await sessionsCollection.insertOne({
        userId: userId,
        chatMode: 'coaching',
        sessionId: sessionId,
        startedAt: currentTimestamp,
        status: 'active',
      });
    } else {
      // Check if there's already a session for this user
      const sessionDoc = await sessionsCollection.findOne(
        {
          userId: userId,
          chatMode: 'coaching',
          status: 'active',
        },
        { sort: { startedAt: -1 } },
      );

      if (sessionDoc) {
        sessionId = sessionDoc.sessionId;
      } else {
        sessionId = `${userId}_${currentTimestamp.getTime()}`;

        await sessionsCollection.insertOne({
          userId: userId,
          chatMode: 'coaching',
          sessionId: sessionId,
          startedAt: currentTimestamp,
          status: 'active',
        });
      }
    }

    const userMessage = {
      from: 'user',
      chat_text: question,
      messageType: 'question',
      chatType: 'coaching',
      sessionId: sessionId,
      timestamp: currentTimestamp,
    };

    const existingChat = await chatCollection
      .find({ user_id: userId })
      .sort({ updated_at: -1 })
      .toArray();
    const existingLearningPlans = await learningPlansCollection
      .find({ userId })
      .sort({ updated_at: -1 })
      .toArray();

    const company = await companiesCollection.findOne({ INVITE_CODE: user?.companyId });
    const leadershipReport = await leadershipReportsCollection.findOne({ userId: userId });

    const mergedLearningPlan = existingLearningPlans?.reduce((acc, existingLearningPlan) => {
      return acc.concat(existingLearningPlan?.learning_plan);
    }, []);

    const mergedExistingChat = existingChat?.reduce((acc, chat) => {
      return acc.concat(chat.chat_context);
    }, []);

    const { learning_plan, ...restOfAssessment } = leadershipReport?.assessment || {};

    const learning_cards = [...(mergedLearningPlan || []), ...(learning_plan || [])];

    // we are here just making a coaching-prompt.txt file
    // start of file append

    const coachingPrompt = getCoachPrompt(
      question,
      restOfAssessment || {},
      company || {},
      { chat_context: mergedExistingChat } || {},
      learning_cards || {},
    );

    const filePath = path.join(__dirname, 'coaching-prompt.txt');
    const timestamp = new Date().toISOString();
    const logContent = `\n\n===== ${timestamp} =====\n${coachingPrompt}\n`;

    fs.appendFile(filePath, logContent, (err) => {
      if (err) {
        console.error('❌ Error writing to file:', err);
      } else {
        console.log(`✅ Prompt successfully appended to: ${filePath}`);
      }
    });
    // end of file append

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
            content: getCoachPrompt(
              question,
              restOfAssessment || {},
              company || {},
              { chat_context: mergedExistingChat } || {},
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
        systemPrompt: coachingPrompt,
        error,
        responseTime: openAIResponseTime,
        chatType: 'COACHING',
        tokensUsed: data.usage?.total_tokens,
      });
      throw error;
    }

    // Log successful OpenAI API call
    const responseContent = safeParseJSON(data.choices[0].message.content).chat_text;
    logger.logOpenAICall(req, {
      model: 'gpt-4o-mini',
      userInput: question,
      systemPrompt: coachingPrompt,
      response: responseContent,
      responseTime: openAIResponseTime,
      chatType: 'COACHING',
      tokensUsed: data.usage?.total_tokens,
    });

    const serverMessage = {
      from: 'aicoach',
      chat_text: responseContent,
      messageType: 'response',
      chatType: 'coaching',
      sessionId: sessionId,
      timestamp: new Date(),
    };

    if (sessionStart === true) {
      await chatCollection.insertOne({
        user_id: userId,
        session_id: sessionId,
        chat_context: [userMessage, serverMessage],
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      await chatCollection.updateOne(
        { user_id: userId, session_id: sessionId },
        {
          $push: {
            chat_context: {
              $each: [userMessage, serverMessage],
            },
          },
          $set: {
            updated_at: new Date(),
          },
        },
      );
    }

    if (!user || !user.companyId) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'User or company ID not found',
      });
    }

    const points = company?.CoachingChatInteractionPoint || 0;
    const interactionsCollection = db.collection('interactions');

    const interactionDoc = {
      user_id: userId,
      interaction_type: 'COACHING',
      chat_question: question,
      points: points,
      interaction_timestamp: new Date(),
    };

    await interactionsCollection.insertOne(interactionDoc);
    const clients = req.app.locals.clients || new Map();
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify({ points: updatedPoints })}\n\n`);
      });
    }

    const totalPoints = await interactionsCollection
      .aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: null, total: { $sum: '$points' } } },
      ])
      .toArray();

    const updatedPoints = totalPoints[0]?.total || 0;
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { totalPoints: updatedPoints } },
    );

    // Add comprehensive logging
    const logMetadata = {
      userId: userId,
      userEmail: user.email,
      companyId: user.companyId,
      chat_question: question,
      interactionType: 'COACHING',
      pointsAwarded: points,
      totalPoints: updatedPoints,
      timestamp: new Date().toISOString(),
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Coaching Interaction recorded', logMetadata);

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

    // Log the error with OpenAI call details if it's an OpenAI error
    if (
      error.message.includes('OpenAI') ||
      error.message.includes('Invalid response from OpenAI')
    ) {
      logger.logOpenAICall(req, {
        model: 'gpt-4o-mini',
        userInput: req.body?.question,
        systemPrompt: 'Coaching prompt generation failed',
        error,
        responseTime: Date.now() - startTime,
        chatType: 'COACHING',
      });
    }

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
    // twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

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
      chat_context: userChat.chat_context || [],
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

export const saveFeedback = async (req, res) => {
  const db = getDb();

  try {
    const { userId, chatType, decision, timestamp } = req.body;

    if (!userId || !chatType || !decision || !timestamp) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Missing required fields',
      });
    }

    const feedbackCollection = db.collection('chat-feedback');

    const feedbackDoc = {
      userId,
      chatType,
      decision,
      timestamp: new Date(timestamp),
      createdAt: new Date(),
    };

    await feedbackCollection.insertOne(feedbackDoc);

    return res.status(200).json({
      status: 'OK',
      message: 'Feedback saved successfully',
    });
  } catch (error) {
    console.error('Save Feedback Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to save feedback',
    });
  }
};
