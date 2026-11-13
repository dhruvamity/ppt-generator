import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { downloadBlob } from '../../utils/download.js';
import { renderThumbnailJpg } from '../../utils/thumbnailExport.js';
import ThumbnailSvg from './ThumbnailSvg.jsx';

export async function downloadThumbnailSeries(template, data, first, last, onProgress) {
    const start = Number(first);
    const end = Number(last);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > 999 || start > end || end - start >= 30) {
        throw new Error('Enter an ascending lecture range from 1 to 999 with at most 30 lectures.');
    }
    const { default: JSZip } = await import('jszip');
    const archive = new JSZip();
    const stage = document.createElement('div');
    stage.style.cssText = 'position:fixed;left:-2000px;top:0;width:1280px;pointer-events:none;';
    document.body.appendChild(stage);
    const root = createRoot(stage);
    const width = /^0\d+$/.test(data.lecture) ? data.lecture.length : 0;
    try {
        await document.fonts.ready;
        for (let number = start; number <= end; number++) {
            const lecture = String(number).padStart(width, '0');
            flushSync(() => root.render(<ThumbnailSvg template={template} data={{ ...data, lecture }} fontsLoaded />));
            const jpg = await renderThumbnailJpg(stage.querySelector('svg'));
            archive.file(`lecture-${lecture}.jpg`, jpg);
            onProgress(number - start + 1, end - start + 1);
        }
        downloadBlob(await archive.generateAsync({ type: 'blob' }), 'lecture-thumbnails.zip');
    } finally {
        root.unmount();
        stage.remove();
    }
}
