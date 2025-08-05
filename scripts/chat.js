#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import fetch from 'node-fetch';
import matter from 'gray-matter';
import dotenv from 'dotenv';

dotenv.config();

// Check for API key
if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ Please set your ANTHROPIC_API_KEY in .env file");
    process.exit(1);
}

// Default Configuration. This gets replaced if a model and temperature is specified in the standard prompt .md files.

const CONFIG = {
    model: "claude-3-5-haiku-latest",
    max_tokens: 1000,
    temperature: 0.7
};

// Message history array
let messages = [];

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to load and parse prompt file
function loadPrompt(promptName) {
    const filePath = `./prompts/${promptName}.md`;

    if (!fs.existsSync(filePath)) {
        return { error: `❌ Prompt file not found: ${promptName}.md` };
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: meta, content: promptText } = matter(fileContent);

        return {
            meta: meta,
            content: promptText.trim(),
            model: meta.model || CONFIG.model,
            temperature: meta.temperature || CONFIG.temperature
        };
    } catch (error) {
        return { error: `❌ Error reading prompt file: ${error.message}` };
    }
}

// Function to send message to Claude API (with optional custom settings)
async function sendMessage(userInput, customModel = null, customTemperature = null) {
    // Add user message to history
    messages.push({ role: "user", content: userInput });

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "content-type": "application/json",
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: customModel || CONFIG.model,
                max_tokens: CONFIG.max_tokens,
                temperature: customTemperature || CONFIG.temperature,
                messages: messages // Send entire conversation history
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error);
            return null;
        }

        const assistantResponse = data.content[0].text.trim();

        // Add assistant response to history
        messages.push({ role: "assistant", content: assistantResponse });

        console.log(`\n💬 Claude: ${assistantResponse}\n`);

        return assistantResponse;

    } catch (error) {
        console.error("❌ Network Error:", error.message);
        return null;
    }
}

// Main chat loop
async function startChat() {
    console.log("🤖 Claude Terminal Chat");
    console.log("Type 'quit' to exit");
    console.log("Type 'clear' to clear message history");
    console.log("Type 'prompt [name]' to load a prompt from the prompts folder");
    console.log("─".repeat(50));

    const askQuestion = () => {
        rl.question("\n🟢 You: ", async (input) => {
            const trimmedInput = input.trim();

            // Handle quit command
            if (trimmedInput.toLowerCase() === 'quit') {
                console.log("\n👋 Goodbye!");
                rl.close();
                return;
            }

            // Handle clear command
            if (trimmedInput.toLowerCase() === 'clear') {
                messages = [];
                console.log("🧹 Message history cleared!");
                askQuestion();
                return;
            }

            // Handle prompt command
            if (trimmedInput.toLowerCase().startsWith('prompt ')) {
                const promptName = trimmedInput.slice(7).trim(); // Remove "prompt " prefix

                if (!promptName) {
                    console.log("❌ Please provide a prompt name. Example: prompt random-vegan-dish");
                    askQuestion();
                    return;
                }

                console.log(`📄 Loading prompt: ${promptName}...`);
                const promptData = loadPrompt(promptName);

                if (promptData.error) {
                    console.log(promptData.error);
                    askQuestion();
                    return;
                }

                console.log("⏳ Thinking...");
                const response = await sendMessage(promptData.content, promptData.model, promptData.temperature);

                if (response) {
                    askQuestion(); // Continue the conversation
                } else {
                    console.log("❌ Failed to get response. Try again or type 'quit' to exit.");
                    askQuestion();
                }
                return;

            }

            // Handle empty input
            if (!trimmedInput) {
                console.log("❌ Please enter a message or 'quit' to exit");
                askQuestion();
                return;
            }

            // Send message to Claude
            console.log("⏳ Thinking...");
            const response = await sendMessage(trimmedInput);

            if (response) {
                askQuestion(); // Continue the conversation
            } else {
                console.log("❌ Failed to get response. Try again or type 'quit' to exit.");
                askQuestion();
            }
        });
    };

    // Start the conversation
    askQuestion();
}

// Handle process termination
process.on('SIGINT', () => {
    console.log("\n\n👋 Chat interrupted!");
    process.exit(0);
});

// Start the chat
startChat();