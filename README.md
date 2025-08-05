# 🗂️ Prompt Library

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A central repository for storing and running reusable prompts from the terminal using the Claude API.

Prompts are stored as Markdown files with **frontmatter metadata**, making them easy to version control and reuse.

You can also start interactive chats with Claude directly from your terminal.

---

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Setup](#setup)
- [Usage](#usage)
    - Running Single Prompts
    - Interactive Chat
- [Writing Prompts](#writing-prompts)
- [Best Practices for Creating Prompts](#best-practices-for-creating-prompts)
- [Token Usage](#token-usage)
- [Security](#security)
- [License](#license)

---

## Features
- Store prompts in `prompts/` as `.md` files with **persona, task, context, and format**.
- Run prompts directly from the terminal.
- Interactive chat sessions with conversations in memory.
- Define model, temperature, and other settings per prompt in YAML frontmatter.
- Token usage statistics after each run.
- Extensible folder structure.

---

## Folder Structure

```plaintext
prompt-library/
├── prompts/              # All markdown prompt files
│   ├── random-vegan-dish.md
│   └── ...
├── scripts/              # Terminal scripts to run prompts
│   ├── run-prompt.js     # Single prompt runner
│   └── chat.js           # Interactive chat
├── .env                  # API keys (not committed)
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

---

## Setup

### 1. Clone the repo:

git clone git@github.com:nicholastickle/prompt-library.git
cd prompt-library


### 2. Install dependencies:

npm install

### 3. Add your Anthropic API key

Create a .env file in the project root:
ANTHROPIC_API_KEY=your_api_key_here

If you don't have an Anthropic API, check out here (https://console.anthropic.com/). FYI, when using the API you use up tokens. Which is not the same as the browser version.

### 4. Check .gitignore

Make sure .env is listed so secrets are not committed.

### 5. Check Claude version

Have a look at the claude version you want to use (see https://docs.anthropic.com/en/docs/about-claude/models/overview). Add the version to the .md prompt file to match the exact version seen online. The default version for this app is "claude-3-5-haiku-latest" which is used in the script if you don't specify a model.

---

## Usage

### Running Single Prompts

Example:

node scripts/run-prompt.js random-vegan-dish

This will:

- Load the .md file from /prompts
- Send it to Claude API
- Display the result in the terminal
- Show token usage

### Interactive Chat

Start a conversational chat session with Claude:

node scripts/chat.js

This will:

- Start an interactive terminal chat.
- Maintain conversation history throughout the session.
- Allow you to have back-and-forth conversations with Claude.

Chat commands:

quit - Exit the chat

clear - Clear conversation history and start fresh

The chat maintains context, so Claude will remember everything you've discussed during the session. Once the session is ended, claude will no longer remember the chat.

---

## Writing Prompts

Prompts use YAML frontmatter + Markdown body:

- name – internal prompt name (matches filename)
- description – short explanation of the prompt
- model – Claude model (e.g., claude-3-5-haiku-latest)
- temperature – creativity level (0 = precise, 1 = creative)

---

## Best Practices for Creating Prompts

To get the best results from Claude (or any LLM), follow this structure:

1. Persona: Describe who the AI should act as.
Example:

"You are a creative vegan chef with 15 years of experience developing unique plant-based recipes."

2. Task: Clearly state what you want done.
Example:

"Generate a unique vegan dish with a name, description, ingredient list, and cooking instructions."

3. Context: Provide background details and constraints to guide the output.
Example:

"Use only ingredients available in most UK supermarkets. Keep prep time under 30 minutes."

4. Format: Tell the AI exactly how to structure the response.

Example:

yaml

Copy code

Dish Name:

Description:

Ingredients (bullet list):

Instructions (numbered list):

Extra Tips:

- Use natural language — write as if you’re speaking to a person.
- Keep prompts specific but concise (aim for ~20–25 words).
- Iterate — tweak prompts and re-run if results aren’t right.
- Assign temperature:

0.0 → precise, repeatable outputs (good for coding/math)

0.7 → creative, varied outputs (good for recipes/ideas)

- If doing multiple tasks, split them into separate prompts.
- Add constraints like word count, tone, or number of options.
- Ask for feedback — let the AI suggest clarifying questions.

---

## Token Usage

After running a prompt, you’ll see:

Example:

- Input tokens: XXX
- Output tokens: XXX
- Total tokens: XXX

Note: The interactive chat feature does not display token usage to keep the conversation clean and focused.

---

## Security

- Never commit .env to GitHub.
- Keep the repo private if your prompts are sensitive.
- Rotate API keys if compromised.

---

## License

This project is licensed under the MIT License.

---

END