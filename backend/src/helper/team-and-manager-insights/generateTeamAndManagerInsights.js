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
    let outputJson;

    try {
      const jsonMatch = outputText.match(/```json\n([\s\S]*?)\n```/);
      const parsableText = jsonMatch ? jsonMatch[1] : outputText;
      outputJson = JSON.parse(parsableText);
    } catch (error) {
      console.error('Failed to parse JSON:', error);

      logger.logOpenAICall(req, {
        model: 'gpt-4',
        userInput: 'Team and Manager insights generation request',
        systemPrompt,
        response: outputText,
        error: new Error('Invalid JSON format in response'),
        responseTime: openAIResponseTime,
        chatType: 'TEAM_MANAGER_INSIGHTS',
        tokensUsed: data.usage?.total_tokens,
        completionToken: data.usage?.completion_tokens,
        promptToken: data.usage?.prompt_tokens,
      });

      throw new Error('Invalid JSON format in response');
    }

    logger.logOpenAICall(req, {
      model: 'gpt-4',
      userInput: 'Team and Manager insights generation request',
      systemPrompt,
      response: JSON.stringify(outputJson),
      responseTime: openAIResponseTime,
      chatType: 'TEAM_MANAGER_INSIGHTS',
      tokensUsed: data.usage?.total_tokens,
      completionToken: data.usage?.completion_tokens,
      promptToken: data.usage?.prompt_tokens,
    });
    
    return outputJson;

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