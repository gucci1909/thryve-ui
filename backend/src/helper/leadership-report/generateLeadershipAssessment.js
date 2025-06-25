import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { getLeadershipPrompt } from './leadershipPromptTemplate.js';
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

async function generateLeadershipAssessment(inputJson, req = null) {
  const openaiEndpoint = process.env.OpenAIAPI;
  const startTime = Date.now();

  const systemPrompt = getLeadershipPrompt(inputJson);

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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      // Optionally, try to read as text to see if it's HTML
      console.log('Response is not OK', response);
      const text = await response.text();
      if (text.startsWith('<')) {
        throw new Error('Received HTML error page from API');
      }
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const data = await response.json();

    // Comprehensive logging of the entire response data with pretty printing
    console.log('=== FULL OPENAI RESPONSE DATA ===');
    console.log(JSON.stringify(data, null, 2));

    console.log(JSON.stringify(data.choices[0].message.content, null, 2));
    console.log('=== END FULL OPENAI RESPONSE DATA ===');

    // Also log with the logger for file logging
    logger.info('Full OpenAI API response data', {
      metadata: {
        fullResponse: JSON.stringify(data, null, 2),
        responseStatus: response.status,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        hasChoices: !!data.choices,
        choicesCount: data.choices?.length || 0,
        hasUsage: !!data.usage,
        hasError: !!data.error,
        model: data.model,
        id: data.id,
        object: data.object,
        created: data.created,
        finishReason: data.choices?.[0]?.finish_reason,
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    });

    const openAIResponseTime = Date.now() - openAIStartTime;

    // Log OpenAI API call
    if (!response.ok || !data.choices || !data.choices[0]) {
      const error = new Error(data.error?.message || 'Invalid response from OpenAI');
      logger.logOpenAICall(req, {
        model: 'gpt-4',
        userInput: 'Leadership assessment generation request',
        systemPrompt,
        error,
        responseTime: openAIResponseTime,
        chatType: 'LEADERSHIP_ASSESSMENT',
        tokensUsed: data.usage?.total_tokens,
        completionToken: data.usage?.completion_tokens,
        promptToken: data.usage?.prompt_tokens,
      });
      throw error;
    }

    const outputText = data.choices[0].message.content;
    let outputJson;

    try {
      outputJson = JSON.parse(outputText);
    } catch (error) {
      console.error('Failed to parse JSON:', error);

      // Log parsing error
      logger.logOpenAICall(req, {
        model: 'gpt-4',
        userInput: 'Leadership assessment generation request',
        systemPrompt,
        response: outputText,
        error: new Error('Invalid JSON format in response'),
        responseTime: openAIResponseTime,
        chatType: 'LEADERSHIP_ASSESSMENT',
        tokensUsed: data.usage?.total_tokens,
        completionToken: data.usage?.completion_tokens,
        promptToken: data.usage?.prompt_tokens,
      });

      throw new Error('Invalid JSON format in response');
    }

    // Log successful OpenAI API call
    logger.logOpenAICall(req, {
      model: 'gpt-4',
      userInput: 'Leadership assessment generation request',
      systemPrompt,
      response: JSON.stringify(outputJson),
      responseTime: openAIResponseTime,
      chatType: 'LEADERSHIP_ASSESSMENT',
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

    return { outputJson, openAICollection };
  } catch (error) {
    console.error('Error generating leadership assessment:', error.message);

    // Log any other errors
    if (!error.message.includes('OpenAI') && !error.message.includes('Invalid JSON format')) {
      logger.logOpenAICall(req, {
        model: 'gpt-4',
        userInput: 'Leadership assessment generation request',
        systemPrompt,
        error,
        responseTime: Date.now() - startTime,
        chatType: 'LEADERSHIP_ASSESSMENT',
      });
    }

    throw error;
  }
}

export default generateLeadershipAssessment;
