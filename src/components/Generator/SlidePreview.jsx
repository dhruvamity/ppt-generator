import React from 'react';
import { useStore } from '../../store/useStore';
import { Layers, Trash2, GripVertical } from 'lucide-react';
import LiveSlidePreview from './LiveSlidePreview';
import { THEMES } from '../../utils/themeConfig';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function SlidePreview() {
    const themeId = useStore(state => state.themeId);
    const layoutId = useStore(state => state.layoutId);
    const config = useStore(state => state.config);
    const savedThemes = useStore(state => state.savedThemes);
    
    const activeSlides = useStore(state => state.activeSlides);
    const removeSlide = useStore(state => state.removeSlide);
    const reorderSlides = useStore(state => state.reorderSlides);

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
                            Paste your text above and click <strong>"Sync to Preview"</strong> or <strong>"Auto-Format with AI"</strong> to begin.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                                                className={`flex flex-col gap-2 ${snapshot.isDragging ? 'opacity-90 scale-[1.02] shadow-xl z-50' : ''}`}
                                            >
                                                <div className="flex justify-between items-center pl-1 pr-1">
                                                    <div className="flex items-center gap-2">
                                                        <div {...provided.dragHandleProps} className="cursor-grab p-1 hover:bg-surface-variant rounded text-on-surface-variant transition-colors">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Slide {idx + 2}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg p-1">
                                                        <button onClick={() => removeSlide(idx)} className="p-1 hover:bg-error/10 text-error rounded transition-colors ml-1">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <LiveSlidePreview theme={currentTheme} type="question" questionData={{ ...q, index: idx }} layoutId={layoutId} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
