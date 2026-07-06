import React, { useState, useMemo } from 'react';
import { Download, Settings, FileText, Info, CheckCircle, LayoutTemplate, Sparkles, Loader2 } from 'lucide-react';
import pptxgen from 'pptxgenjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Do not expose this key in public client-side code if deploying to the internet.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC9_Iv5THdJ_i96zlXk83uDBDzx82NThQY";

export default function App() {
    // --- State for Title Slide Configuration ---
    const [config, setConfig] = useState({
        mainTitle1: 'HCF &',
        mainTitle2: 'LCM',
        pill1: 'MATHEMATICS',
        pill2: '2026 EDITION',
        footer: 'JEE | CAT | COMPETITIVE EXAMS',
    });

    const [rawText, setRawText] = useState(
        `Case 1: Find the greatest possible number with which when we divide 37 and 58, it leaves the respective remainder of 2 and 3.
Case 2: Find the largest possible number with which when 60 and 98 are divided it leaves the remainders 3 in each case.
Case 3: Find the largest possible number with which when 38, 66 and 80 are divided the remainder remains the same.
2. Worked Examples
Exp. 13: Least number divided by 24, 32 or 42 leaving remainder 5 in each case.
Exp. 18: Least number divided by 18, 35 or 42 leaving 2, 19, 26 as remainders respectively.
Exp. 22: Least number divided by 13 leaving remainder 3 and by 5 leaving remainder 2.
3. HCF and Ratios Theory Questions
Question 1: The ratio of two numbers is 15:11. If their HCF is 13, then these numbers will be:
(a) 15:11
(b) 75:55
(c) 105:77
(d) 195:143
Question 2: The three numbers are in the ratio 1:2:3 and their HCF is 12. These numbers are:
(a) 4,8,12
(b) 5,10,15
(c) 24,48,72
(d) 12,24,36
4. Circular Path Application
Question: Four runners started running in the same direction around a circular path of 7 km. Their speeds are 4, 3, 9 and 3.5 km/hr. They started at 6 o'clock in the morning. At what time will all four runners be at the starting point together again?
5. Practice Questions (Q1 to Q15)
Q1: The sum of two numbers is 462 and their HCF is 22. What is the maximum possible number of pairs that satisfy these conditions?
(a) 3
(b) 2
(c) 8
(d) 6
Q2: The HCF of two natural numbers is 119 and their sum is 833. What are the numbers, if they differ by the minimum possible amount?
(a) 357 and 476
(b) 119 and 714
(c) 238 and 545
(d) 119 and 545`
    );

    const [aiQuestions, setAiQuestions] = useState(null);
    const [isParsing, setIsParsing] = useState(false);

    // --- AI Auto-Formatting Logic ---
    const handleAutoFormat = async () => {
        if (!rawText.trim()) return;
        setIsParsing(true);
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

            const prompt = `You are a strict data formatter for a presentation generator. Parse the following raw text into a valid JSON array of question objects.
Each object must have the following exact keys:
"badge" (e.g. "Q.1", "EXP.13", "CS.1" - should be short and capitalized)
"tag" (e.g. "Practice Question", "Worked Example", "Case Study", based on context headers or default to "Practice Question")
"qText" (the question text, merged into a continuous string)
"options" (extract options if they exist like (a), (b) into a horizontally formatted string like "(a) Option 1      (b) Option 2      (c) Option 3      (d) Option 4", or an empty string "" if none exist)

Raw text to format:
${rawText}

Respond ONLY with the JSON array without any markdown wrappers like \`\`\`json.`;

            const result = await model.generateContent(prompt);
            let text = result.response.text();
            
            // Extract just the JSON array to avoid parsing errors from AI preambles
            const arrayStart = text.indexOf('[');
            const arrayEnd = text.lastIndexOf(']');
            if (arrayStart === -1 || arrayEnd === -1) {
                throw new Error("AI did not return a valid JSON array.");
            }
            
            const jsonString = text.substring(arrayStart, arrayEnd + 1);
            const json = JSON.parse(jsonString);
            setAiQuestions(json);
        } catch (err) {
            console.error("AI Formatting Error:", err);
            alert(`Failed to auto-format: ${err.message}. Check the console for details.`);
        } finally {
            setIsParsing(false);
        }
    };

    // --- Local Regex Parsing Logic (Fallback) ---
    const localParsedQuestions = useMemo(() => {
        if (!rawText.trim()) return [];

        const lines = rawText.split('\n');
        let questions = [];
        let currentQ = null;
        let currentCategory = "Practice Question";
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;
            
            // Category heading
            if (/^\d+\.\s+[a-zA-Z\s\(\)0-9]+$/.test(line) && !line.includes(':') && !line.startsWith('Q')) {
                currentCategory = line.replace(/^\d+\.\s*/, '').trim();
                continue;
            }
            
            // Question start
            const qMatch = line.match(/^(Case\s*\d+|Exp\.\s*\d+|Question\s*\d*|Q\d+)[:.-]\s*(.*)/i);
            if (qMatch) {
                if (currentQ) {
                    questions.push(currentQ);
                }
                let rawBadge = qMatch[1].trim();
                
                let badge = "Q";
                if (/case/i.test(rawBadge)) {
                    badge = rawBadge.replace(/case/i, 'CS').replace(/\s/g, '.');
                } else if (/exp/i.test(rawBadge)) {
                    badge = rawBadge.replace(/exp/i, 'EXP').replace(/\s/g, '.');
                } else if (/question/i.test(rawBadge) || /^q\d/i.test(rawBadge.replace(/\s/g, ''))) {
                    let numMatch = rawBadge.match(/\d+/);
                    badge = numMatch ? `Q.${numMatch[0]}` : "Q";
                }
                
                currentQ = {
                    badge: badge.toUpperCase(),
                    tag: currentCategory,
                    text: [qMatch[2].trim()],
                    options: []
                };
            } else if (currentQ) {
                if (/^(\([a-dA-D]\)|[a-dA-D]\)|[a-dA-D]\.)/.test(line)) {
                    currentQ.options.push(line);
                } else if (/^Part \d+:/.test(line)) {
                    currentQ.text.push(line);
                } else {
                    if (/^\(\d+\)/.test(line)) {
                        currentQ.options.push(line);
                    } else {
                        currentQ.text.push(line);
                    }
                }
            }
        }
        if (currentQ) {
            questions.push(currentQ);
        }
        
        return questions.map(q => {
            let qText = q.text.join('\n');
            let allOptionsStr = q.options.join(' ');
            
            let formattedOptions = "";
            if (allOptionsStr) {
                formattedOptions = allOptionsStr
                    .replace(/(\([aA]\)|^[aA]\)|\b[aA]\.)/g, '(a)  ')
                    .replace(/(\([bB]\)|[bB]\)|\b[bB]\.)/g, '      (b)  ')
                    .replace(/(\([cC]\)|[cC]\)|\b[cC]\.)/g, '      (c)  ')
                    .replace(/(\([dD]\)|[dD]\)|\b[dD]\.)/g, '      (d)  ');
            }
            
            return {
                badge: q.badge,
                tag: q.tag,
                qText: qText,
                options: formattedOptions
            };
        });
    }, [rawText]);

    // Determine final questions to display (AI takes precedence if it exists)
    const finalQuestions = aiQuestions || localParsedQuestions;

    // --- PPTX Generation Logic ---
    const handleGenerate = () => {
        let pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';

        const bgColor = '05050F';
        const leftCyanBar = { x: 0, y: 0, w: 0.1, h: 5.625, fill: { color: '00E5FF' } };
        const leftPurpleBar = { x: 0.1, y: 0, w: 0.1, h: 5.625, fill: { color: '7C3AED' } };
        const decorTeal = { x: -0.5, y: 4.5, w: 2.5, h: 2.5, fill: { color: '008080', transparency: 70 }, shape: pres.ShapeType.ellipse };
        const decorPurple = { x: 8.5, y: -1, w: 3, h: 3, fill: { color: '7C3AED', transparency: 75 }, shape: pres.ShapeType.ellipse };
        const decorGold = { x: 9, y: 0.5, w: 1.5, h: 1.5, line: { color: 'FFD700', width: 4 }, shape: pres.ShapeType.ellipse, fill: { transparency: 100 } };

        // 1. Title Slide
        let slide = pres.addSlide();
        slide.background = { color: bgColor };
        slide.addShape(pres.ShapeType.rect, leftCyanBar);
        slide.addShape(pres.ShapeType.rect, leftPurpleBar);
        slide.addShape(pres.ShapeType.ellipse, decorTeal);
        slide.addShape(pres.ShapeType.ellipse, decorPurple);
        slide.addShape(pres.ShapeType.ellipse, decorGold);

        slide.addText([
            { text: config.mainTitle1 + ' ', options: { color: '00E5FF' } },
            { text: config.mainTitle2, options: { color: 'FFD700' } }
        ], { x: 1.2, y: 1.5, w: 8, h: 1.5, fontSize: 60, bold: true, fontFace: 'Arial' });

        slide.addShape(pres.ShapeType.rect, { x: 1.2, y: 3.0, w: 6.5, h: 0.04, fill: { color: 'FFD700' } });

        slide.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 3.4, w: 2.8, h: 0.5, fill: { color: '00E5FF' }, rectRadius: 0.3 });
        slide.addText(config.pill1, { x: 1.2, y: 3.4, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: '000000', align: 'center', fontFace: 'Arial', margin: [0, 0, 0, 0], valign: 'middle' });

        slide.addShape(pres.ShapeType.roundRect, { x: 4.4, y: 3.4, w: 2.8, h: 0.5, line: { color: '7C3AED', width: 2.5 }, fill: { color: '05050F' }, rectRadius: 0.3 });
        slide.addText(config.pill2, { x: 4.4, y: 3.4, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: 'A855F7', align: 'center', fontFace: 'Arial', margin: [0, 0, 0, 0], valign: 'middle' });

        slide.addText(config.footer, { x: 1.2, y: 4.2, w: 8, h: 0.5, fontSize: 16, color: 'FFFFFF', letterSpacing: 3, fontFace: 'Arial' });

        // 2. Questions Slides
        finalQuestions.forEach((q) => {
            // Question Slide
            let qSlide = pres.addSlide();
            qSlide.background = { color: bgColor };
            qSlide.addShape(pres.ShapeType.rect, leftCyanBar);
            qSlide.addShape(pres.ShapeType.rect, leftPurpleBar);
            qSlide.addShape(pres.ShapeType.ellipse, decorTeal);
            qSlide.addShape(pres.ShapeType.ellipse, decorPurple);
            qSlide.addShape(pres.ShapeType.ellipse, decorGold);

            qSlide.addText(q.badge, { x: 5.5, y: 3.5, w: 4, h: 2, fontSize: 90, bold: true, color: '7C3AED', transparency: 85, align: 'right' });

            qSlide.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 0.6, w: 1.2, h: 0.4, fill: { color: '00E5FF' }, rectRadius: 0.1 });
            qSlide.addText(q.badge, { x: 1.2, y: 0.6, w: 1.2, h: 0.4, fontSize: 16, bold: true, color: '000000', align: 'center', margin: [0, 0, 0, 0], valign: 'middle' });
            
            qSlide.addShape(pres.ShapeType.rect, { x: 2.6, y: 0.785, w: 2.5, h: 0.03, fill: { color: '00E5FF' } });
            qSlide.addShape(pres.ShapeType.rect, { x: 5.1, y: 0.785, w: 1.5, h: 0.03, fill: { color: '7C3AED' } });

            qSlide.addShape(pres.ShapeType.roundRect, { x: 6.8, y: 0.6, w: 2.8, h: 0.4, fill: { color: '0A0A1F' }, line: { color: '7C3AED', width: 1.5 }, rectRadius: 0.1 });
            qSlide.addText(q.tag.toUpperCase(), { x: 6.8, y: 0.6, w: 2.8, h: 0.4, fontSize: 14, color: 'A855F7', align: 'center', margin: [0, 0, 0, 0], valign: 'middle' });

            let textObjects = [
                { text: q.qText, options: { color: 'FFFFFF', fontSize: 24 } }
            ];
            if (q.options) {
                textObjects.push({ text: '\n\n', options: { fontSize: 24 } });
                textObjects.push({ text: q.options, options: { color: '00E5FF', fontSize: 18 } });
            }
            qSlide.addText(textObjects, { x: 1.2, y: 1.4, w: 8.4, h: 3.8, align: 'left', valign: 'top', autoFit: true });

            // Workspace Slide
            let wSlide = pres.addSlide();
            wSlide.background = { color: bgColor };
            wSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: 'FFD700' } });
            wSlide.addShape(pres.ShapeType.rect, { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: '7C3AED' } });
            
            // Add watermark BEFORE foreground text/lines
            wSlide.addText(q.badge, { x: 5.5, y: 3.5, w: 4, h: 2, fontSize: 90, bold: true, color: '7C3AED', transparency: 85, align: 'right' });
            
            wSlide.addText("WORK SPACE", { x: 1.0, y: 0.4, w: 4, h: 0.5, fontSize: 24, bold: true, color: 'FFD700' });
            
            for (let i = 0; i < 7; i++) {
                wSlide.addShape(pres.ShapeType.line, { x: 1.0, y: 1.2 + i * 0.6, w: 8.5, h: 0, line: { color: '4C1D95', width: 1, dashType: 'dash' } });
            }
        });

        pres.writeFile({ fileName: `${config.mainTitle1}_${config.mainTitle2}_Presentation.pptx`.replace(/\s+/g, '_') })
            .catch(err => {
                console.error("PPTX Generation Error:", err);
                alert(`Export failed: ${err.message}`);
            });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="bg-cyan-500 p-2 rounded-lg text-slate-950">
                                <LayoutTemplate size={24} />
                            </div>
                            Slide Generator Pro
                        </h1>
                        <p className="text-slate-400 mt-2">Automatically format plain text questions into a professional presentation.</p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={finalQuestions.length === 0}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-purple-900/20"
                    >
                        <Download size={20} />
                        Download PPTX
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Configuration */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                                <Settings size={20} className="text-cyan-400" />
                                Title Slide Config
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Title (Cyan Part)</label>
                                        <input
                                            type="text"
                                            value={config.mainTitle1}
                                            onChange={e => setConfig({ ...config, mainTitle1: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Title (Gold Part)</label>
                                        <input
                                            type="text"
                                            value={config.mainTitle2}
                                            onChange={e => setConfig({ ...config, mainTitle2: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Pill 1 (Cyan Background)</label>
                                    <input
                                        type="text"
                                        value={config.pill1}
                                        onChange={e => setConfig({ ...config, pill1: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Pill 2 (Purple Outline)</label>
                                    <input
                                        type="text"
                                        value={config.pill2}
                                        onChange={e => setConfig({ ...config, pill2: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Footer Text</label>
                                    <input
                                        type="text"
                                        value={config.footer}
                                        onChange={e => setConfig({ ...config, footer: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-slate-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-cyan-950/30 border border-cyan-900/50 p-5 rounded-xl flex flex-col gap-4">
                            <h3 className="text-cyan-400 font-semibold flex items-center gap-2">
                                <Info size={18} /> Format Options
                            </h3>
                            <p className="text-sm text-cyan-100/70">
                                You can use the local parser which handles well-structured content instantly, or use Gemini AI to automatically fix messy, unstructured pastes.
                            </p>
                            <button
                                onClick={handleAutoFormat}
                                disabled={isParsing || !rawText.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg"
                            >
                                {isParsing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                {isParsing ? 'AI is Formatting...' : 'Auto-Format with AI ✨'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Editor & Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-end mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <FileText size={20} className="text-purple-400" />
                                    Paste Questions & Options
                                </h2>
                                <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
                                    {finalQuestions.length} Questions Detected
                                </span>
                            </div>

                            <textarea
                                value={rawText}
                                onChange={(e) => {
                                    setRawText(e.target.value);
                                    if (aiQuestions) setAiQuestions(null); // Clear AI data when user types
                                }}
                                className="w-full h-80 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-purple-500 font-mono text-sm leading-relaxed"
                                placeholder="Paste your messy questions here..."
                                spellCheck="false"
                            ></textarea>
                            {aiQuestions && (
                                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                                    <CheckCircle size={14} /> AI Formatting Applied Successfully. Editing text will clear AI formatting.
                                </p>
                            )}
                        </div>

                        {/* Live Parser Preview */}
                        {finalQuestions.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-400" />
                                    Parsed Slides Preview
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {finalQuestions.map((q, idx) => (
                                        <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded text-xs">
                                                    {q.badge}
                                                </span>
                                                <span className="text-xs uppercase text-purple-400 border border-purple-800 px-2 py-0.5 rounded">
                                                    {q.tag}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">
                                                {q.qText}
                                            </p>
                                            {q.options && (
                                                <div className="text-xs text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800 truncate whitespace-pre">
                                                    {q.options}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
