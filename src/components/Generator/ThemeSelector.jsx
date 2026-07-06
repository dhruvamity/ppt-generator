import React from 'react';
import { useStore } from '../../store/useStore';
import { Palette, CheckCircle, LayoutTemplate, Columns, PanelTop, PanelLeft } from 'lucide-react';
import { THEMES } from '../../utils/pptxEngine';

const LAYOUTS = [
    { id: 'modern-sidebar', name: 'Sidebar', icon: PanelLeft, desc: 'Colored bars & floating circles' },
    { id: 'classic-header', name: 'Header', icon: PanelTop, desc: 'Top header bar, clean body' },
    { id: 'split-focus', name: 'Split', icon: Columns, desc: '30/70 vertical split panel' },
];

export default function ThemeSelector() {
    const themeId = useStore(state => state.themeId);
    const setThemeId = useStore(state => state.setThemeId);
    const layoutId = useStore(state => state.layoutId);
    const setLayoutId = useStore(state => state.setLayoutId);
    const savedThemes = useStore(state => state.savedThemes);

    const staticThemes = Object.entries(THEMES).map(([id, t]) => ({ id, name: t.name, colors: [t.bgColor, t.cyan, t.purple, t.gold] }));
    const allThemes = [...staticThemes, ...savedThemes.map(t => ({ ...t, colors: [t.bgColor, t.cyan, t.purple, t.gold] }))];

    return (
        <div className="flex flex-col gap-5 mb-6">
            {/* Color Theme Picker */}
            <div className="flex flex-col gap-3">
                <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider flex items-center gap-2">
                    <Palette size={16} /> Color Theme
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {allThemes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setThemeId(t.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                themeId === t.id 
                                    ? `bg-surface-container-high border-primary text-primary font-bold shadow-sm` 
                                    : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Color swatch dots */}
                                <div className="flex gap-1">
                                    {t.colors?.slice(0, 4).map((c, i) => (
                                        <div key={i} className="w-3.5 h-3.5 rounded-full border border-outline-variant/50" style={{ backgroundColor: `#${c}` }} />
                                    ))}
                                </div>
                                <span className="text-sm">{t.name}</span>
                            </div>
                            {themeId === t.id && <CheckCircle size={18} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-outline-variant/40" />

            {/* Layout Type Picker */}
            <div className="flex flex-col gap-3">
                <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate size={16} /> Layout Type
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {LAYOUTS.map(l => {
                        const Icon = l.icon;
                        return (
                            <button
                                key={l.id}
                                onClick={() => setLayoutId(l.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    layoutId === l.id 
                                        ? `bg-surface-container-high border-primary text-primary font-bold shadow-sm` 
                                        : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={layoutId === l.id ? 'text-primary' : 'text-on-surface-variant'} />
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm">{l.name}</span>
                                        <span className="text-[10px] text-on-surface-variant font-normal">{l.desc}</span>
                                    </div>
                                </div>
                                {layoutId === l.id && <CheckCircle size={18} />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
