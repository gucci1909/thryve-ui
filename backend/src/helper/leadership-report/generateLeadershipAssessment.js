import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { getLeadershipPrompt } from './leadershipPromptTemplate.js';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

async function generateLeadershipAssessment(inputJson) {
  const openaiEndpoint = process.env.OpenAIAPI;

  const systemPrompt = getLeadershipPrompt(inputJson);

  try {
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

    if (response.ok) {
      const outputText = data.choices[0].message.content;
      const outputJson = JSON.parse(outputText);
      return outputJson;
    } else {
      throw new Error(`OpenAI Error: ${data.error.message}`);
    }
  } catch (error) {
    console.error('Error generating leadership assessment:', error.message);
    throw error;
  }
}

export default generateLeadershipAssessment;
