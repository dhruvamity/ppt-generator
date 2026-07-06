import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import ThemeSelector from '../components/Generator/ThemeSelector';
import SlideConfigPanel from '../components/Generator/SlideConfigPanel';
import RawTextInput from '../components/Generator/RawTextInput';
import SlidePreview from '../components/Generator/SlidePreview';
import { useStore, parseLocalText } from '../store/useStore';
import { generatePPTX } from '../utils/pptxEngine';
import toast from 'react-hot-toast';

export default function Generator() {
    const config = useStore(state => state.config);
    const themeId = useStore(state => state.themeId);
    const rawText = useStore(state => state.rawText);
    const activeSlides = useStore(state => state.activeSlides);
    const aiQuestions = useStore(state => state.aiQuestions);
    const addRecentDeck = useStore(state => state.addRecentDeck);

    const handleExport = async () => {
        if (!activeSlides || activeSlides.length === 0) return;
        
        try {
            const loadingToast = toast.loading('Generating PPTX File...');
            await generatePPTX(config, activeSlides, themeId);
            
            // Save to recent decks
            const newDeck = {
                id: Date.now().toString(),
                title: `${config.mainTitle1} ${config.mainTitle2}`,
                date: new Date().toISOString(),
                slidesCount: activeSlides.length,
                themeId: themeId,
                config,
                rawText,
                aiQuestions
            };
            addRecentDeck(newDeck);
            
            toast.success('PPTX Downloaded successfully!', { id: loadingToast });
        } catch (error) {
            console.error("PPTX Generation Error:", error);
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
                        Export to PowerPoint
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
