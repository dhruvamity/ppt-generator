import React from 'react';
import { Search, Grid, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { THEMES } from '../utils/pptxEngine';
import LiveSlidePreview from '../components/Generator/LiveSlidePreview';

const LAYOUT_IDS = ['modern-sidebar', 'classic-header', 'split-focus'];

export default function Templates() {
    const savedThemes = useStore(state => state.savedThemes);
    const setThemeId = useStore(state => state.setThemeId);
    const setLayoutId = useStore(state => state.setLayoutId);
    const navigate = useNavigate();

    const handleSelectTemplate = (themeId, layoutId) => {
        setThemeId(themeId);
        setLayoutId(layoutId);
        navigate('/generator');
    };

    const mockConfig = {
        mainTitle1: 'SlideGen',
        mainTitle2: 'PRO',
        pill1: 'TEMPLATE',
        pill2: '2026 EDITION',
        footer: 'BEAUTIFUL PRESENTATIONS',
    };

    // Build a card for each theme × layout combination to showcase structural diversity
    const templateCards = [];
    Object.entries(THEMES).forEach(([themeId, theme]) => {
        // Assign each theme a "default" showcase layout in a round-robin to keep the gallery diverse
        const idx = templateCards.length % LAYOUT_IDS.length;
        const layoutId = LAYOUT_IDS[idx];
        templateCards.push({ themeId, theme, layoutId });
    });

    return (
        <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-24 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-headline-lg text-[32px] font-semibold text-on-surface mb-1">Templates Gallery</h1>
                    <p className="font-body-md text-on-surface-variant">Choose a starting point for your next presentation.</p>
                </div>
                <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-4 py-2 focus-within:border-primary transition-all">
                    <Search size={18} className="text-outline mr-2" />
                    <input 
                        className="bg-transparent border-none outline-none font-body-md text-sm text-on-surface placeholder:text-outline w-full md:w-64" 
                        placeholder="Search templates..." 
                        type="text"
                    />
                </div>
            </div>

            <section className="mb-12">
                <h2 className="font-headline-md text-xl font-semibold text-on-surface mb-6 flex items-center gap-2">
                    <Grid size={20} />
                    System Templates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templateCards.map(({ themeId, theme, layoutId }) => (
                        <div key={`${themeId}-${layoutId}`} onClick={() => handleSelectTemplate(themeId, layoutId)} className="group flex flex-col bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary transition-all hover:shadow-md cursor-pointer">
                            <div className="relative bg-surface-container-low pointer-events-none w-full">
                                <LiveSlidePreview theme={theme} type="title" config={mockConfig} layoutId={layoutId} />
                            </div>
                            <div className="p-4 border-t border-outline-variant flex justify-between items-center">
                                <div>
                                    <h3 className="font-label-lg font-semibold text-on-surface group-hover:text-primary transition-colors">{theme.name}</h3>
                                    <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                                        {layoutId === 'modern-sidebar' ? 'Sidebar' : layoutId === 'classic-header' ? 'Header' : 'Split'} Layout
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="font-headline-md text-xl font-semibold text-on-surface mb-6">My Custom Themes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/generator" className="aspect-[16/9] bg-surface-container-low border border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface transition-all">
                        <Plus size={24} />
                        <span className="font-label-md text-sm font-semibold">Create New</span>
                    </Link>
                    
                    {savedThemes.map((theme, i) => (
                        <div key={i} onClick={() => handleSelectTemplate(theme.id, 'modern-sidebar')} className="group relative aspect-[16/9] rounded-xl overflow-hidden border border-outline-variant transition-all hover:shadow-md cursor-pointer">
                            <LiveSlidePreview theme={theme} type="title" config={mockConfig} layoutId="modern-sidebar" />
                            <div className="absolute bottom-0 w-full p-3 bg-surface border-t border-outline-variant transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out z-10 pointer-events-auto">
                                <span className="font-label-md text-sm font-semibold text-on-surface block truncate">{theme.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
