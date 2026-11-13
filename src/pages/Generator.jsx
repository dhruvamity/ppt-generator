import React, { useState } from 'react';
import { Download } from 'lucide-react';
import ThemeSelector from '../components/Generator/ThemeSelector';
import SlideConfigPanel from '../components/Generator/SlideConfigPanel';
import PresentationOptions from '../components/Generator/PresentationOptions';
import RawTextInput from '../components/Generator/RawTextInput';
import SlidePreview from '../components/Generator/SlidePreview';
import { useStore, DEFAULT_THEME_ID } from '../store/useStore';
import toast from 'react-hot-toast';
import { THEMES } from '../utils/themeConfig';

export default function Generator() {
    const activeSlides = useStore(state => state.activeSlides);

    const [exportStatus, setExportStatus] = useState('');
    const [perPage, setPerPage] = useState(4);
    const [includeAnswers, setIncludeAnswers] = useState(false);

    const handleExport = async format => {
        const state = useStore.getState();
        const { config: currentConfig, activeSlides: currentSlides, themeId: currentTheme, layoutId: currentLayout, savedThemes } = state;
        
        if (exportStatus || !currentSlides?.length) return;
        const printWindow = format === 'print' ? window.open('', '_blank') : null;
        if (format === 'print' && !printWindow) {
            toast.error('Allow pop-ups to open the handout print dialog.');
            return;
        }
        if (printWindow) printWindow.opener = null;
        setExportStatus('Preparing export…');
        
        try {
            const themeData = THEMES[currentTheme] || savedThemes.find(t => t.id === currentTheme) || THEMES[DEFAULT_THEME_ID];
            if (format === 'handout' || format === 'print') {
                const [{ offlineKatexCss }, { downloadHandout }] = await Promise.all([
                    import('../utils/exportKatexAssets.js'), import('../utils/handoutExport.js'),
                ]);
                downloadHandout(currentConfig, currentSlides, { perPage, includeAnswers }, offlineKatexCss, printWindow);
            } else if (format === 'pptx') {
                const { loadExportAssets } = await import('../utils/exportAssets.js');
                const exportAssets = await loadExportAssets();
                const { exportPowerPoint } = await import('../utils/powerPointExport.js');
                await exportPowerPoint(currentConfig, currentSlides, themeData, currentLayout, exportAssets,
                    (index, total) => setExportStatus(`Preparing slide ${index} of ${total}…`));
            } else {
                const [{ loadExportAssets }, { exportToRevealJS }] = await Promise.all([
                    import('../utils/exportAssets.js'), import('../utils/exportRevealJS.js'),
                ]);
                exportToRevealJS(currentConfig, currentSlides, themeData, currentLayout, await loadExportAssets());
            }
            state.saveCurrentDeck();
            
            if (!printWindow) toast.success('Download ready.');
        } catch (error) {
            printWindow?.close();
            console.error("Export Error:", error);
            toast.error(`Export failed: ${error.message}`);
        } finally {
            setExportStatus('');
        }
    };

    return (
        <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-24 pb-12 flex flex-col lg:flex-row gap-gutter">
            {/* Sidebar Configuration */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-6 sticky top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar">
                    <ThemeSelector />
                    <SlideConfigPanel />
                    <PresentationOptions />
                    <button
                        onClick={() => handleExport('html')}
                        disabled={Boolean(exportStatus) || !activeSlides?.length}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary/90 disabled:bg-surface-variant disabled:text-outline disabled:cursor-not-allowed px-4 py-3 rounded-xl font-label-md text-sm transition-all shadow-md shadow-primary/20 mt-2"
                    >
                        <Download size={18} />
                        Download HTML Presentation
                    </button>
                    <button type="button" onClick={() => handleExport('pptx')} disabled={Boolean(exportStatus) || !activeSlides?.length}
                        className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm hover:border-primary disabled:opacity-50">
                        Download PowerPoint
                    </button>
                    <details className="rounded-lg border border-outline-variant p-3 text-sm">
                        <summary className="cursor-pointer">Printable handout</summary>
                        <label className="mt-2 flex justify-between gap-2">Questions per page
                            <select value={perPage} onChange={event => setPerPage(Number(event.target.value))}>
                                {[2, 4, 6].map(count => <option key={count}>{count}</option>)}
                            </select>
                        </label>
                        <label className="mt-2 flex gap-2"><input type="checkbox" checked={includeAnswers} onChange={event => setIncludeAnswers(event.target.checked)} />Include answer key</label>
                        <button type="button" onClick={() => handleExport('handout')} disabled={Boolean(exportStatus) || !activeSlides?.some(slide => !slide.kind)}
                            className="mt-3 w-full rounded border border-outline-variant p-2 text-primary disabled:opacity-50">Download print-ready handout</button>
                        <button type="button" onClick={() => handleExport('print')} disabled={Boolean(exportStatus) || !activeSlides?.some(slide => !slide.kind)}
                            className="mt-2 w-full rounded border border-outline-variant p-2 text-primary disabled:opacity-50">Print or save handout as PDF</button>
                    </details>
                    {exportStatus && <p role="status" className="text-xs">{exportStatus}</p>}
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
