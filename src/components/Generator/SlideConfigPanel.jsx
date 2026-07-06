import React from 'react';
import { useStore } from '../../store/useStore';
import { Settings2 } from 'lucide-react';

export default function SlideConfigPanel() {
    const config = useStore(state => state.config);
    const setConfig = useStore(state => state.setConfig);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig({ [name]: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider flex items-center gap-2">
                <Settings2 size={16} /> Title Slide Data
            </h3>
            
            <div className="flex flex-col gap-4 bg-surface p-4 rounded-xl border border-outline-variant">
                <div>
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant block mb-1">Title (Primary)</label>
                    <input 
                        type="text" 
                        name="mainTitle1"
                        value={config.mainTitle1}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
                <div>
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant block mb-1">Title (Accent)</label>
                    <input 
                        type="text" 
                        name="mainTitle2"
                        value={config.mainTitle2}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
                <div>
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant block mb-1">Badge 1 (Solid)</label>
                    <input 
                        type="text" 
                        name="pill1"
                        value={config.pill1}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
                <div>
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant block mb-1">Badge 2 (Outline)</label>
                    <input 
                        type="text" 
                        name="pill2"
                        value={config.pill2}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
                <div>
                    <label className="font-label-sm text-xs font-semibold text-on-surface-variant block mb-1">Footer Text</label>
                    <input 
                        type="text" 
                        name="footer"
                        value={config.footer}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
