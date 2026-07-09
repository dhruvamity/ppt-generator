import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Fault-Tolerant Cleanup: Removes nested $ signs inside fractions or roots if the AI disobeys
const cleanMangledMath = (text) => {
    if (!text) return text;
    let cleanText = text;
    // Remove $ signs that are immediately followed by \sqrt or inside \frac
    cleanText = cleanText.replace(/{\$/g, '{').replace(/\$}/g, '}');
    cleanText = cleanText.replace(/\$\\sqrt/g, '\\sqrt');
    // Combine adjacent math blocks separated by spaces e.g., $4$ $x$ -> $4 x$
    cleanText = cleanText.replace(/\$\s+\$/g, ' ');
    return cleanText;
};

export const generateSlideData = async (rawText) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing in .env");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        badge: { type: SchemaType.STRING },
                        tag: { type: SchemaType.STRING },
                        qText: { type: SchemaType.STRING },
                        options: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: { label: { type: SchemaType.STRING }, text: { type: SchemaType.STRING } }
                            }
                        }
                    }
                }
            }
        }
    });

    const prompt = `You are an elite educational data formatter. Parse the text into a JSON array.

CRITICAL MATH RULES:
1. USE ONLY ONE PAIR OF DOLLAR SIGNS per equation/expression. Combine adjacent numbers and math!
   - BAD: 4($\\sqrt{2}$ - 1) cm
   - GOOD: $4(\\sqrt{2} - 1)$ cm
2. NEVER NEST DOLLAR SIGNS. DO NOT put $ inside fractions or roots!
   - BAD: $\\frac{500}{$\\sqrt{3}$}$
   - GOOD: $\\frac{500}{\\sqrt{3}}$
   - BAD: Area ($\\triangle$ADE)
   - GOOD: Area $(\\triangle ADE)$
3. NO SLASHES for fractions. ALWAYS use \\frac{numerator}{denominator}.
   - BAD: $1/2$
   - GOOD: $\\frac{1}{2}$

Extract all choices (1, 2, 3, 4) into the "options" array.
Raw text:
${rawText}`;

    const result = await model.generateContent(prompt);
    const rawData = JSON.parse(result.response.text());

    return rawData.map((slide, i) => ({
        ...slide,
        badge: `Q.${i + 1}`, // Ensure standard numbering
        qText: cleanMangledMath(slide.qText),
        options: (slide.options || []).map(opt => ({
            label: String(opt.label).replace(/[()]/g, ''),
            text: cleanMangledMath(opt.text)
        }))
    }));
};
