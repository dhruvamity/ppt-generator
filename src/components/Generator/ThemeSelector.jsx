import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../utils/themeConfig';
import { DESIGN_LAYOUTS, hasSignatureLayout } from '../../utils/teachingDesign.js';
import DesignThumbnail, { PreviewViews } from './DesignThumbnail';

export default function ThemeSelector() {
    const { themeId, setThemeId, layoutId, setLayoutId, savedThemes } = useStore();
    const [view, setView] = useState('question');
    const [expanded, setExpanded] = useState(false);
    const themes = [...Object.entries(THEMES).map(([id, theme]) => ({ ...theme, id })), ...savedThemes];
    const selected = themes.find(theme => theme.id === themeId) || themes[0];
    return <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between"><h3 className="font-semibold">Slide design</h3><span className="text-xs text-on-surface-variant">{themes.length} designs</span></div>
        <PreviewViews value={view} onChange={setView} />
        <DesignThumbnail theme={selected} layoutId={layoutId} view={view} />
        <div><p className="font-semibold text-sm">{selected.name}</p><p className="text-xs text-on-surface-variant mt-1">{selected.description || 'Original collection'}</p></div>
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Browse designs<ChevronDown size={16} /></button>
        {expanded && <div className="grid gap-3 max-h-[440px] overflow-y-auto p-1">
            {themes.map(theme => <button type="button" key={theme.id} aria-pressed={themeId === theme.id} onClick={() => setThemeId(theme.id)} className={`text-left p-2 rounded-xl border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${themeId === theme.id ? 'border-primary bg-surface-container-high' : 'border-outline-variant hover:border-primary'}`}>
                <DesignThumbnail theme={theme} layoutId={layoutId} view={view} />
                <span className="flex items-center justify-between text-sm font-semibold mt-2">{theme.name}{themeId === theme.id && <Check size={16} />}</span>
            </button>)}
        </div>}
        {hasSignatureLayout(selected) ? <p className="text-xs text-on-surface-variant">Signature layout · This original design has its own fixed composition.</p> : <details className="border-t border-outline-variant pt-3">
            <summary className="cursor-pointer text-sm font-semibold">Layout · {DESIGN_LAYOUTS.find(layout => layout.id === layoutId)?.name}</summary>
            <div className="grid gap-3 mt-3">{DESIGN_LAYOUTS.map(layout => <button type="button" key={layout.id} aria-pressed={layoutId === layout.id} onClick={() => setLayoutId(layout.id)} className={`p-2 rounded-lg border text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${layoutId === layout.id ? 'border-primary' : 'border-outline-variant'}`}>
                <DesignThumbnail theme={selected} layoutId={layout.id} view={view} /><span className="block text-xs mt-2">{layout.name}</span>
            </button>)}</div>
        </details>}
    </div>;
}
