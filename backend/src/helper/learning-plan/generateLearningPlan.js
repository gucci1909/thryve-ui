import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLearningPlanPrompt } from './learningPlanPromptTemplate.js';

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

async function generateLearningPlan(past_learning_cards, team_feedback, coaching_history, reflections_of_context, leadership_assessment) {
  const openaiEndpoint = process.env.OpenAIAPI;

  const systemPrompt = getLearningPlanPrompt(
    past_learning_cards,
    team_feedback,
    coaching_history,
    reflections_of_context,
    leadership_assessment
  );

  // Log system prompt to console
  console.log(`
    ================ SYSTEM PROMPT START ================

  `);
  console.dir(systemPrompt, { depth: null, colors: true });
  console.log(`
    ================ SYSTEM PROMPT END ================

  `);

  // File path to store prompt
  const filePath = path.join(__dirname, 'learning-plan-prompt.txt');

  // Append the prompt with a timestamp
  const timestamp = new Date().toISOString();
  const logContent = `\n\n===== ${timestamp} =====\n${systemPrompt}\n`;

  fs.appendFile(filePath, logContent, (err) => {
    if (err) {
      console.error('❌ Error writing to file:', err);
    } else {
      console.log(`✅ Prompt successfully appended to: ${filePath}`);
    }
  });

  try {
    const response = await fetch(openaiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OpenAIAPIKEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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

    if (response.ok) {
      const outputText = data.choices[0].message.content;

      // console.log({t: outputText});
      console.log(`
        ================ OUTPUT TEXT START ================

      `);
      console.dir(outputText, { depth: null, colors: true });
      console.log(`
        ================ OUTPUT TEXT END ================

      `);

      // Remove code block markers if present
  if (outputText.startsWith("```json")) {
    outputText = outputText.replace(/```json\n?/, "").replace(/```$/, "");
  } else if (outputText.startsWith("```")) {
    outputText = outputText.replace(/```\w*\n?/, "").replace(/```$/, "");
  }


      const outputJson = JSON.parse(outputText);
      return outputJson;
    } else {
      throw new Error(`OpenAI Error: ${data.error.message}`);
    }
  } catch (error) {
    console.error('Error generating learning plan:', error.message);
    throw error;
  }
}

export default generateLearningPlan; 