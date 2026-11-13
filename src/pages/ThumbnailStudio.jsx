import React, { useRef, useState } from 'react';
import { Download, ImagePlus, RotateCcw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { THUMBNAIL_TEMPLATES, THUMBNAIL_FIELDS, DEFAULT_THUMBNAIL } from '../utils/thumbnailDesign.js';
import { renderThumbnailJpg, renderThumbnailPng } from '../utils/thumbnailExport.js';
import ThumbnailSvg from '../components/Thumbnail/ThumbnailSvg';

const inputClass = 'w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';
const labelClass = 'font-label-sm text-xs font-semibold text-on-surface-variant block mb-1';
const SUBJECT_FILTERS = [['any', 'All'], ['maths', 'Maths'], ['cat', 'CAT'], ['aptitude', 'Aptitude']];

function ThumbnailPlacementPreview({ template, data, showSafeZone }) {
    return <div className="flex flex-wrap items-start gap-4">
        {[{ label: 'Home feed', width: 320 }, { label: 'Sidebar', width: 168 }].map(({ label, width }) => (
            <figure key={label} className="max-w-full" style={{ width }}>
                <div className="relative overflow-hidden rounded-lg border border-outline-variant">
                    <ThumbnailSvg template={template} data={data} />
                    {showSafeZone && <div aria-hidden="true" className="absolute bottom-0 right-0 border-l border-t border-dashed border-white bg-black/25" style={{ width: '11.72%', height: '11.11%' }} />}
                    <span aria-hidden="true" className="absolute bottom-[4%] right-[3%] rounded bg-black/90 px-[2%] py-[1%] text-[10px] font-semibold leading-none text-white">12:34</span>
                </div>
                <figcaption className="mt-1 text-xs text-on-surface-variant">{label} · {width} px</figcaption>
            </figure>
        ))}
    </div>;
}

export default function ThumbnailStudio() {
    const thumbnail = useStore(state => state.thumbnail) || DEFAULT_THUMBNAIL;
    const setThumbnail = useStore(state => state.setThumbnail);
    const setThumbnailPhotoAdjust = useStore(state => state.setThumbnailPhotoAdjust);
    const photoHref = useStore(state => state.thumbnailPhoto);
    const setThumbnailPhoto = useStore(state => state.setThumbnailPhoto);
    const [filter, setFilter] = useState('any');
    const [busy, setBusy] = useState(false);
    const [showSafeZone, setShowSafeZone] = useState(true);
    const svgRef = useRef(null);
    const template = THUMBNAIL_TEMPLATES.find(item => item.id === thumbnail.templateId) || THUMBNAIL_TEMPLATES[0];
    const data = { ...thumbnail, photoHref };
    const photo = { ...DEFAULT_THUMBNAIL.photo, ...(thumbnail.photo || {}) };
    const visible = THUMBNAIL_TEMPLATES.filter(item => filter === 'any' || item.subject === filter || item.subject === 'any');

    const onUpload = event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return toast.error('Upload a PNG, JPG or WebP image.');
        if (file.size > 12 * 1024 * 1024) return toast.error('Keep the photo under 12 MB.');
        const reader = new FileReader();
        reader.onload = () => { setThumbnailPhoto(reader.result); toast.success('Photo added. Use the sliders to frame it.'); };
        reader.onerror = () => toast.error('The photo could not be read.');
        reader.readAsDataURL(file);
    };

    const onDownload = async (format) => {
        if (!svgRef.current) return;
        setBusy(true);
        try {
            const blob = await (format === 'jpg' ? renderThumbnailJpg : renderThumbnailPng)(svgRef.current);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${thumbnail.chapter || 'thumbnail'}-lecture-${thumbnail.lecture || '0'}.${format}`.replace(/[^\w.-]+/g, '-');
            document.body.appendChild(link);
            link.click();
            link.remove();
            const url = link.href;
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            toast.success(`Thumbnail downloaded (1280 × 720 ${format.toUpperCase()}).`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setBusy(false);
        }
    };

    return <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-24 pb-12 flex flex-col lg:flex-row gap-gutter">
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-5 sticky top-24">
                <div>
                    <h3 className="font-semibold">Teacher photo</h3>
                    <p className="text-xs text-on-surface-variant mt-1">A PNG with the background removed looks best. The photo stays on this device.</p>
                    <div className="flex gap-2 mt-3">
                        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-primary text-on-primary px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-90 focus-within:outline focus-within:outline-2 focus-within:outline-primary"><ImagePlus size={16} />{photoHref ? 'Replace photo' : 'Upload photo'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onUpload} aria-label="Upload teacher photo" /></label>
                        {photoHref && <button type="button" onClick={() => setThumbnailPhoto(null)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:border-error" aria-label="Remove photo"><Trash2 size={16} /></button>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3" role="radiogroup" aria-label="Photo fit">
                        {[['cover', 'Fill the frame'], ['contain', 'Cutout, feet down']].map(([value, name]) => <button key={value} type="button" role="radio" aria-checked={photo.fit === value} onClick={() => setThumbnailPhotoAdjust({ fit: value })} className={`px-2 py-2 rounded-lg text-xs border ${photo.fit === value ? 'border-primary bg-surface-container-high text-primary font-semibold' : 'border-outline-variant text-on-surface-variant'}`}>{name}</button>)}
                    </div>
                    {[['zoom', 'Zoom', 1, 2.5, 0.05], ['x', 'Move left / right', -1, 1, 0.05], ['y', 'Move up / down', -1, 1, 0.05]].map(([key, name, min, max, step]) => <label key={key} className="block mt-3 text-xs text-on-surface-variant">{name}<input type="range" min={min} max={max} step={step} value={photo[key]} onChange={event => setThumbnailPhotoAdjust({ [key]: Number(event.target.value) })} className="w-full accent-primary" aria-label={name} /></label>)}
                    <button type="button" onClick={() => setThumbnailPhotoAdjust(DEFAULT_THUMBNAIL.photo)} className="mt-2 inline-flex items-center gap-1 text-xs text-primary"><RotateCcw size={12} />Reset framing</button>
                </div>
                <div className="border-t border-outline-variant pt-4 flex flex-col gap-3">
                    <h3 className="font-semibold">Text</h3>
                    {THUMBNAIL_FIELDS.map(field => <div key={field.key}>
                        <label htmlFor={`thumb-${field.key}`} className={labelClass}>{field.label}</label>
                        <input id={`thumb-${field.key}`} list={field.suggestions ? `thumb-${field.key}-options` : undefined} value={thumbnail[field.key] ?? ''} placeholder={field.placeholder} onChange={event => setThumbnail({ [field.key]: event.target.value })} className={inputClass} />
                        {field.suggestions && <datalist id={`thumb-${field.key}-options`}>{field.suggestions.map(option => <option key={option} value={option} />)}</datalist>}
                    </div>)}
                </div>
                <button type="button" onClick={() => onDownload('png')} disabled={busy} className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-60 px-4 py-3 rounded-xl font-label-md text-sm transition-all shadow-md shadow-primary/20"><Download size={18} />{busy ? 'Rendering…' : 'Download PNG · 1280 × 720'}</button>
                <button type="button" onClick={() => onDownload('jpg')} disabled={busy} className="w-full flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 py-3 text-sm text-on-surface hover:border-primary disabled:opacity-60"><Download size={18} />Download JPG · under 2 MB</button>
            </div>
        </aside>
        <div className="flex-1 flex flex-col gap-8 min-w-0">
            <section>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                    <div><p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">Thumbnail studio</p><h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{template.name}</h1><p className="text-sm text-on-surface-variant mt-1">{template.description}</p></div>
                </div>
                <div className="rounded-xl overflow-hidden border border-outline-variant shadow-md bg-surface-container-low"><ThumbnailSvg template={template} data={data} svgRef={svgRef} /></div>
            </section>
            <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">YouTube preview</h2>
                    <label className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <input type="checkbox" checked={showSafeZone} onChange={event => setShowSafeZone(event.target.checked)} />
                        Show duration safe zone
                    </label>
                </div>
                <ThumbnailPlacementPreview template={template} data={data} showSafeZone={showSafeZone} />
            </section>
            <section>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold">Pick a design</h2>
                    <div className="flex gap-1" role="radiogroup" aria-label="Filter designs by subject">{SUBJECT_FILTERS.map(([value, name]) => <button key={value} type="button" role="radio" aria-checked={filter === value} onClick={() => setFilter(value)} className={`px-3 py-1.5 rounded-lg text-xs ${filter === value ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>{name}</button>)}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {visible.map(item => <button key={item.id} type="button" aria-pressed={item.id === template.id} onClick={() => setThumbnail({ templateId: item.id })} className={`text-left rounded-xl border overflow-hidden bg-surface hover:border-primary transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${item.id === template.id ? 'border-primary ring-2 ring-primary/30' : 'border-outline-variant'}`}>
                        <div inert aria-hidden="true" className="pointer-events-none"><ThumbnailSvg template={item} data={data} /></div>
                        <div className="p-3"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p></div>
                    </button>)}
                </div>
            </section>
        </div>
    </main>;
}
