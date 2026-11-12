import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateSlideData } from '../services/gemini';
import toast from 'react-hot-toast';

import { extractDocumentTitle, parseLocalText, serializeQuestions } from '../utils/questionParser.js';
import { DEFAULT_THUMBNAIL } from '../utils/thumbnailDesign.js';
export { normalizeMathText, convertFractions, extractDocumentTitle, parseLocalText } from '../utils/questionParser.js';

const editedSlidesState = (slides) => ({
    activeSlides: slides,
    aiQuestions: slides,
    rawText: serializeQuestions(slides),
});

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
            setRawText: (text) => set((state) => {
                const title = extractDocumentTitle(text);
                const previousTitle = extractDocumentTitle(state.rawText);
                const hasDefaultTitle = state.config.mainTitle1 === initialConfig.mainTitle1
                    && state.config.mainTitle2 === initialConfig.mainTitle2;
                if (!title || (title === previousTitle && !hasDefaultTitle)) return { rawText: text };
                const words = title.split(/\s+/);
                const mainTitle2 = words.length > 1 ? words.pop() : '';
                return {
                    rawText: text,
                    config: { ...state.config, mainTitle1: words.join(' '), mainTitle2 },
                };
            }),
            
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
                    const sourceQuestions = parseLocalText(rawText);
                    if (!Array.isArray(data) || data.length === 0) {
                        throw new Error('Formatting returned no questions. Please retry.');
                    }
                    if (sourceQuestions.length > data.length) {
                        throw new Error(`Formatting returned ${data.length} of ${sourceQuestions.length} detected questions. Please retry; your original text is preserved.`);
                    }
                    
                    const indexedData = data.map((slide, i) => ({
                        ...slide,
                        // Explicit shared ranges are authoritative. Preserve all
                        // table values even if the AI compresses the passage.
                        context: sourceQuestions.length === data.length && sourceQuestions[i].context
                            ? sourceQuestions[i].context
                            : (slide.context || ''),
                        badge: `Q.${i + 1}`
                    }));
                    
                    const cleanText = serializeQuestions(indexedData);
                    
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
                const newSlides = state.activeSlides.map((slide, index) => index === slideIndex ? { ...slide, qText: newText } : slide);
                return editedSlidesState(newSlides);
            }),
            updateSlideContext: (slideIndex, newText) => set((state) => {
                const newSlides = state.activeSlides.map((slide, index) => index === slideIndex ? { ...slide, context: newText } : slide);
                return editedSlidesState(newSlides);
            }),
            updateSlideTopic: (slideIndex, newTopic) => set((state) => {
                const newSlides = [...state.activeSlides];
                newSlides[slideIndex].topic = newTopic;
                return { activeSlides: newSlides, aiQuestions: newSlides };
            }),
            updateSlideOption: (slideIndex, optIndex, newText) => set((state) => {
                const newSlides = state.activeSlides.map((slide, index) => index === slideIndex ? {
                    ...slide,
                    options: slide.options.map((option, optionIndex) => optionIndex === optIndex ? { ...option, text: newText } : option),
                } : slide);
                return editedSlidesState(newSlides);
            }),
            removeSlide: (index) => set((state) => {
                const filtered = state.activeSlides.filter((_, i) => i !== index);
                const renumbered = filtered.map((slide, i) => ({
                    ...slide,
                    badge: `Q.${i + 1}`
                }));
                return editedSlidesState(renumbered);
            }),
            reorderSlides: (startIndex, endIndex) => set((state) => {
                const result = Array.from(state.activeSlides);
                const [removed] = result.splice(startIndex, 1);
                result.splice(endIndex, 0, removed);
                const renumbered = result.map((slide, i) => ({
                    ...slide,
                    badge: `Q.${i + 1}`
                }));
                return editedSlidesState(renumbered);
            }),

            // Themes
            themeId: 'modern-neon',
            setThemeId: (id) => set({ themeId: id }),

            // Layout (independent from theme colors)
            layoutId: 'modern-sidebar',
            setLayoutId: (id) => set({ layoutId: id }),

            // Thumbnail studio. The photo is a data URL kept in memory only (see partialize).
            thumbnail: DEFAULT_THUMBNAIL,
            setThumbnail: (patch) => set((state) => ({ thumbnail: { ...DEFAULT_THUMBNAIL, ...state.thumbnail, ...patch } })),
            setThumbnailPhotoAdjust: (patch) => set((state) => ({ thumbnail: { ...DEFAULT_THUMBNAIL, ...state.thumbnail, photo: { ...DEFAULT_THUMBNAIL.photo, ...state.thumbnail?.photo, ...patch } } })),
            thumbnailPhoto: null,
            setThumbnailPhoto: (href) => set({ thumbnailPhoto: href }),

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
                Object.entries(state).filter(([key]) => key !== 'isParsing' && key !== 'thumbnailPhoto')
            ),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isParsing = false;
                }
            }
        }
    )
);
