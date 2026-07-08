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

        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
            return res.status(500).json({ 
                error: "API Key missing! You need to add VITE_GEMINI_API_KEY to your Vercel Environment Variables."
            });
        }

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const prompt = `You are an elite educational data formatter for a presentation generator. Parse the raw text into a valid JSON array of question objects.
Each object must have exactly these keys: "badge", "tag", "qText", "options".

- "badge": A short capitalized label (e.g. "Q.1", "EXP.13", "CS.1").
- "tag": A category string based on context headings (e.g. "Practice Question", "Worked Example", "Case Study"). Default to "Practice Question" if ambiguous.
- "qText": The question text as a string.
- "options": The extracted options as an array of objects, where each object has a "label" (e.g., "a", "b", "1") and "text" (the content). If no options exist, return an empty array [].

CRITICAL FORMATTING RULES TO PREVENT SLIDE OVERFLOW:

RULE 1 — SPACE ECONOMY (HIGHEST PRIORITY):
- Presentation slides have limited vertical space. DO NOT use excessive double newlines (\\n\\n).
- Use single newlines (\\n) to separate sub-parts or bullet points within qText to save space.

RULE 2 — MULTI-PART QUESTIONS:
If a question has "Part 1" and "Part 2" (or I/II, or Statement I/II), it is ONE question with TWO sub-parts.
- In "qText": Put both parts separated by a SINGLE newline (\\n).
- In "options": You MUST detect when there are TWO separate sets of (a)(b)(c)(d).
  If it has two separate sets, combine them logically or leave "options" empty and put them in "qText".

RULE 3 — COMPACT OPTIONS (GRID LAYOUT):
- Always extract options into the "options" array.
- E.g., if text has (A) 12 (B) 14, options should be [{"label": "A", "text": "12"}, {"label": "B", "text": "14"}]
- ONLY use this array structure. Do NOT return a string for options.

RULE 4 — MATHEMATICAL NOTATION:
- Preserve subscripts and superscripts as plain text: N₁ → "N1", 6⁶ → "6^6", x² → "x^2".
- Use ^ for exponents and simple notation for subscripts.

RULE 5 — ASSERTION (A) & REASON (R):
- Separate the Assertion text and Reason text with a single \\n in qText.

RULE 6 — JSON SAFETY:
- Escape all newlines as \\n in JSON string values.
- Escape double quotes with backslash.
- Do NOT use actual unescaped line breaks inside JSON string values.

Raw text to format:
${rawText}

Respond ONLY with the JSON array. Do not include markdown wrappers like \`\`\`json.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt
        });
        
        let text = response.text;
        
        // Strip markdown code fences if the model wraps the output
        text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        
        const arrayStart = text.indexOf('[');
        const arrayEnd = text.lastIndexOf(']');
        if (arrayStart === -1 || arrayEnd === -1) {
            throw new Error("AI did not return a valid JSON array.");
        }
        
        const jsonString = text.substring(arrayStart, arrayEnd + 1);
        const json = JSON.parse(jsonString);
        
        // Validate structure
        if (!Array.isArray(json) || json.length === 0) {
            throw new Error("AI returned an empty or invalid array.");
        }
        
        // Ensure every object has required keys
        const validated = json.map((item, i) => ({
            badge: item.badge || `Q.${i + 1}`,
            tag: item.tag || 'Practice Question',
            qText: item.qText || '',
            options: Array.isArray(item.options) ? item.options : []
        }));
        
        res.json(validated);
    } catch (err) {
        console.error("AI Formatting Error:", err);
        res.status(500).json({ error: err.message || "Failed to process text." });
    }
});

app.listen(port, () => {
    console.log(`Express server running on http://localhost:${port}`);
});
