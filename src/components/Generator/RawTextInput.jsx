import React, { useEffect } from 'react';
import { useStore, parseLocalText, convertFractions } from '../../store/useStore';
import { Sparkles, Loader2, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RawTextInput() {
    const { rawText, setRawText, isParsing, setIsParsing, setAiQuestions, setActiveSlides, aiQuestions } = useStore();

    // Auto-sync text changes to preview (skip when AI formatted data is active)
    useEffect(() => {
        if (aiQuestions) return; // AI data is authoritative, don't overwrite
        const timer = setTimeout(() => {
            if (!rawText.trim()) {
                setActiveSlides([]);
                return;
            }
            const parsed = parseLocalText(rawText);
            setActiveSlides(parsed);
        }, 500);
        return () => clearTimeout(timer);
    }, [rawText, setActiveSlides, aiQuestions]);

    const handleAutoFormat = async () => {
        if (!rawText.trim()) return;
        setIsParsing(true);
        const loadingToast = toast.loading('Sending to AI Formatter...');
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        try {
            const response = await fetch(`${backendUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawText })
            });

            if (!response.ok) {
                let errorMessage = `Server error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.detail || errorMessage;
                } catch (e) {
                    // Fallback if the server didn't return JSON (e.g. 500 Internal Server Error plain text)
                    const errorText = await response.text();
                    if (errorText) errorMessage += ` - ${errorText.substring(0, 50)}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Safety net: run AI output through convertFractions to catch any plain-text math
            const sanitized = data.map(q => ({
                ...q,
                qText: convertFractions(q.qText),
                options: (q.options || []).map(o => ({ ...o, text: convertFractions(o.text) }))
            }));
            
            // Reconstruct a clean text string from the AI's structured JSON
            const cleanText = sanitized.map((q, i) => {
                let str = `Q.${i + 1}: ${q.qText}`;
                if (q.options && q.options.length > 0) {
                    str += '\n' + q.options.map(o => `(${o.label}) ${o.text}`).join('\n');
                }
                return str;
            }).join('\n\n');
            
            // Set AI data FIRST so the useEffect guard is active before rawText changes
            setAiQuestions(sanitized);
            setRawText(cleanText);
            toast.success('Successfully formatted and synced!', { id: loadingToast });
        } catch (err) {
            console.error("AI Formatting Error:", err);
            // If it's a "Load failed" or "Failed to fetch", append the URL so the user knows what it tried to hit
            if (err.message.includes('Failed to fetch') || err.message.includes('Load failed')) {
                toast.error(`Network Error (Load failed). Is the backend running at ${backendUrl}?`, { id: loadingToast, duration: 6000 });
            } else {
                toast.error(err.message, { id: loadingToast, duration: 5000 });
            }
        } finally {
            setIsParsing(false);
        }
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
                
                <div className="flex items-center gap-2">
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
                    placeholder="Paste your messy questions, quiz exports, or word documents here..."
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
