import React from 'react';
import { useStore } from '../../store/useStore';
import { Sparkles, Loader2, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RawTextInput() {
    const { rawText, setRawText, isParsing, setIsParsing, setAiQuestions, aiQuestions } = useStore();

    const handleAutoFormat = async () => {
        if (!rawText.trim()) return;
        setIsParsing(true);
        const loadingToast = toast.loading('Sending to AI Formatter...');
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawText })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to communicate with API');
            }

            const data = await response.json();
            setAiQuestions(data);
            toast.success('Successfully parsed content with AI!', { id: loadingToast });
        } catch (err) {
            console.error("AI Formatting Error:", err);
            toast.error(err.message, { id: loadingToast });
        } finally {
            setIsParsing(false);
        }
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="font-headline-md text-xl font-semibold text-on-surface flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Paste Questions & Options
                </h2>
                
                <button
                    onClick={handleAutoFormat}
                    disabled={isParsing || !rawText.trim()}
                    className="flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2 rounded-lg font-label-md text-sm transition-all disabled:opacity-50"
                >
                    {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isParsing ? 'Formatting...' : 'Auto-Format with AI'}
                </button>
            </div>

            <div className="relative">
                <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
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
