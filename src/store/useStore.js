import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateSlideData } from '../services/gemini';
import toast from 'react-hot-toast';

const LATEX_COMMANDS = 'frac|sqrt|triangle|angle|circ|pi|theta|alpha|beta|gamma|delta|sum|prod|int|lim|infty|pm|times|div|cdot|leq|geq|neq|approx|equiv|subset|supset|cap|cup|in|notin|forall|exists|nabla|partial|rightarrow|leftarrow|Rightarrow|Leftarrow|text';

const applyOutsideMath = (text, fn) => {
    return text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map(part => {
        if (part.startsWith('$')) return part;
        return fn(part);
    }).join('');
};

export const normalizeMathText = (text) => {
    if (!text) return text;

    let normalized = text.replace(/I(\d+)/g, '√$1');

    normalized = applyOutsideMath(normalized, (part) => {
        let processed = part;

        processed = processed.replace(
            new RegExp(`\\\\\\\\(${LATEX_COMMANDS})\\b`, 'g'),
            '\\$1'
        );

        processed = processed.replace(/\\(triangle|angle|circ)([A-Za-z])/g, '\\$1 $2');
        processed = processed.replace(/(\\(?:triangle|angle)\s*[A-Za-z]{1,4})(?:\s*)\1/g, '$1');
        processed = processed.replace(/\b([A-Z]{1,3}\s*=\s*-?\d+(?:\.\d+)?)(?:\s*)\1\b/g, '$1');

        return processed;
    });

    const wrapOutsideMath = (source, regex) => applyOutsideMath(source, (part) => (
        part.replace(regex, (match) => `$${match.trim()}$`)
    ));

    normalized = wrapOutsideMath(
        normalized,
        /\\(?:triangle|angle)\s*[A-Za-z]{1,4}(?:\s*=\s*-?\d+(?:\.\d+)?\s*\^\\circ)?/g
    );
    normalized = wrapOutsideMath(normalized, /\b-?\d+(?:\.\d+)?\s*\^\\circ\b/g);
    normalized = wrapOutsideMath(normalized, /\b[A-Z]{1,3}\s*=\s*-?\d+(?:\.\d+)?\b/g);

    return normalized;
};

export const convertFractions = (text) => {
    if (!text) return text;
    text = normalizeMathText(text);
    text = text.replace(/([a-zA-Z0-9])\/√(\d+)/g, '$\\frac{$1}{\\sqrt{$2}}$');
    
    let parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map(part => {
        if (part.startsWith('$')) return part;
        // Fix fractions
        let processed = part.replace(/\b(\d+)\/(\d+)\b/g, '$\\frac{$1}{$2}$');
        // Fix stray square roots if they are standalone
        processed = processed.replace(/√(\d+)/g, '$\\sqrt{$1}$');
        // Wrap exponents/powers as LaTeX superscripts
        processed = processed.replace(/\b([a-zA-Z0-9]+)\^(-?\d+|\([^)]+\)|\{[^}]+\})/g, (m, base, exp) => {
            const e = exp.replace(/^[({]|[)}]$/g, '');
            return `$${base}^{${e}}$`;
        });
        return processed;
    }).join('');
};

// Helper function for local parsing
export const parseLocalText = (rawText) => {
    if (!rawText || !rawText.trim()) return [];

    // Strip markdown formatting (bold/italics)
    let cleanText = rawText.replace(/(\*\*|\*|__|_)/g, '');
    const lines = cleanText.split('\n');
    let questions = [];
    let currentQ = null;
    let currentCategory = "Practice Question";
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        // Category heading
        if (/^\d+\.\s+[a-zA-Z\s()0-9]+$/.test(line) && !line.includes(':') && !line.startsWith('Q')) {
            currentCategory = line.replace(/^\d+\.\s*/, '').trim();
            continue;
        }
        
        // Question start
        const qMatch = line.match(/^\s*(Case\s*\d+|Exp\.\s*\d+|Question\s*\d*|Q\.?\d+)[:.-]?\s*(.*)/i);
        if (qMatch) {
            if (currentQ) {
                questions.push(currentQ);
            }
            
            currentQ = {
                badge: 'Q', // Temporary, overridden in map
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
    
    return questions.map((q, index) => {
        let qText = q.text.join('\n');
        
        let parsedOptions = [];
        if (q.options && q.options.length > 0) {
            parsedOptions = q.options.map(optStr => {
                let match = optStr.match(/^(\([a-dA-D]\)|[a-dA-D]\)|[a-dA-D]\.|\(\d+\))\s*(.*)/);
                if (match) {
                    let label = match[1].replace(/[().]/g, '').toLowerCase();
                    if (!isNaN(label)) {
                        const numMap = { '1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e' };
                        label = numMap[label] || label;
                    }
                    return { label: label, text: convertFractions(match[2].trim()) };
                }
                return { label: '', text: convertFractions(optStr.trim()) };
            });
        }
        
        return {
            badge: `Q.${index + 1}`,
            tag: q.tag,
            qText: convertFractions(qText),
            options: parsedOptions
        };
    });
};

const defaultRawText = `Case 1: Find the greatest possible number with which when we divide 37 and 58, it leaves the respective remainder of 2 and 3.
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
(d) 195:143`;

const initialConfig = {
    mainTitle1: 'HCF &',
    mainTitle2: 'LCM',
    pill1: 'MATHEMATICS',
    pill2: '2026 EDITION',
    footer: 'JEE | CAT | COMPETITIVE EXAMS',
    insertBlankSlides: false,
};

export const useStore = create(
    persist(
        (set, get) => ({
            // Presentation Config
            config: initialConfig,
            setConfig: (newConfig) => set({ config: { ...get().config, ...newConfig } }),

            // Raw Text & Parsing
            rawText: defaultRawText,
            setRawText: (text) => set({ rawText: text }),
            
            aiQuestions: null,
            setAiQuestions: (questions) => set({ 
                aiQuestions: questions, 
                ...(questions ? { activeSlides: questions } : {})
            }),

            isParsing: false,
            setIsParsing: (parsing) => set({ isParsing: parsing }),

            generateFromAI: async (token) => {
                const { rawText } = get();
                set({ isParsing: true });
                try {
                    const data = await generateSlideData(rawText, token);
                    
                    const indexedData = data.map((slide, i) => ({
                        ...slide,
                        badge: `Q.${i + 1}`
                    }));
                    
                    const cleanText = indexedData.map((q, i) => {
                        let str = `${q.badge}: ${q.qText}`;
                        if (q.options && q.options.length > 0) {
                            str += '\n' + q.options.map(o => `(${o.label}) ${o.text}`).join('\n');
                        }
                        return str;
                    }).join('\n\n');
                    
                    set({ aiQuestions: indexedData, activeSlides: indexedData, rawText: cleanText, isParsing: false });
                } catch (error) {
                    console.error("AI Generation failed:", error);
                    set({ isParsing: false });
                    
                    let errorMessage = error.message || "Unknown error occurred";
                    if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.includes("rate limit")) {
                        toast.error("API Quota Exceeded 🚦\n\nYou have reached the free tier limit. Please wait a minute and try again.", {
                            duration: 6000,
                            style: { background: '#333', color: '#fff', fontSize: '14px', borderRadius: '8px' }
                        });
                    } else {
                        toast.error(`Generation Failed:\n${errorMessage}`, { 
                            duration: 5000,
                            style: { background: '#333', color: '#fff', fontSize: '14px', borderRadius: '8px' }
                        });
                    }
                }
            },

            activeSlides: [],
            setActiveSlides: (slides) => set({ activeSlides: slides }),
            updateSlideQuestion: (slideIndex, newText) => set((state) => {
                const newSlides = [...state.activeSlides];
                newSlides[slideIndex].qText = newText;
                return { activeSlides: newSlides, aiQuestions: newSlides };
            }),
            updateSlideTopic: (slideIndex, newTopic) => set((state) => {
                const newSlides = [...state.activeSlides];
                newSlides[slideIndex].topic = newTopic;
                return { activeSlides: newSlides, aiQuestions: newSlides };
            }),
            updateSlideOption: (slideIndex, optIndex, newText) => set((state) => {
                const newSlides = [...state.activeSlides];
                newSlides[slideIndex].options[optIndex].text = newText;
                return { activeSlides: newSlides, aiQuestions: newSlides };
            }),
            removeSlide: (index) => set((state) => {
                const filtered = state.activeSlides.filter((_, i) => i !== index);
                const renumbered = filtered.map((slide, i) => ({
                    ...slide,
                    badge: `Q.${i + 1}`
                }));
                return { activeSlides: renumbered };
            }),
            reorderSlides: (startIndex, endIndex) => set((state) => {
                const result = Array.from(state.activeSlides);
                const [removed] = result.splice(startIndex, 1);
                result.splice(endIndex, 0, removed);
                const renumbered = result.map((slide, i) => ({
                    ...slide,
                    badge: `Q.${i + 1}`
                }));
                return { activeSlides: renumbered };
            }),

            // Themes
            themeId: 'modern-neon',
            setThemeId: (id) => set({ themeId: id }),

            // Layout (independent from theme colors)
            layoutId: 'modern-sidebar',
            setLayoutId: (id) => set({ layoutId: id }),

            // Dashboard Persistence (Decks, Themes & Folders)
            recentDecks: [],
            addRecentDeck: (deck) => set((state) => ({ 
                recentDecks: [deck, ...state.recentDecks.filter(d => d.id !== deck.id)].slice(0, 10) 
            })),
            
            savedThemes: [],
            addSavedTheme: (theme) => set((state) => ({ 
                savedThemes: [...state.savedThemes, theme] 
            })),

            folders: ['Biology 101', 'SAT Math Prep', 'World History'],
            addFolder: (folderName) => set((state) => ({
                folders: [...state.folders, folderName]
            })),

            // Actions for routing
            loadDeck: (deck) => set({
                config: deck.config,
                rawText: deck.rawText,
                themeId: deck.themeId,
                layoutId: deck.layoutId || 'modern-sidebar',
                aiQuestions: deck.aiQuestions || null
            }),

            clearGeneratorState: () => set({
                config: initialConfig,
                rawText: defaultRawText,
                themeId: 'modern-neon',
                layoutId: 'modern-sidebar',
                aiQuestions: null
            })
        }),
        {
            name: 'slidegen-storage', 
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => key !== 'isParsing')
            ),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isParsing = false;
                }
            }
        }
    )
);
