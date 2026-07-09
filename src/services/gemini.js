import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// INDESTRUCTIBLE MATH SANITIZER
const sanitizeMath = (str) => {
    if (!str || typeof str !== 'string') return str;
    let s = str;

    // 1. ERADICATE NESTING: Remove $ signs inside fractions or roots
    s = s.replace(/{\$/g, '{').replace(/\$}/g, '}');
    s = s.replace(/\$\\sqrt/g, '\\sqrt');

    // 2. NORMALIZE BLOCK MATH: Convert $$ to $ so text.split('$') doesn't break on empty strings
    s = s.replace(/\$\$/g, '$');

    // 2.5 FIX AI HALLUCINATIONS: Restore missing spaces and fix \circ tokenization glitches
    s = s.replace(/\\angle([A-Za-z])/g, '\\angle $1'); // \angleABC -> \angle ABC
    s = s.replace(/\\triangle([A-Za-z])/g, '\\triangle $1'); // \triangleABC -> \triangle ABC
    s = s.replace(/(?:\\^)?(?:\\{)?(?:\\\\)?(?:c?irc)(?:\\})?(?!\\w)/g, '^{\\circ}'); // normalize all variations of circ/irc to ^{\circ}

    // 3. COMBINE ADJACENT MATH: $4$ $x$ -> $4 x$
    s = s.replace(/\$\s+\$/g, ' ');

    // 4. WRAP NAKED LATEX: Catch fractions/symbols the AI forgot to wrap
    s = s.replace(/(?<!\$)(\\frac{[^{}]+}{[^{}]+})(?!\$)/g, '$$$1$$');
    s = s.replace(/(?<!\$)(\\sqrt{[^{}]+})(?!\$)/g, '$$$1$$');
    s = s.replace(/(?<!\$)(\\triangle\s*[A-Z]*)(?!\$)/g, '$$$1$$');
    s = s.replace(/(?<!\$)(\\angle\s*[A-Z]*)(?!\$)/g, '$$$1$$');

    // 5. BALANCE DOLLAR SIGNS: Prevent text.split('$') from flipping text/math indexes
    const dollarCount = (s.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
        s += '$'; // Append a closing $ to the end to stabilize the parser
    }

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
        qText: sanitizeMath(slide.qText),
        options: (slide.options || []).map(opt => ({
            label: String(opt.label).replace(/[()]/g, ''),
            text: sanitizeMath(opt.text)
        }))
    }));
};
