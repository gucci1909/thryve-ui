import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLearningPlanPrompt } from './learningPlanPromptTemplate.js';
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

async function generateLearningPlan(
  past_learning_cards,
  team_feedback,
  coaching_history,
  reflections_of_context,
  leadership_assessment,
  req = null,
) {
  const openaiEndpoint = process.env.OpenAIAPI;
  const startTime = Date.now();

  const systemPrompt = getLearningPlanPrompt(
    past_learning_cards,
    team_feedback,
    coaching_history,
    reflections_of_context,
    leadership_assessment,
  );

  // File path to store prompt
  const filePath = path.join(__dirname, 'learning-plan-prompt.txt');
  const timestamp = new Date().toISOString();
  const logContent = `\n\n===== ${timestamp} =====\n${systemPrompt}\n`;

  // fs.appendFile(filePath, logContent, (err) => {
  //   if (err) {
  //     console.error('❌ Error writing to file:', err);
  //   } else {
  //     console.log(`✅ Prompt successfully appended to: ${filePath}`);
  //   }
  // });

  try {
    // Make OpenAI API call with timing
    const openAIStartTime = Date.now();
    const response = await fetch(openaiEndpoint, {
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
            content: systemPrompt,
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
        userInput: 'Learning plan generation request',
        systemPrompt,
        error,
        responseTime: openAIResponseTime,
        chatType: 'LEARNING_PLAN',
        tokensUsed: data.usage?.total_tokens,
        completionToken: data.usage?.completion_tokens,
        promptToken: data.usage?.prompt_tokens,
      });
      throw error;
    }

    let outputText = data.choices[0].message.content;

    // Remove code block markers if present
    if (outputText.startsWith('```json')) {
      outputText = outputText.replace(/^```json\s*/, '').replace(/```$/, '');
    } else if (outputText.startsWith('```')) {
      outputText = outputText.replace(/^```\w*\s*/, '').replace(/```$/, '');
    }

    let outputJson;

    try {
      outputJson = JSON.parse(outputText);
    } catch (error) {
      console.error('Failed to parse JSON:', error);

      // Log parsing error
      logger.logOpenAICall(req, {
        model: 'gpt-4o-mini',
        userInput: 'Learning plan generation request',
        systemPrompt,
        response: outputText,
        error: new Error('Invalid JSON format in response'),
        responseTime: openAIResponseTime,
        chatType: 'LEARNING_PLAN',
        tokensUsed: data.usage?.total_tokens,
        completionToken: data.usage?.completion_tokens,
        promptToken: data.usage?.prompt_tokens,
      });

      throw new Error('Invalid JSON format in response');
    }

    const learningPlan = outputJson.learning_plan || [];

    // Log successful OpenAI API call
    logger.logOpenAICall(req, {
      model: 'gpt-4o-mini',
      userInput: 'Learning plan generation request',
      systemPrompt,
      response: JSON.stringify(learningPlan),
      responseTime: openAIResponseTime,
      chatType: 'LEARNING_PLAN',
      tokensUsed: data.usage?.total_tokens,
      completionToken: data.usage?.completion_tokens,
      promptToken: data.usage?.prompt_tokens,
    });

    const openAICollection = {
      tokensUsed: data?.usage?.total_tokens || 0,
      completionToken: data?.usage?.completion_tokens || 0,
      promptToken: data?.usage?.prompt_tokens || 0,
      responseTimeMs: openAIResponseTime || 0,
    };

    return { learningPlan, openAICollection };
  } catch (error) {
    console.error('Error generating learning plan:', error.message);

    // Log any other errors
    if (!error.message.includes('OpenAI') && !error.message.includes('Invalid JSON format')) {
      logger.logOpenAICall(req, {
        model: 'gpt-4o-mini',
        userInput: 'Learning plan generation request',
        systemPrompt,
        error,
        responseTime: Date.now() - startTime,
        chatType: 'LEARNING_PLAN',
      });
    }

    throw error;
  }
}

export default generateLearningPlan;
