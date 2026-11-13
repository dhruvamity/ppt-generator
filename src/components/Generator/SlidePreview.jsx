import React from 'react';
import { useStore } from '../../store/useStore';
import { Layers, Trash2, GripVertical, Lightbulb, Check } from 'lucide-react';
import LiveSlidePreview from './LiveSlidePreview';
import SlideDetails from './SlideDetails.jsx';
import { THEMES } from '../../utils/themeConfig';
import { deckSequence, slideData, answerIndex, normalizeLabel } from '../../utils/deckSequence.js';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const KIND_LABEL = { section: 'Section divider', workspace: 'Work space', solution: 'Solution', key: 'Answer key', concept: 'Concept', formula: 'Formula sheet', passage: 'Shared passage' };
const SOLUTION_STARTER = 'Step 1: ';

export function AnswerPicker({ slide, index }) {
    const updateSlideAnswer = useStore(state => state.updateSlideAnswer);
    const options = Array.isArray(slide.options) ? slide.options : [];
    const correct = answerIndex(slide);
    if (!options.length) {
        return <input aria-label={`Answer for question ${slide.badge?.slice(2) || index + 1}`} placeholder="Answer" defaultValue={slide.answer || ''} key={slide.answer || ''}
            onBlur={event => event.target.value.trim() !== (slide.answer || '') && updateSlideAnswer(index, event.target.value)}
            className="w-24 bg-surface border border-outline-variant rounded-md px-2 py-1 text-xs focus:outline-none focus:border-primary" />;
    }
    return <div className="flex flex-wrap items-center gap-1 min-w-0" role="group" aria-label={`Correct answer for question ${slide.badge?.slice(2) || index + 1}`}>
        <span className="text-[11px] text-on-surface-variant mr-1 hidden sm:inline">Answer</span>
        {options.map((option, i) => {
            const label = normalizeLabel(option.label) || String.fromCharCode(97 + i);
            return <button key={i} type="button" aria-pressed={i === correct} title={i === correct ? 'Clear the answer' : `Mark (${label.toUpperCase()}) as correct`}
                onClick={() => updateSlideAnswer(index, i === correct ? '' : label)}
                className={`min-w-7 h-7 px-1.5 rounded-md text-xs font-bold border transition-colors ${i === correct ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-outline-variant text-on-surface-variant hover:border-emerald-600 hover:text-emerald-700'}`}>
                {label.toUpperCase()}
            </button>;
        })}
    </div>;
}

export default function SlidePreview() {
    const themeId = useStore(state => state.themeId);
    const layoutId = useStore(state => state.layoutId);
    const config = useStore(state => state.config);
    const savedThemes = useStore(state => state.savedThemes);
    
    const activeSlides = useStore(state => state.activeSlides);
    const removeSlide = useStore(state => state.removeSlide);
    const reorderSlides = useStore(state => state.reorderSlides);
    const addLessonSlide = useStore(state => state.addLessonSlide);
    const updateSlideSolution = useStore(state => state.updateSlideSolution);

    const currentTheme = THEMES[themeId] || savedThemes.find(t => t.id === themeId) || THEMES['dark-neon'];

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        reorderSlides(result.source.index, result.destination.index);
    };

    // Empty state — no slides generated yet
    if (!activeSlides || activeSlides.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-headline-md text-lg font-semibold text-on-surface flex items-center gap-2">
                        <Layers size={18} className="text-secondary" />
                        Live Presentation Preview
                    </h3>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-lowest">
                    <div className="p-4 rounded-full bg-surface-container-high">
                        <Layers size={32} className="text-outline" />
                    </div>
                    <div className="text-center max-w-sm">
                        <p className="text-on-surface font-semibold mb-1">No slides generated yet</p>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                            Paste numbered questions to see them here, or use <strong>Auto-Format with AI</strong> for unstructured text.
                        </p>
                        <button type="button" className="mt-3 text-sm text-primary" onClick={() => addLessonSlide('concept')}>Add a concept slide</button>
                    </div>
                </div>
            </div>
        );
    }

    // Number every slide in presentation order, then group the extras with their question.
    const sequence = deckSequence(config, activeSlides).map((entry, position) => ({ ...entry, number: position + 1 }));
    const groups = activeSlides.map((_, index) => sequence.filter(entry => entry.index === index && entry.kind !== 'key'));
    const keySlides = sequence.filter(entry => entry.kind === 'key');
    const questions = activeSlides.filter(slide => !slide.kind);
    const answered = questions.filter(slide => String(slide.answer ?? '').trim()).length;
    const solutionSlides = config.solutionSlides !== false;

    const renderEntry = entry => entry.kind === 'section'
        ? <LiveSlidePreview theme={currentTheme} type="title" config={{ ...config, ...entry.config }} layoutId={layoutId} />
        : <LiveSlidePreview theme={currentTheme} type="question" config={config} questionData={{ ...slideData(entry), index: entry.index }} layoutId={layoutId} />;
    const caption = entry => <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider pl-1">Slide {entry.number}{KIND_LABEL[entry.kind] ? ` · ${KIND_LABEL[entry.kind]}` : ''}</span>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center gap-2 px-1">
                <h3 className="font-headline-md text-lg font-semibold text-on-surface flex items-center gap-2">
                    <Layers size={18} className="text-secondary" />
                    Live Presentation Preview
                </h3>
                <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200" title="Questions with a marked answer reveal it on the next click when presenting">
                        {answered}/{questions.length} answers set
                    </span>
                    <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold font-label-sm border border-outline-variant">
                        {sequence.length} Slides Ready
                    </span>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => addLessonSlide('concept')} className="rounded border border-outline-variant px-3 py-1.5 text-sm text-primary">Add concept</button>
                <button type="button" onClick={() => addLessonSlide('formula')} className="rounded border border-outline-variant px-3 py-1.5 text-sm text-primary">Add formula sheet</button>
            </div>
            <div className="flex flex-col gap-8 max-h-[800px] overflow-y-auto pr-2 pb-8 custom-scrollbar">
                {/* Title Slide Preview */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider pl-1">Slide 1 · Title</span>
                    <LiveSlidePreview theme={currentTheme} type="title" config={config} layoutId={layoutId} />
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="slides-droppable">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-8">
                                {activeSlides.map((q, idx) => (
                                    <Draggable key={`slide-${idx}`} draggableId={`slide-${idx}`} index={idx}>
                                        {(provided, snapshot) => (
                                            <div 
                                                ref={provided.innerRef} 
                                                {...provided.draggableProps} 
                                                className={`flex flex-col gap-3 ${snapshot.isDragging ? 'opacity-90 scale-[1.02] shadow-xl z-50' : ''}`}
                                            >
                                                {groups[idx].filter(entry => entry.kind === 'section').map(entry => <div key="section" className="flex flex-col gap-2">{caption(entry)}{renderEntry(entry)}</div>)}
                                                <div className="flex flex-wrap justify-between items-center gap-2 pl-1 pr-1">
                                                    <div className="flex items-center gap-2">
                                                        <div {...provided.dragHandleProps} className="cursor-grab p-1 hover:bg-surface-variant rounded text-on-surface-variant transition-colors" aria-label="Drag to reorder">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        {caption(groups[idx].find(entry => entry.kind === (q.kind || 'question')))}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full bg-surface-container-low border border-outline-variant rounded-lg p-1">
                                                        {!q.kind && <AnswerPicker slide={q} index={idx} />}
                                                        {!q.kind && solutionSlides && !String(q.solution ?? '').trim() && <button type="button" onClick={() => updateSlideSolution(idx, SOLUTION_STARTER)} className="flex items-center gap-1 px-2 h-7 rounded-md text-xs border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary" title="Add a worked-solution slide after this question">
                                                            <Lightbulb size={13} /> Solution
                                                        </button>}
                                                        {String(q.solution ?? '').trim() && <span className="flex items-center gap-1 px-2 h-7 text-xs text-emerald-700" title={solutionSlides ? 'Shown as its own slide after the question' : 'Turn on solution slides in Presentation options to show it'}><Check size={13} /> Solution</span>}
                                                        <button type="button" onClick={() => removeSlide(idx)} aria-label={q.kind ? 'Delete lesson slide' : `Delete question ${q.badge?.slice(2) || idx + 1}`} className="p-1 hover:bg-error/10 text-error rounded transition-colors ml-1">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <SlideDetails slide={q} index={idx} />
                                                {groups[idx].filter(entry => entry.kind !== 'section').map(entry => <div key={entry.number} className="flex flex-col gap-2">
                                                    {entry.kind !== 'question' && caption(entry)}
                                                    {renderEntry(entry)}
                                                </div>)}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {keySlides.map(entry => <div key={entry.number} className="flex flex-col gap-2">{caption(entry)}{renderEntry(entry)}</div>)}
            </div>
        </div>
    );
}
