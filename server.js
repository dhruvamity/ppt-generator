import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

app.post('/api/generate', async (req, res) => {
    try {
        const { rawText } = req.body;
        
        if (!rawText || !rawText.trim()) {
            return res.status(400).json({ error: "No text provided." });
        }

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const prompt = `You are a strict data formatter for a presentation generator. Parse the following raw text into a valid JSON array of question objects.
Each object must have the following exact keys:
"badge": (e.g. "Q.1", "EXP.13", "CS.1" - should be short and capitalized)
"tag": (e.g. "Practice Question", "Worked Example", "Case Study", based on context headers or default to "Practice Question")
"qText": The question text.
"options": The extracted options.

STRICT FORMATTING RULES:
1. Vertical Spacing for Sub-parts: If a question contains sub-sections (e.g., "Part 1:", "Part 2:", "Statement I:", "Statement II:", or "I.", "II.", "III."), you MUST insert a double newline (\\n\\n) before each sub-section so they appear on distinct, spaced-out lines in qText.
2. Multi-Part Options: If a question has separate options for different parts, format them on separate lines using \\n (e.g., Part 1: (a) 36 (b) 42\\nPart 2: (a) 480 (b) 360).
3. Standard Option Formatting: For short options, use 4 spaces to separate them. For long options (or if there are 4+ options), format them as a 2x2 grid using \\n (e.g., (a) Option 1    (b) Option 2\\n(c) Option 3    (d) Option 4). If no options exist, return an empty string "".
4. JSON Safety: You MUST properly escape all newline characters as \\n in the JSON string so that JSON.parse() does not throw an error.

Raw text to format:
${rawText}

Respond ONLY with the JSON array. Do not include markdown wrappers like \`\`\`json.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt
        });
        
        let text = response.text;
        
        const arrayStart = text.indexOf('[');
        const arrayEnd = text.lastIndexOf(']');
        if (arrayStart === -1 || arrayEnd === -1) {
            throw new Error("AI did not return a valid JSON array.");
        }
        
        const jsonString = text.substring(arrayStart, arrayEnd + 1);
        const json = JSON.parse(jsonString);
        
        res.json(json);
    } catch (err) {
        console.error("AI Formatting Error:", err);
        res.status(500).json({ error: err.message || "Failed to process text." });
    }
});

app.listen(port, () => {
    console.log(`Express server running on http://localhost:${port}`);
});
