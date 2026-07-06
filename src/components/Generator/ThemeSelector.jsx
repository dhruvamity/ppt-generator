import React from 'react';
import { useStore } from '../../store/useStore';
import { Palette, CheckCircle } from 'lucide-react';
import { THEMES } from '../../utils/pptxEngine';

export default function ThemeSelector() {
    const themeId = useStore(state => state.themeId);
    const setThemeId = useStore(state => state.setThemeId);
    const savedThemes = useStore(state => state.savedThemes);

    const staticThemes = Object.entries(THEMES).map(([id, t]) => ({ id, name: t.name }));
    const allThemes = [...staticThemes, ...savedThemes];

    return (
        <div className="flex flex-col gap-3 mb-6">
            <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider flex items-center gap-2">
                <Palette size={16} /> Select Theme
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
                        <span>{t.name}</span>
                        {themeId === t.id && <CheckCircle size={18} />}
                    </button>
                ))}
            </div>
        </div>
    );
}
