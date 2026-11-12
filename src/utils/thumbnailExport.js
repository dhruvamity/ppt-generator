import { THUMB_W, THUMB_H } from './thumbnailDesign.js';

// Rasterise the live SVG preview: serialise it, load it as an image and paint it on a canvas.
// Photos are data URLs inside the same document, so the canvas is never tainted.
export async function renderThumbnailPng(svgElement, scale = 1) {
    const svg = svgElement.cloneNode(true);
    svg.setAttribute('width', THUMB_W * scale);
    svg.setAttribute('height', THUMB_H * scale);
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
    try {
        const image = new Image();
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('The thumbnail could not be rasterised.')); image.src = url; });
        const canvas = document.createElement('canvas');
        canvas.width = THUMB_W * scale;
        canvas.height = THUMB_H * scale;
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG encoding failed.')), 'image/png'));
    } finally {
        URL.revokeObjectURL(url);
    }
}
