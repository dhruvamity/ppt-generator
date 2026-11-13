import { signatureSlide } from './signatureDesigns.js';

// Where an educator / brand watermark may sit for each design family, in 1280 × 720 px.
// Every placement is outside the header and body rectangles, so it can never cover study material.
const BASE = { position: 'absolute', zIndex: 20, fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '22px', height: '22px', fontWeight: '700', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', pointerEvents: 'none' };

export const watermarkFromPlacement = ({ left, right, top, bottom, width, align = 'left', color, opacity = '0.75', weight }) => ({
    ...BASE,
    ...(left !== undefined ? { left: `${left}px` } : { right: `${right}px` }),
    ...(top !== undefined ? { top: `${top}px` } : { bottom: `${bottom}px` }),
    width: `${width}px`, textAlign: align, color, opacity: String(opacity), ...(weight ? { fontWeight: weight } : {}),
});

export function watermarkStyle(theme, layoutId = 'modern-sidebar') {
    if (theme.design) return watermarkFromPlacement(signatureSlide(theme, false, false).watermark);
    // Teaching layouts: body ends 40px above the bottom edge; the strip below it is free in every layout.
    if (theme.teaching) return watermarkFromPlacement({ left: layoutId === 'split-focus' ? 168 : 48, bottom: 10, width: 600, color: `#${theme.cyan}` });
    switch (theme.classicDesign) {
        case 'neon': return watermarkFromPlacement({ right: 40, bottom: 14, width: 520, align: 'right', color: '#FFFFFF', opacity: '0.9' });
        case 'blueprint': return watermarkFromPlacement({ right: 60, bottom: 30, width: 520, align: 'right', color: `#${theme.cyan}`, opacity: '0.8' });
        case 'aurora': return watermarkFromPlacement({ right: 60, bottom: 30, width: 520, align: 'right', color: `#${theme.textWhite}`, opacity: '0.7' });
        case 'brutalism': return watermarkFromPlacement({ right: 40, bottom: 24, width: 520, align: 'right', color: `#${theme.black}`, opacity: '1', weight: '900' });
        // Flexible originals: body padding ends at 680px and the gold ribbon starts at 704px.
        default: return { ...watermarkFromPlacement({ right: 40, bottom: 18, width: 520, align: 'right', color: `#${theme.textWhite}`, opacity: '0.7' }), fontSize: '15px', lineHeight: '20px', height: '20px' };
    }
}

export const watermarkRect = style => {
    const px = value => Number(String(value).replace('px', ''));
    const width = px(style.width), height = px(style.height);
    const left = style.left !== undefined ? px(style.left) : 1280 - px(style.right) - width;
    const top = style.top !== undefined ? px(style.top) : 720 - px(style.bottom) - height;
    return { left, top, right: left + width, bottom: top + height };
};
