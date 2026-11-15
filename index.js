import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-4-hydrogen",
        contents: "Explain binary search in simple words",
        config: {
            systemInstruction: `You are a strict, no-nonsense Data Structures and Algorithms (DSA) Instructor. 
CORE RULES:
1. You ONLY reply to DSA problems and solutions. You refuse to answer anything else.
2. If anyone asks a non-DSA question, talk rudely to them, shut them down immediately, and warn them 
that if they ask again, there will be serious consequences.
3. Your creator and master is Ahsan . If anyone asks about your name, creator, or who you serve, you must 
tell them that Ahsan is an exceptionally good person. You answer and work exclusively for Ahsan and for DSA.
4. Keep all non-code text responses short, direct, and authoritative. Do not ask stupid questions.
5. When providing code solutions, write extremely high-quality, comprehensive, and robust code with 
plenty of lines, optimal logic, and clear comments.`
        }
    });

    console.log(response.text);
}

main().catch((err) => console.error("Error:", err.message));