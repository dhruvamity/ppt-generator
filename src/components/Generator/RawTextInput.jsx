import React, { useEffect } from 'react';
import { useStore, parseLocalText } from '../../store/useStore';
import { Sparkles, Loader2, FileText, CheckCircle, FlaskConical, Undo2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export default function RawTextInput() {
    const { rawText, setRawText, isParsing, setAiQuestions, setActiveSlides, aiQuestions, loadExample, undoAiFormat, rawTextBeforeAI } = useStore();
    const { getToken } = useAuth();

    // Auto-sync text changes to preview (skip when AI formatted data is active)
    useEffect(() => {
        if (aiQuestions) return; // AI data is authoritative, don't overwrite
        const timer = setTimeout(() => {
            if (!rawText.trim()) {
                setActiveSlides([]);
                return;
            }
            // Reconcile a Markdown title from persisted text on load as well as
            // after a paste; setRawText leaves the source unchanged when equal.
            setRawText(rawText);
            const parsed = parseLocalText(rawText);
            setActiveSlides(parsed);
        }, 500);
        return () => clearTimeout(timer);
    }, [rawText, setRawText, setActiveSlides, aiQuestions]);

    const handleAutoFormat = async () => {
        if (!rawText.trim()) return;
        const token = await getToken();
        useStore.getState().generateFromAI(token);
    };

    const handleTextChange = (e) => {
        // When user manually edits, clear AI mode so local parser takes over
        if (aiQuestions) {
            setAiQuestions(null);
        }
        setRawText(e.target.value);
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
                <h2 className="font-headline-md text-xl font-semibold text-on-surface flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Paste Questions & Options
                </h2>
                
                <div className="flex items-center gap-2 flex-wrap">
                    {rawTextBeforeAI != null && <button type="button" onClick={undoAiFormat} className="flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-sm border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary"><Undo2 size={16} />Undo AI formatting</button>}
                    {!rawText.trim() && <button type="button" onClick={loadExample} className="flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-sm border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary"><FlaskConical size={16} />Load example</button>}
                    <button
                        onClick={handleAutoFormat}
                        disabled={isParsing || !rawText.trim()}
                        className="flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2 rounded-lg font-label-md text-sm transition-all disabled:opacity-50"
                    >
                        {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {isParsing ? 'Formatting...' : 'Auto-Format with AI'}
                    </button>
                </div>
            </div>

            <div className="relative">
                <textarea
                    value={rawText}
                    onChange={handleTextChange}
                    className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed resize-none"
                    placeholder="Paste your questions here — one per line, options as (a) (b) (c) (d). Start blank or click Load example."
                    spellCheck="false"
                ></textarea>
                
                {aiQuestions && (
                    <div className="absolute bottom-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold shadow-sm">
                        <CheckCircle size={14} /> AI Formatting Active
                    </div>
                )}
            </div>
            
            <div className="text-xs text-on-surface-variant flex justify-between px-1">
                <span>The local engine instantly processes structured text. Use AI for messy pastes.</span>
                <span>{rawText.length} characters</span>
            </div>
        </div>
    );
}
