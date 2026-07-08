import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const convertFractions = (text) => {
    if (!text) return text;
    // OCR cleanups
    text = text.replace(/I(\d+)/g, '√$1');
    text = text.replace(/([a-zA-Z0-9])\/√(\d+)/g, '$\\frac{$1}{\\sqrt{$2}}$');
    
    let parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map(part => {
        if (part.startsWith('$')) return part;
        // Fix fractions
        let processed = part.replace(/\b(\d+)\/(\d+)\b/g, '$\\frac{$1}{$2}$');
        // Fix stray square roots if they are standalone
        processed = processed.replace(/√(\d+)/g, '$\\sqrt{$1}$');
        return processed;
    }).join('');
};

// Helper function for local parsing
export const parseLocalText = (rawText) => {
    if (!rawText || !rawText.trim()) return [];

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
                    let label = match[1].replace(/[\(\)\.]/g, '').toLowerCase();
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
};

export const useStore = create(
    persist(
        (set, get) => ({
            // Presentation Config
            config: initialConfig,
            setConfig: (newConfig) => set({ config: { ...get().config, ...newConfig } }),

            // Raw Text & Parsing
            rawText: defaultRawText,
            setRawText: (text) => set({ rawText: text, aiQuestions: null }),
            
            aiQuestions: null,
            setAiQuestions: (questions) => set({ 
                aiQuestions: questions, 
                ...(questions ? { activeSlides: questions } : {})
            }),

            isParsing: false,
            setIsParsing: (parsing) => set({ isParsing: parsing }),

            activeSlides: [],
            setActiveSlides: (slides) => set({ activeSlides: slides }),
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
            themeId: 'dark-neon',
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
                themeId: 'dark-neon',
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
