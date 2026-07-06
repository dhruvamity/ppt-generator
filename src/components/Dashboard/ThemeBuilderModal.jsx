import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';
import LiveSlidePreview from '../Generator/LiveSlidePreview';

export default function ThemeBuilderModal({ isOpen, onClose }) {
    const addSavedTheme = useStore(state => state.addSavedTheme);

    const [name, setName] = useState('My Custom Theme');
    const [bgColor, setBgColor] = useState('#0F172A');
    const [cyan, setCyan] = useState('#38BDF8');
    const [purple, setPurple] = useState('#818CF8');
    const [gold, setGold] = useState('#F59E0B');
    const [textWhite, setTextWhite] = useState('#FFFFFF');

    if (!isOpen) return null;

    // Helper to strip #
    const stripHash = (hex) => hex.replace('#', '').toUpperCase();

    const mockTheme = {
        name,
        bgColor: stripHash(bgColor),
        cyan: stripHash(cyan),
        purple: stripHash(purple),
        gold: stripHash(gold),
        tealDecor: stripHash(bgColor), // Use bg for decor to simplify
        bgCard: stripHash(bgColor),
        textWhite: stripHash(textWhite),
        textBlack: '000000',
        decorPurple: stripHash(purple)
    };

    const mockConfig = {
        mainTitle1: 'Custom',
        mainTitle2: 'Theme',
        pill1: 'PREVIEW',
        pill2: 'LIVE',
        footer: 'BUILD YOUR BRAND'
    };

    const handleSave = () => {
        const themeId = `custom-${Date.now()}`;
        addSavedTheme({ ...mockTheme, id: themeId });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-outline-variant sticky top-0 bg-surface z-10">
                    <h2 className="font-headline-md text-xl font-bold text-on-surface">Theme Builder</h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 flex flex-col lg:flex-row gap-8">
                    {/* Controls */}
                    <div className="flex flex-col gap-6 w-full lg:w-1/3 shrink-0">
                        <div className="flex flex-col gap-1">
                            <label className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">Theme Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-primary outline-none"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-label-md text-xs text-on-surface-variant uppercase">Background</label>
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-md text-xs text-on-surface-variant uppercase">Primary Color</label>
                                <input type="color" value={cyan} onChange={e => setCyan(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-md text-xs text-on-surface-variant uppercase">Secondary Color</label>
                                <input type="color" value={purple} onChange={e => setPurple(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-md text-xs text-on-surface-variant uppercase">Accent (Gold)</label>
                                <input type="color" value={gold} onChange={e => setGold(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="font-label-md text-xs text-on-surface-variant uppercase">Text Color</label>
                                <input type="color" value={textWhite} onChange={e => setTextWhite(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                            </div>
                        </div>

                        <button onClick={handleSave} className="mt-4 flex justify-center items-center gap-2 bg-primary text-on-primary font-label-md py-3 rounded-lg hover:opacity-90 transition-opacity">
                            <Save size={18} /> Save Theme
                        </button>
                    </div>

                    {/* Live Preview */}
                    <div className="flex-1 flex items-center justify-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant p-4">
                        <div className="w-full max-w-xl">
                            <LiveSlidePreview theme={mockTheme} type="title" config={mockConfig} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
