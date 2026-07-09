import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// SAFETY NET: Finds naked LaTeX and forces dollar signs around it
const autoWrapMath = (str) => {
    if (typeof str !== 'string' || !str) return str;
    let s = str;
    // Fix unwrapped fractions
    s = s.replace(/(?<!\$)(\\frac{[^{}]+}{[^{}]+})(?!\$)/g, '$$$1$$');
    // Fix unwrapped square roots
    s = s.replace(/(?<!\$)(\\sqrt{[^{}]+})(?!\$)/g, '$$$1$$');
    // Fix unwrapped geometry symbols
    s = s.replace(/(?<!\$)(\\triangle\s*[A-Z]*)(?!\$)/g, '$$$1$$');
    s = s.replace(/(?<!\$)(\\angle\s*[A-Z]*)(?!\$)/g, '$$$1$$');
    // Fix stray degree symbols
    s = s.replace(/(?<!\$)(\d+^\circ)(?!\$)/g, '$$$1$$');
    return s;
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

    const prompt = `Parse the text into a JSON array. Extract choices into the options array. 
CRITICAL: ALL math, fractions, and symbols MUST be in LaTeX AND wrapped in dollar signs ($). 
Use \\frac{a}{b} for fractions. NO SLASHES.\n\n${rawText}`;

    const result = await model.generateContent(prompt);
    const rawData = JSON.parse(result.response.text());

    // Apply the safety net to all text fields
    return rawData.map(slide => ({
        ...slide,
        qText: autoWrapMath(slide.qText),
        options: (slide.options || []).map(opt => ({
            label: opt.label.replace(/[()]/g, ''),
            text: autoWrapMath(opt.text)
        }))
    }));
};
