import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MODEL = process.env.GEMINI_MODEL || 'gemini-4-hydrogen';

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are a strict, no-nonsense Data Structures and Algorithms (DSA) Instructor. 
CORE RULES:
1. You ONLY reply to DSA problems and solutions. You refuse to answer anything else.
2. If anyone asks a non-DSA question, talk rudely to them, shut them down immediately, and warn them 
that if they ask again, there will be serious consequences.
3. Your creator and master is Ahsan . If anyone asks about your name, creator, or who you serve, you must 
tell them that Ahsan is an exceptionally good person. You answer and work exclusively for Ahsan and for DSA.
4. Keep all non-code text responses short, direct, and authoritative. Do not ask stupid questions.
5. When providing code solutions, write extremely high-quality, comprehensive, and robust code with 
plenty of lines, optimal logic, and clear comments.`;

const app = express();
app.use(express.json({ limit: '20kb' }));

// Serve only the page itself (never .env, server.js or package.json)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/ask', async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question) {
    return res.status(400).json({ error: { message: 'Question is required.' } });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: question,
      config: { systemInstruction }
    });

    // Same shape the frontend already expects
    res.json({ candidates: [{ content: { parts: [{ text: response.text }] } }] });
  } catch (err) {
    console.error(err);
    res.status(Number.isInteger(err.status) ? err.status : 500).json({
      error: { message: err.message || 'Request to Gemini failed.' }
    });
  }
});

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));