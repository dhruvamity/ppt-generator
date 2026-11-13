import React from 'react';
import { Presentation } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TIMER_CHOICES } from '../../utils/deckSequence.js';

const TOGGLES = [
    { key: 'revealAnswers', label: 'Reveal answers on click', hint: 'The marked option lights up green on the next click (or press A).' },
    { key: 'solutionSlides', label: 'Solution slides', hint: 'A worked-solution slide follows each question that has one.' },
    { key: 'insertBlankSlides', label: 'Blank work-space slides', hint: 'A ruled slide after every question for solving live.' },
    { key: 'answerKeySlide', label: 'Answer key at the end', hint: 'Lists answers on as many slides as needed.' },
    { key: 'sectionSlides', label: 'Section dividers', hint: 'Add a divider for each section marked with a Markdown heading (##).' },
    { key: 'slideNumbers', label: 'Slide numbers', hint: 'Shows "4 / 20" in the corner while presenting.' },
];

const timerLabel = seconds => !seconds ? 'Off' : seconds < 60 ? `${seconds} sec` : `${seconds / 60} min`.replace('.5 min', ' min 30 s');

export default function PresentationOptions() {
    const config = useStore(state => state.config);
    const setConfig = useStore(state => state.setConfig);
    return (
        <div className="flex flex-col gap-3">
            <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider flex items-center gap-2">
                <Presentation size={16} /> Presentation options
            </h3>
            <div className="flex flex-col gap-3 bg-surface p-4 rounded-xl border border-outline-variant">
                {TOGGLES.map(toggle => (
                    <label key={toggle.key} className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={Boolean(config[toggle.key])} onChange={event => setConfig({ [toggle.key]: event.target.checked })}
                            className="mt-0.5 w-4 h-4 text-primary bg-surface-container-low border-outline-variant rounded focus:ring-primary" />
                        <span className="flex flex-col">
                            <span className="text-sm font-semibold text-on-surface">{toggle.label}</span>
                            <span className="text-[11px] text-on-surface-variant leading-snug">{toggle.hint}</span>
                        </span>
                    </label>
                ))}
                <label className="flex flex-col gap-1 pt-2 border-t border-outline-variant/40">
                    <span className="text-sm font-semibold text-on-surface">Question timer</span>
                    <select value={Number(config.timerSeconds) || 0} onChange={event => setConfig({ timerSeconds: Number(event.target.value) })}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary">
                        {TIMER_CHOICES.map(seconds => <option key={seconds} value={seconds}>{timerLabel(seconds)}</option>)}
                    </select>
                    <span className="text-[11px] text-on-surface-variant leading-snug">Counts down on every question slide. Press T to pause; with the timer off, T runs a stopwatch.</span>
                </label>
                <p className="text-[11px] text-on-surface-variant leading-snug pt-2 border-t border-outline-variant/40">
                    The downloaded deck has a pen (D), highlighter (M), laser pointer (X) and timer (T) in the bottom-left corner. Press <kbd className="px-1 border border-outline-variant rounded">?</kbd> while presenting for every shortcut.
                </p>
            </div>
        </div>
    );
}
