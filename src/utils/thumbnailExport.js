import { THUMB_W, THUMB_H } from './thumbnailDesign.js';

// Rasterise the live SVG preview: serialise it, load it as an image and paint it on a canvas.
// Photos are data URLs inside the same document, so the canvas is never tainted.
async function rasterizeThumbnail(svgElement, scale) {
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
        return canvas;
    } finally {
        URL.revokeObjectURL(url);
    }
}

const encode = (canvas, mimeType, quality) => new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
        if (!blob || blob.type !== mimeType) reject(new Error('Thumbnail encoding failed.'));
        else resolve(blob);
    }, mimeType, quality);
});

export async function renderThumbnailPng(svgElement, scale = 1) {
    return encode(await rasterizeThumbnail(svgElement, scale), 'image/png');
}

export async function renderThumbnailJpg(svgElement) {
    const canvas = await rasterizeThumbnail(svgElement, 1);
    for (const quality of [0.95, 0.85, 0.75, 0.60, 0.45]) {
        const blob = await encode(canvas, 'image/jpeg', quality);
        if (blob.size < 2_000_000) return blob;
    }
    throw new Error('The JPG exceeds 2 MB. Try a smaller photo.');
}
