import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { readQuestionFigure } from '../../utils/questionFigure.js';

export default function SlideDetails({ slide, index }) {
    const update = useStore(state => state.updateSlideDetails);
    const [loading, setLoading] = useState(false);

    async function attach(file) {
        if (!file || loading) return;
        setLoading(true);
        try {
            const figure = await readQuestionFigure(file);
            // A slow decode must not attach the figure to a reordered or deleted question.
            const slides = useStore.getState().activeSlides;
            const position = slides.indexOf(slide);
            if (position < 0) throw new Error('The question changed. Attach the figure again.');
            update(position, { figure });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return <details className="rounded-lg border border-outline-variant px-3 py-2 text-sm">
        <summary className="cursor-pointer">{slide.kind ? 'Lesson slide details' : 'Figure and speaker notes'}</summary>
        <div className="mt-3 grid gap-3">
            {slide.kind ? <>
                <label>Slide heading<input className="mt-1 block w-full rounded border border-outline-variant bg-surface p-2" value={slide.title} onChange={event => update(index, { title: event.target.value })} /></label>
                <label>Formula box<input className="mt-1 block w-full rounded border border-outline-variant bg-surface p-2" placeholder="Wrap LaTeX in $…$" value={slide.formula || ''} onChange={event => update(index, { formula: event.target.value })} /></label>
            </> : <>
                <label>Attach figure<input type="file" accept="image/png,image/jpeg,image/webp" className="mt-1 block w-full text-xs" disabled={loading} onChange={event => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    attach(file);
                }} /></label>
                <div tabIndex={0} className="rounded border border-dashed border-outline-variant p-2 text-xs" onPaste={event => {
                    const file = [...event.clipboardData.files].find(item => item.type.startsWith('image/'));
                    if (file) { event.preventDefault(); attach(file); }
                }}>Focus here to paste an image from the clipboard.</div>
                {slide.figure && <button type="button" className="text-left text-primary" onClick={() => update(index, { figure: undefined })}>Remove figure</button>}
            </>}
            <label>Speaker notes<textarea className="mt-1 block w-full rounded border border-outline-variant bg-surface p-2" rows={3} value={slide.notes || ''} onChange={event => update(index, { notes: event.target.value })} /></label>
        </div>
    </details>;
}
