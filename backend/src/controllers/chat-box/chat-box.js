import { getDb } from '../../config/db.js';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';
import { getCoachPrompt } from './chat-box-prompt-template.js';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

export const chatBoxController = async (req, res) => {

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


    if(user?.companyId){

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
            content: getCoachPrompt(question, leadershipReport || {}, company || {}, existingChat || {}),
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
      chat_text: JSON.parse(data.choices[0].message.content).chat_text,
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
        }
      );
    } else {
      // Create new conversation
      await chatCollection.insertOne(
        {
          user_id: userId,
          chat_context: [userMessage, serverMessage],
          created_at: currentTimestamp,
          updated_at: currentTimestamp,
        }
      );
    }

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
