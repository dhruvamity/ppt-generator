import React, { useEffect, useMemo } from 'react';
import { useStore, parseLocalText } from '../../store/useStore';
import { Layers, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import LiveSlidePreview from './LiveSlidePreview';
import { THEMES } from '../../utils/pptxEngine';

export default function SlidePreview() {
    const aiQuestions = useStore(state => state.aiQuestions);
    const rawText = useStore(state => state.rawText);
    const themeId = useStore(state => state.themeId);
    const config = useStore(state => state.config);
    const savedThemes = useStore(state => state.savedThemes);
    
    const activeSlides = useStore(state => state.activeSlides);
    const setActiveSlides = useStore(state => state.setActiveSlides);
    const removeSlide = useStore(state => state.removeSlide);
    const moveSlideUp = useStore(state => state.moveSlideUp);
    const moveSlideDown = useStore(state => state.moveSlideDown);

    useEffect(() => {
        setActiveSlides(aiQuestions || parseLocalText(rawText));
    }, [aiQuestions, rawText, setActiveSlides]);

    if (!activeSlides || activeSlides.length === 0) return null;

    const currentTheme = THEMES[themeId] || savedThemes.find(t => t.id === themeId) || THEMES['dark-neon'];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="font-headline-md text-lg font-semibold text-on-surface flex items-center gap-2">
                    <Layers size={18} className="text-secondary" />
                    Live Presentation Preview
                </h3>
                <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold font-label-sm border border-outline-variant">
                    {activeSlides.length + 1} Slides Ready
                </span>
            </div>
            
            <div className="flex flex-col gap-8 max-h-[800px] overflow-y-auto pr-2 pb-8 custom-scrollbar">
                {/* Title Slide Preview */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider pl-1">Title Slide</span>
                    <LiveSlidePreview theme={currentTheme} type="title" config={config} />
                </div>

                {/* Question Slides Preview */}
                {activeSlides.map((q, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center pl-1 pr-1">
                            <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Slide {idx + 2}</span>
                            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg p-1">
                                <button onClick={() => moveSlideUp(idx)} disabled={idx === 0} className="p-1 hover:bg-surface-variant text-on-surface-variant rounded disabled:opacity-30 transition-colors">
                                    <ArrowUp size={16} />
                                </button>
                                <button onClick={() => moveSlideDown(idx)} disabled={idx === activeSlides.length - 1} className="p-1 hover:bg-surface-variant text-on-surface-variant rounded disabled:opacity-30 transition-colors">
                                    <ArrowDown size={16} />
                                </button>
                                <button onClick={() => removeSlide(idx)} className="p-1 hover:bg-error/10 text-error rounded transition-colors ml-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <LiveSlidePreview theme={currentTheme} type="question" questionData={q} />
                    </div>
                ))}
            </div>
        </div>
    );
}
