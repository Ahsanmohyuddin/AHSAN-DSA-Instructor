# AHSAN DSA Instructor

A self-hosted web app that answers data structures and algorithms questions through the Gemini API, with the API key kept safely on the server.

![Dashboard](screenshots/dashboard.png)

## Overview

AHSAN DSA Instructor is a single-page dashboard backed by a small Express server. You type a DSA question, the server forwards it to Gemini with a fixed instructor persona, and the answer is shown with formatted code blocks and copy buttons.

The API key and system prompt live only on the server, so the page can be hosted without exposing credentials to the browser.

## Features

- DSA-focused instructor persona, defined server-side in `server.js`
- Express backend that proxies requests to Gemini (the key never reaches the browser)
- Formatted answers with code blocks and one-click **Copy** buttons
- Quick-prompt chips and clickable popular topics that fill the question box
- Loading indicator, error messages, and Enter-to-send (Shift+Enter for a new line)
- Responsive dark UI: sidebar on desktop, icon rail on tablets, bottom tab bar on phones
- Standalone `index.js` script to test your key and model from the terminal

> The sidebar items (History, Tutorials, Playground, Settings), the Dark Mode and Profile buttons, and the two stat cards are visual placeholders. They have no backend behavior yet.

## Prerequisites

- **Node.js 20 or newer** (`node -v` to check)
- **npm 10 or newer** (`npm -v` to check)
- **A Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey). Valid keys start with `AIza`.

The project uses ES modules (`"type": "module"` in `package.json`).

## Quickstart

### 1. Install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

If you are setting up from scratch, install the dependencies manually:

```bash
npm install express dotenv @google/genai
```

### 2. Configure

Create your environment file from the template:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

Open `.env` and set your key. No quotes, no spaces around `=`:

```env
GEMINI_API_KEY=AIza...your-key...
GEMINI_MODEL=gemini-4-hydrogen
PORT=3000
```

### 3. Verify your key and model (optional but recommended)

```bash
node index.js
```

If this prints an answer, your configuration works.

### 4. Run

```bash
npm start
```

You should see `Running at http://localhost:3000`. Open <http://localhost:3000> in your browser.

> Do not open `index.html` by double-clicking it. The page calls `/api/ask`, which only exists while the server is running.

## Usage

Type a DSA question in the input box and press **Enter** (or click **Ask Coding Instructor**). Use **Shift + Enter** for a new line.

Examples:

- `Implement binary search in Python and explain its time complexity.`
- `Explain how a min-heap works and implement it in Java.`
- `Solve the two-sum problem optimally in JavaScript.`

The instructor is configured to answer DSA questions only. Other questions get a short, harsh refusal by design.

### Call the API directly

With the server running:

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Implement binary search in Python and explain its time complexity."}'
```

PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/ask -Method Post `
  -ContentType "application/json" `
  -Body '{"question": "Implement binary search in Python and explain its time complexity."}'
```

### API reference

**`POST /api/ask`**

Request body:

```json
{ "question": "string" }
```

Success response (Gemini response shape):

```json
{
  "candidates": [
    { "content": { "parts": [{ "text": "...answer in Markdown..." }] } }
  ]
}
```

Error response (non-2xx status):

```json
{ "error": { "message": "Description of what went wrong." } }
```

| Status | Meaning                                        |
| ------ | ---------------------------------------------- |
| 400    | Missing or empty `question`, or invalid API key |
| 404    | Model name not found                            |
| 429    | Rate limit reached                              |
| 500    | Server or upstream error                        |

## Configuration

Set these in `.env`:

| Variable         | Required | Default             | Description                                                                 |
| ---------------- | -------- | ------------------- | --------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | Yes      | none                | Gemini API key. The server exits on startup if it is missing.               |
| `GEMINI_MODEL`   | No       | `gemini-4-hydrogen` | Model name sent to Gemini. Use any model your key can access, e.g. `gemini-2.5-flash`. |
| `PORT`           | No       | `3000`              | Port the Express server listens on.                                         |

Changes to `.env` are read only at startup. Restart the server after editing it.

### Customizing the instructor

The persona is the `systemInstruction` constant in `server.js`. Edit the rules there to change the tone, the allowed topics, or the answer format, then restart the server.

## Project Structure

```
.
├── index.html          # Frontend: UI, styles, and client script (calls POST /api/ask)
├── server.js           # Express server: serves index.html and proxies requests to Gemini
├── index.js            # Standalone CLI script to test your key and model
├── package.json        # Dependencies and the `npm start` script
├── package-lock.json
├── .env                # Your local secrets (git-ignored, never commit)
├── .env.example        # Template for .env
├── .gitignore          # Excludes node_modules/ and .env
└── screenshots/        # Images used in this README
```

Core logic:

- **`server.js`**: validates the question, calls the Gemini SDK with the system instruction, and returns the result.
- **`index.html`**: sends the question to `/api/ask`, renders the answer, and adds copy buttons to code blocks.

## Troubleshooting

| Problem | Cause and fix |
| ------- | ------------- |
| `Cannot find package 'express'` | Dependencies are missing. Run `npm install express dotenv @google/genai`. |
| `API key not valid` | The key is wrong or malformed. Create a new one in [AI Studio](https://aistudio.google.com/apikey); it should start with `AIza`. Restart the server after saving `.env`. |
| `Missing GEMINI_API_KEY in .env` | `.env` is missing, in the wrong folder, or the variable name is misspelled. It must sit next to `server.js`. |
| `model not found` / 404 | Change `GEMINI_MODEL` to a model your key can access, e.g. `gemini-2.5-flash`. |
| `response is not defined` in `index.js` | `console.log(response.text)` is outside the `main()` function. Keep it inside. |
| Page loads but requests fail | You opened `index.html` directly. Open <http://localhost:3000> instead. |
| `EADDRINUSE` | Port 3000 is taken. Change `PORT` in `.env` or stop the other process. |

## Security

- Never commit `.env`. It is listed in `.gitignore`; run `git status` before pushing to confirm.
- Never paste API keys into code, chats, issues, or screenshots. If a key is exposed, revoke it in Google AI Studio and create a new one.
- The server has no authentication or rate limiting. Add both before exposing it to the public internet.

## License & Docs

- Documentation: `<link-to-docs>`
- License: `<link-to-LICENSE>` (for example, MIT)
- Issues: `<link-to-issues>`
