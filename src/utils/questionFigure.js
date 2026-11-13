export const isQuestionFigure = value => typeof value === 'string'
    && value.length <= 500_000
    && /^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/]+=*$/i.test(value);

export async function readQuestionFigure(file) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
        throw new Error('Choose a PNG, JPG or WebP image under 12 MB.');
    }
    const image = await createImageBitmap(file);
    try {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(1, 1000 / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        for (const quality of [0.9, 0.75, 0.55]) {
            const figure = canvas.toDataURL('image/webp', quality);
            if (isQuestionFigure(figure)) return figure;
        }
        throw new Error('This figure is too large. Crop it or choose a smaller image.');
    } finally {
        image.close();
    }
}
