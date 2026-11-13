import React, { useId, useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useStore, DEFAULT_THEME_ID } from '../../store/useStore';
import { THEMES, THEME_GROUPS, themeGroup } from '../../utils/themeConfig';
import { DESIGN_LAYOUTS, hasSignatureLayout } from '../../utils/teachingDesign.js';
import DesignThumbnail, { PreviewViews } from './DesignThumbnail';

const BUILT_IN_THEMES = Object.entries(THEMES).map(([id, theme]) => ({ ...theme, id }));
const DESIGNS_PER_PAGE = 12;

const GROUP_STYLE = {
    calm: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    topic: 'bg-sky-50 text-sky-800 border-sky-200',
    signature: 'bg-violet-50 text-violet-800 border-violet-200',
    bold: 'bg-amber-50 text-amber-800 border-amber-200',
    classic: 'bg-surface-container-low text-on-surface-variant border-outline-variant',
};
const groupName = id => THEME_GROUPS.find(group => group.id === id)?.name;
const GroupTag = ({ id }) => <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${GROUP_STYLE[id]}`}>{groupName(id)}</span>;

export default function ThemeSelector() {
    const themeId = useStore(state => state.themeId);
    const setThemeId = useStore(state => state.setThemeId);
    const layoutId = useStore(state => state.layoutId);
    const setLayoutId = useStore(state => state.setLayoutId);
    const savedThemes = useStore(state => state.savedThemes);
    const browserId = useId();
    const [view, setView] = useState('question');
    const [expanded, setExpanded] = useState(false);
    const [layoutsExpanded, setLayoutsExpanded] = useState(false);
    const [group, setGroup] = useState('all');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const themes = useMemo(() => [...BUILT_IN_THEMES, ...savedThemes], [savedThemes]);
    const selected = themes.find(theme => theme.id === themeId) || themes.find(theme => theme.id === DEFAULT_THEME_ID);
    const needle = query.trim().toLowerCase();
    const visible = themes.filter(theme => (group === 'all' || themeGroup(theme) === group) && (!needle || `${theme.name} ${theme.description || ''}`.toLowerCase().includes(needle)));
    const pageCount = Math.ceil(visible.length / DESIGNS_PER_PAGE);
    const currentPage = Math.min(page, Math.max(0, pageCount - 1));
    const pageThemes = visible.slice(currentPage * DESIGNS_PER_PAGE, (currentPage + 1) * DESIGNS_PER_PAGE);
    const hint = THEME_GROUPS.find(item => item.id === group)?.hint;
    return <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between"><h3 className="font-semibold">Slide design</h3><span className="text-xs text-on-surface-variant">{themes.length} designs</span></div>
        <PreviewViews value={view} onChange={setView} />
        <DesignThumbnail theme={selected} layoutId={layoutId} view={view} />
        <div>
            <p className="font-semibold text-sm flex items-center justify-between gap-2">{selected.name}<GroupTag id={themeGroup(selected)} /></p>
            <p className="text-xs text-on-surface-variant mt-1">{selected.description || 'Original collection'}</p>
        </div>
        <button type="button" aria-expanded={expanded} aria-controls={expanded ? browserId : undefined} onClick={() => setExpanded(value => !value)} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Browse designs<ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} /></button>
        {expanded && <div id={browserId} className="flex flex-col gap-3">
            <label className="relative block">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
                <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Search: probability, CAT, dark…" aria-label="Search designs"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-8 pr-2 text-sm focus:outline-none focus:border-primary" />
            </label>
            <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Filter designs by style">
                {THEME_GROUPS.map(item => <button key={item.id} type="button" role="radio" aria-checked={group === item.id} onClick={() => { setGroup(item.id); setPage(0); }}
                    className={`px-2.5 py-1 rounded-full text-xs border ${group === item.id ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                    {item.name}
                </button>)}
            </div>
            {hint && <p className="text-[11px] text-on-surface-variant -mt-1">{hint}</p>}
            {pageCount > 1 && <nav aria-label="Design pages" className="flex items-center justify-between gap-2 px-1 text-xs">
                <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 0} aria-label="Previous page"
                    className="rounded border border-outline-variant px-2 py-1.5 disabled:opacity-40">Previous</button>
                <span aria-live="polite">Page {currentPage + 1} of {pageCount}</span>
                <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount - 1} aria-label="Next page"
                    className="rounded border border-outline-variant px-2 py-1.5 disabled:opacity-40">Next</button>
            </nav>}
            <div role="group" aria-label="Design results" className="grid grid-cols-2 gap-2 p-1">
                {pageThemes.map(theme => <button type="button" key={theme.id} aria-pressed={themeId === theme.id} onClick={() => setThemeId(theme.id)} title={theme.description || theme.name} className={`text-left p-1.5 rounded-lg border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${themeId === theme.id ? 'border-primary bg-surface-container-high' : 'border-outline-variant hover:border-primary'}`}>
                    <DesignThumbnail theme={theme} layoutId={layoutId} view={view} />
                    <span className="flex items-start justify-between gap-1 text-[11px] leading-tight font-semibold mt-1.5">{theme.name}{themeId === theme.id && <Check size={13} className="shrink-0 text-primary" />}</span>
                </button>)}
                {!visible.length && <p className="col-span-2 text-xs text-on-surface-variant text-center py-6">No designs match. Try another word or filter.</p>}
            </div>
        </div>}
        {hasSignatureLayout(selected) ? <p className="text-xs text-on-surface-variant">Signature layout · This original design has its own fixed composition.</p> : <details open={layoutsExpanded} onToggle={event => setLayoutsExpanded(event.currentTarget.open)} className="border-t border-outline-variant pt-3">
            <summary className="cursor-pointer text-sm font-semibold">Layout · {DESIGN_LAYOUTS.find(layout => layout.id === layoutId)?.name}</summary>
            {layoutsExpanded && <div className="grid gap-3 mt-3">{DESIGN_LAYOUTS.map(layout => <button type="button" key={layout.id} aria-pressed={layoutId === layout.id} onClick={() => setLayoutId(layout.id)} className={`p-2 rounded-lg border text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${layoutId === layout.id ? 'border-primary' : 'border-outline-variant'}`}>
                <DesignThumbnail theme={selected} layoutId={layout.id} view={view} /><span className="block text-xs mt-2">{layout.name}</span>
            </button>)}</div>}
        </details>}
    </div>;
}
