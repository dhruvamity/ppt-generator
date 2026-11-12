import React from 'react';
import { Download } from 'lucide-react';
import ThemeSelector from '../components/Generator/ThemeSelector';
import SlideConfigPanel from '../components/Generator/SlideConfigPanel';
import RawTextInput from '../components/Generator/RawTextInput';
import SlidePreview from '../components/Generator/SlidePreview';
import { useStore, DEFAULT_THEME_ID } from '../store/useStore';
import toast from 'react-hot-toast';
import { exportToRevealJS } from '../utils/exportRevealJS';
import { THEMES } from '../utils/themeConfig';

export default function Generator() {
    const activeSlides = useStore(state => state.activeSlides);

    const handleExport = async () => {
        const state = useStore.getState();
        const { config: currentConfig, activeSlides: currentSlides, themeId: currentTheme, layoutId: currentLayout, savedThemes } = state;
        
        if (!currentSlides || currentSlides.length === 0) return;
        
        try {
            const themeData = THEMES[currentTheme] || savedThemes.find(t => t.id === currentTheme) || THEMES[DEFAULT_THEME_ID];
            exportToRevealJS(currentConfig, currentSlides, themeData, currentLayout);
            state.saveCurrentDeck();
            
            toast.success('HTML Presentation Downloaded successfully!');
        } catch (error) {
            console.error("Export Error:", error);
            toast.error(`Export failed: ${error.message}`);
        }
    };

    return (
        <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-24 pb-12 flex flex-col lg:flex-row gap-gutter">
            {/* Sidebar Configuration */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-6 sticky top-24">
                    <ThemeSelector />
                    <SlideConfigPanel />
                    <button
                        onClick={handleExport}
                        disabled={!activeSlides || activeSlides.length === 0}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary/90 disabled:bg-surface-variant disabled:text-outline disabled:cursor-not-allowed px-4 py-3 rounded-xl font-label-md text-sm transition-all shadow-md shadow-primary/20 mt-2"
                    >
                        <Download size={18} />
                        Download HTML Presentation
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">
                <RawTextInput />
                <SlidePreview />
            </div>
        </main>
    );
}
