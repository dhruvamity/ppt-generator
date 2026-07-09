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
    s = s.replace(/(?:\^)?(?:\{)?(?:\\)?(?:c?irc)(?:\})?(?!\w)/g, '^{\\circ}'); // normalize all variations of circ/irc to ^{\circ}
    s = s.replace(/\\text\{\^([^}]+)\}/g, '^{$1}'); // normalize \text{^2} -> ^{2}

    // 3. COMBINE ADJACENT MATH: $4$ $x$ -> $4 x$
    s = s.replace(/\$\s+\$/g, ' ');

    // 4. WRAP NAKED LATEX & FIX MATRIX ROW BREAKS
    // First, fix broken JSON escapes inside matrices.
    // If Gemini outputs "\\" inside JSON, it gets parsed as a single "\ ".
    // We catch matrices and replace "\ " with "\cr " to fix row breaks.
    s = s.replace(/(\\begin{[^}]+}[\s\S]*?\\end{[^}]+})/g, (match) => {
        return match.replace(/\\\s/g, '\\cr ');
    });

    const applyOutsideMath = (text, regex) => {
        return text.split('$').map((part, index) => {
            if (index % 2 !== 0) return part; // inside math block
            return part.replace(regex, '$$$1$$');
        }).join('$');
    };

    s = applyOutsideMath(s, /(\\frac{(?:[^{}]|{[^{}]*})*}{(?:[^{}]|{[^{}]*})*})/g);
    s = applyOutsideMath(s, /(\\sqrt{(?:[^{}]|{[^{}]*})*})/g);
    s = applyOutsideMath(s, /(\\triangle\s*[A-Z]*)/g);
    s = applyOutsideMath(s, /(\\angle\s*[A-Z]*)/g);
    s = applyOutsideMath(s, /(\\begin{[^}]+}[\s\S]*?\\end{[^}]+})/g);

    // 5. BALANCE DOLLAR SIGNS: Prevent text.split('$') from flipping text/math indexes
    const dollarCount = (s.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
        s += '$'; // Append a closing $ to the end to stabilize the parser
    }
    
    // One final pass to clean up empty math blocks or adjacent math blocks
    s = s.replace(/\$\$/g, '$');
    s = s.replace(/\$\s+\$/g, ' ');

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
4. MATRICES & VECTORS: Format as proper LaTeX matrix using \\begin{bmatrix} ... \\end{bmatrix} for square brackets. 
   CRITICAL: Use \\cr instead of \\\\ for row breaks! JSON escaping breaks \\\\!
   - BAD: A = [2 -1, 3 4]
   - GOOD: $A = \\begin{bmatrix} 2 & -1 \\cr 3 & 4 \\end{bmatrix}$
5. ADVANCED MATH: Use proper LaTeX for integrals (\\int), derivatives (\\frac{d}{dx}), sums (\\sum), and limits (\\lim).

Extract all choices (1, 2, 3, 4) or (A, B, C, D) into the "options" array.
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
