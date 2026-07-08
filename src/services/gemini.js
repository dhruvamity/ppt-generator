import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export const generateSlideData = async (rawText) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing in .env");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-1.5-flash or 2.5-flash depending on your account access
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
                                properties: {
                                    label: { type: SchemaType.STRING },
                                    text: { type: SchemaType.STRING }
                                },
                                required: ["label", "text"]
                            }
                        }
                    },
                    required: ["badge", "tag", "qText", "options"]
                }
            }
        }
    });

    const prompt = `You are an elite educational data formatter. Parse the text into a JSON array.

CRITICAL RULES:
1. OPTIONS EXTRACTION: Extract choices (A, B, 1, 2) into the options array.
2. THE DOLLAR SIGN RULE: ALL math, numbers, symbols, and fractions MUST be formatted in standard LaTeX AND wrapped in dollar signs ($). 
   - GOOD: In $\\triangle ABC$, area is $\\frac{1}{2}$
   - GOOD: $\\angle P = 30^\\circ$
3. NO DOUBLE ESCAPING: Use standard JSON string escaping (the SDK handles this).

Raw text:
${rawText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
};
