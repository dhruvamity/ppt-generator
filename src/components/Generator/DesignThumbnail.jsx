import React from 'react';
import LiveSlidePreview from './LiveSlidePreview';
import { SAMPLE_CONFIG, SAMPLE_QUESTION } from '../../utils/teachingDesign.js';

export default function DesignThumbnail({ theme, layoutId, view = 'question', config = SAMPLE_CONFIG }) {
    return <div inert aria-hidden="true" className="pointer-events-none w-full">
        <LiveSlidePreview theme={theme} layoutId={layoutId} type={view === 'title' ? 'title' : 'question'} config={config} questionData={view === 'workspace' ? { isWorkspace: true, badge: 'WORK SPACE', qText: '', options: [] } : SAMPLE_QUESTION} />
    </div>;
}

export function PreviewViews({ value, onChange }) {
    return <div className="flex flex-wrap gap-1" aria-label="Preview slide type">
        {['question', 'title', 'workspace'].map(view => <button key={view} type="button" aria-pressed={value === view} onClick={() => onChange(view)} className={`px-3 py-2 rounded-lg text-xs capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${value === view ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>{view}</button>)}
    </div>;
}
