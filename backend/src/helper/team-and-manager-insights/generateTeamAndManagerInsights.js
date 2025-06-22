import { getTeamAndManagerInsightsPrompt } from './teamAndManagerInsightsPromptTemplate.js';
import logger from '../../utils/logger.js';
import fetch from 'node-fetch';

async function generateTeamAndManagerInsights(managerScores, teamScores, req = null) {
  const openaiEndpoint = process.env.OpenAIAPI;
  const startTime = Date.now();

  const systemPrompt = getTeamAndManagerInsightsPrompt(managerScores, teamScores);

  try {
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

    const data = await response.json();
    const openAIResponseTime = Date.now() - openAIStartTime;

    if (!response.ok || !data.choices || !data.choices[0]) {
      const error = new Error(data.error?.message || 'Invalid response from OpenAI');
      logger.logOpenAICall(req, {
        model: 'gpt-4',
        userInput: 'Team and Manager insights generation request',
        systemPrompt,
        error,
        responseTime: openAIResponseTime,
        chatType: 'TEAM_MANAGER_INSIGHTS',
        tokensUsed: data.usage?.total_tokens,
        completionToken: data.usage?.completion_tokens,
        promptToken: data.usage?.prompt_tokens,
      });
      throw error;
    }

    const outputText = data.choices[0].message.content;

    logger.logOpenAICall(req, {
      model: 'gpt-4',
      userInput: 'Team and Manager insights generation request',
      systemPrompt,
      response: outputText,
      responseTime: openAIResponseTime,
      chatType: 'TEAM_MANAGER_INSIGHTS',
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

    return { outputText, openAICollection };
  } catch (error) {
    console.error('Error generating team and manager insights:', error.message);

    if (!error.message.includes('OpenAI') && !error.message.includes('Invalid JSON format')) {
      logger.logOpenAICall(req, {
        model: 'gpt-4',
        userInput: 'Team and Manager insights generation request',
        systemPrompt,
        error,
        responseTime: Date.now() - startTime,
        chatType: 'TEAM_MANAGER_INSIGHTS',
      });
    }

    throw error;
  }
}

export default generateTeamAndManagerInsights;
