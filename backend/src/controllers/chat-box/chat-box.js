import { getDb } from '../../config/db.js';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';

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
    const session = await db.client.startSession();

    try {
        session.startTransaction();

        const { question, userId } = req.body;

        if (!question || !userId) {
            return res.status(400).json({ error: 'Question and userId are required' });
        }

        const currentTimestamp = new Date();

        // Prepare user message
        const userMessage = {
            requestFrom: "user",
            text: question,
            timestamp: currentTimestamp
        };

        // Get ChatGPT response
        const response = await fetch(process.env.OpenAIAPI, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OpenAIAPIKEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            throw new Error('Invalid response from OpenAI');
        }

        // Prepare server message
        const serverMessage = {
            requestFrom: "server",
            text: data.choices[0].message.content,
            timestamp: new Date()
        };

        // Find existing conversation or create new one
        const chatCollection = db.collection('chats');
        const existingChat = await chatCollection.findOne({ user_id: userId });

        if (existingChat) {
            // Update existing conversation
            await chatCollection.updateOne(
                { user_id: userId },
                {
                    $push: {
                        messages: {
                            $each: [userMessage, serverMessage]
                        }
                    }
                },
                { session }
            );
        } else {
            // Create new conversation
            await chatCollection.insertOne({
                user_id: userId,
                messages: [userMessage, serverMessage]
            }, { session });
        }

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            response: serverMessage.text,
            conversation: {
                userMessage,
                serverMessage
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Chat box error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request',
            details: error.message
        });
    } finally {
        await session.endSession();
    }
};
