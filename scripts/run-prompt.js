#!/usr/bin/env node

import fs from 'fs';
import matter from 'gray-matter';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Step 1: Get prompt name from CLI args. [2] is used as it is looking for the 3rd variable in the array.
const promptName = process.argv[2];

// Check to see if a prompt name is given. If not an error appears and the program terminates
if (!promptName) {
  console.error("❌ Please provide a prompt name. Example: node scripts/run-prompt.js random-vegan-dish");
  process.exit(1);
}

// Step 2: Load the markdown file
// Builds the path to your prompt file based on the name provided.
const filePath = `./prompts/${promptName}.md`;

// Checks to see if the prompt exists in the "prompts folder. If not then an error appears and the program terminates "
if (!fs.existsSync(filePath)) {
  console.error(`❌ Prompt file not found: ${filePath}`);
  process.exit(1);
}

// Reads the .md file content as a UTF-8 string.
// Now fileContent contains both the frontmatter and prompt text.
const fileContent = fs.readFileSync(filePath, 'utf8');

// Step 3: Parse frontmatter + body
const { data: meta, content: promptText } = matter(fileContent);

// Step 4: Send request to Claude API
async function runPrompt() {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: meta.model || "claude-3-5-haiku-latest",
      max_tokens: 500,
      temperature: meta.temperature || 0.7,
      messages: [
        { role: "user", content: promptText }
      ]
    })
  });

  const data = await response.json();

  if (data.error) {
    console.error("❌ API Error:", data.error);
  } else {
    console.log("\n--- 🍽️ Result ---\n");
    console.log(data.content[0].text.trim());
  }

  // Token usage details
  if (data.usage) {
    const inputTokens = data.usage.input_tokens;
    const outputTokens = data.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;

    console.log("\n--- 📊 Token Usage ---");
    console.log(`Input tokens: ${inputTokens}`);
    console.log(`Output tokens: ${outputTokens}`);
    console.log(`Total tokens: ${totalTokens}`);
  }


}

runPrompt();
