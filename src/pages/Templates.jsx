import React, { useState } from 'react';
import { ArrowUpRight, Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { THEMES } from '../utils/themeConfig';
import { DESIGN_LAYOUTS, hasSignatureLayout } from '../utils/teachingDesign.js';
import DesignThumbnail, { PreviewViews } from '../components/Generator/DesignThumbnail';

export default function Templates() {
    const { savedThemes, setThemeId, setLayoutId } = useStore();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [view, setView] = useState('question');
    const [layout, setLayout] = useState('classic-header');
    const themes = Object.entries(THEMES).map(([id, theme]) => ({ ...theme, id }));
    const matches = theme => `${theme.name} ${theme.description || ''}`.toLowerCase().includes(query.trim().toLowerCase());
    const groups = [
        ['Maths, CAT & aptitude signatures', themes.filter(theme => theme.design)],
        ['Made for teaching', themes.filter(theme => theme.teaching && !theme.design)],
        ['Original designs', themes.filter(theme => !theme.teaching)],
        ['Your custom themes', savedThemes],
    ];
    return <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-24 pb-12">
        <div className="max-w-2xl mb-8"><p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">The teaching collection</p><h1 className="text-3xl md:text-4xl font-semibold text-on-surface tracking-tight mb-3">Clear slides. More room to solve.</h1><p className="text-on-surface-variant leading-relaxed">Choose a design with your lesson in view. Explore real question, title and workspace previews before you start.</p></div>
        <div className="flex flex-wrap items-center gap-4 justify-between mb-10 p-4 rounded-xl border border-outline-variant bg-surface">
            <PreviewViews value={view} onChange={setView} />
            <label className="flex items-center gap-2 text-sm">Layout<select aria-label="Layout" value={layout} onChange={event => setLayout(event.target.value)} className="bg-surface-container-low rounded-lg p-2 border border-outline-variant">{DESIGN_LAYOUTS.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
            <label className="flex items-center gap-2 border border-outline-variant rounded-lg p-2"><Search size={16} /><input aria-label="Search designs" placeholder="Search designs…" value={query} onChange={event => setQuery(event.target.value)} className="bg-transparent outline-none text-sm w-40" /></label>
        </div>
        {groups.map(([title, items]) => items.some(matches) && <section key={title} className="mb-10"><h2 className="text-xl font-semibold mb-5">{title}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.filter(matches).map(theme => <button key={theme.id} type="button" onClick={() => { setThemeId(theme.id); setLayoutId(layout); navigate('/generator'); }} className="group flex flex-col text-left rounded-xl border border-outline-variant overflow-hidden bg-surface hover:border-primary hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <DesignThumbnail theme={theme} layoutId={layout} view={view} />
                <div className="p-4"><div className="flex justify-between items-center gap-2"><h3 className="font-semibold">{theme.name}</h3><ArrowUpRight size={17} className="text-primary" /></div><p className="text-sm text-on-surface-variant mt-1">{theme.description || (hasSignatureLayout(theme) ? 'Original collection · Signature layout' : 'Original collection · Flexible layouts')}</p></div>
            </button>)}
        </div></section>)}
        {!groups.some(([, items]) => items.some(matches)) && <p role="status" className="py-10 text-center text-on-surface-variant">No designs match “{query}”. Try another name or colour.</p>}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary"><Plus size={18} />Create your own colour theme</Link>
    </main>;
}
