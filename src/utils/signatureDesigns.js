// Composed designs for maths, CAT and aptitude decks. Every design is a list of decorations plus
// explicit header/body rectangles in 1280 × 720 space; preview and export both consume this shape.
// Decorations marked `behind` are flat panels text may sit on. Everything else must stay outside
// the header and body rectangles (enforced by tests), so artwork can never cover a question.
const px = n => `${n}px`;
const box = (left, top, width, height, extra = {}) => ({ position: 'absolute', left: px(left), top: px(top), width: px(width), height: px(height), pointerEvents: 'none', ...extra });
const art = (width, height, inner, extra = {}) => ({ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${inner}</svg>`).replace(/'/g, '%27')}')`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', ...extra });
const label = (style, text) => ({ style, text });
const range = (count, fn) => Array.from({ length: count }, (_, i) => fn(i)).join('');
const BLACK_DISPLAY = "'Arial Black', Impact, 'Segoe UI Black', sans-serif";

const DESIGNS = {
    chalkboard: (t) => ({
        font: "'Trebuchet MS', Arial, sans-serif", display: "'Segoe Print', 'Chalkboard SE', 'Comic Sans MS', sans-serif",
        decorations: [
            box(0, 0, 1280, 28, { backgroundColor: '#8B5A2B', boxShadow: 'inset 0 -4px 0 #5C3A1A' }),
            box(0, 692, 1280, 28, { backgroundColor: '#8B5A2B', boxShadow: 'inset 0 4px 0 #5C3A1A' }),
            box(0, 0, 28, 720, { backgroundColor: '#8B5A2B', boxShadow: 'inset -4px 0 0 #5C3A1A' }),
            box(1252, 0, 28, 720, { backgroundColor: '#8B5A2B', boxShadow: 'inset 4px 0 0 #5C3A1A' }),
            box(160, 662, 960, 22, { backgroundColor: '#A86F3C', borderRadius: '4px 4px 0 0', boxShadow: '0 -2px 0 #5C3A1A' }),
            box(190, 650, 64, 10, { backgroundColor: '#F7F3E8', borderRadius: '5px' }),
            box(270, 650, 44, 10, { backgroundColor: `#${t.cyan}`, borderRadius: '5px' }),
            box(1000, 644, 96, 16, { backgroundColor: '#3B3B3B', borderRadius: '3px' }),
        ],
        header: { left: 72, top: 52, right: 72, height: 56 },
        badge: { border: `3px solid #${t.cyan}`, borderRadius: '50%', padding: '6px 18px' },
        body: { left: 72, top: 128, right: 72, bottom: 96 }, titleTop: 180, watermark: { left: 72, bottom: 72, width: 500, color: '#F7F3E8', opacity: '0.6' },
    }),
    spiral: (t) => ({
        decorations: [
            box(0, 0, 96, 720, { backgroundColor: '#EDF0F4' }),
            box(0, 0, 96, 720, art(96, 720, range(12, i => { const y = 40 + i * 58; return `<path d="M8 ${y}C8 ${y - 30} 44 ${y - 30} 44 ${y}" fill="none" stroke="#6B7A8C" stroke-width="5" stroke-linecap="round"/><circle cx="44" cy="${y}" r="9" fill="#FFFFFF" stroke="#B8C2CF" stroke-width="2"/>`; }))),
            box(118, 0, 2, 720, { backgroundColor: '#F28B82' }),
            box(1200, 660, 80, 60, art(80, 60, '<path d="M80 0v60H20Z" fill="#E3E8EF"/><path d="M80 0 20 60" stroke="#C9D2DE" stroke-width="2"/>')),
        ],
        header: { left: 144, top: 36, right: 64, height: 48 },
        badge: { backgroundColor: `#${t.cyan}`, color: '#FFFFFF', padding: '6px 18px', borderRadius: '8px' },
        body: { left: 144, top: 110, right: 64, bottom: 80 }, titleTop: 170, watermark: { left: 144, bottom: 32, width: 900 },
    }),
    indexcard: () => ({
        display: 'Georgia, serif',
        decorations: [
            { behind: true, style: box(64, 56, 1152, 608, { backgroundColor: '#FFFDF7', borderRadius: '10px', boxShadow: '0 14px 36px rgba(0,0,0,0.35)' }) },
            box(64, 150, 1152, 2, { backgroundColor: '#E88A8A' }),
            box(1120, 20, 56, 150, art(56, 150, '<path d="M16 20v96a12 12 0 0 0 24 0V36a7 7 0 0 0-14 0v72" fill="none" stroke="#8A94A6" stroke-width="5" stroke-linecap="round"/>')),
        ],
        header: { left: 104, top: 80, right: 220, height: 50 },
        badge: { backgroundColor: '#F2C14E', color: '#1D1D1D', padding: '6px 18px', borderRadius: '6px 6px 0 0' },
        body: { left: 104, top: 172, right: 200, bottom: 100 }, titleTop: 200, watermark: { right: 104, bottom: 72, width: 600, align: 'right', color: '#8A94A6' },
    }),
    omr: (t) => ({
        display: "'Courier New', monospace",
        decorations: [
            box(1072, 0, 208, 720, { backgroundColor: '#EEF1F5' }),
            box(1072, 0, 208, 720, art(208, 720, range(14, r => { const y = 50 + r * 46; return `<text x="18" y="${y + 5}" font-size="13" font-family="Courier New,monospace" fill="#9AA3AE">${String(r + 1).padStart(2, '0')}</text>` + range(4, c => `<circle cx="${62 + c * 38}" cy="${y}" r="11" fill="${(r * 7 + c) % 5 === 0 ? '#2B2B2B' : 'none'}" stroke="#B8C2CF" stroke-width="1.5"/><text x="${62 + c * 38}" y="${y + 4}" font-size="10" text-anchor="middle" font-family="Arial" fill="${(r * 7 + c) % 5 === 0 ? '#EEF1F5' : '#9AA3AE'}">${'ABCD'[c]}</text>`); }))),
            box(48, 20, 220, 44, art(220, 44, range(40, i => `<rect x="${i * 5.5}" y="0" width="${(i * 7) % 3 === 0 ? 3.5 : 1.5}" height="44" fill="#1A1A1A"/>`))),
            box(48, 668, 1000, 1, { backgroundColor: '#C7CED8' }),
            label(box(48, 676, 1000, 24, { color: '#9AA3AE', fontSize: '13px', letterSpacing: '3px', fontFamily: "'Courier New', monospace", lineHeight: '24px' }), 'DO NOT WRITE BELOW THIS LINE · USE BLUE/BLACK PEN ONLY'),
        ],
        header: { left: 48, top: 84, right: 256, height: 44 },
        badge: { backgroundColor: `#${t.cyan}`, color: '#FFFFFF', padding: '4px 16px', letterSpacing: '2px' },
        body: { left: 48, top: 144, right: 256, bottom: 72 }, titleTop: 170, watermark: { left: 300, top: 30, width: 740, color: '#9AA3AE' },
    }),
    quantclock: (t, { workspace }) => ({
        decorations: [
            { behind: true, style: box(980, 30, 260, 260, art(260, 260, `<circle cx="130" cy="130" r="120" fill="#1B2A4A" stroke="#${t.cyan}" stroke-width="6"/><rect x="118" y="0" width="24" height="18" rx="4" fill="#${t.cyan}"/>` + range(60, i => { const a = i * 6 * Math.PI / 180, len = i % 5 === 0 ? 16 : 7; return `<path d="M${130 + Math.sin(a) * 108} ${130 - Math.cos(a) * 108}L${130 + Math.sin(a) * (108 - len)} ${130 - Math.cos(a) * (108 - len)}" stroke="${i % 5 === 0 ? '#F4F6FB' : '#5B6B8C'}" stroke-width="${i % 5 === 0 ? 3 : 1.5}"/>`; }))) },
            label(box(980, 296, 260, 24, { color: '#8D99AE', fontSize: '14px', letterSpacing: '4px', textAlign: 'center', lineHeight: '24px' }), 'TIME YOURSELF'),
            box(64, 686, 1152, 6, { backgroundColor: '#1F2A48', borderRadius: '3px' }),
            box(64, 686, 460, 6, { backgroundColor: `#${t.cyan}`, borderRadius: '3px' }),
        ],
        header: { left: 1030, top: 110, width: 160, height: 100, justifyContent: 'center', textAlign: 'center' },
        badge: { fontSize: workspace ? '22px' : '46px', fontWeight: '800', color: `#${t.cyan}` }, rule: null,
        body: { left: 64, top: 72, right: 340, bottom: 72 }, titleTop: 150, watermark: { right: 40, bottom: 56, width: 260, align: 'center', color: '#8D99AE' },
    }),
    datadeck: (t) => ({
        decorations: [
            ...[38, 62, 50, 84, 70, 96, 58, 76, 90].map((h, i) => box(64 + i * 44, 696 - h, 28, h, { backgroundColor: i % 2 ? `#${t.gold}` : `#${t.cyan}`, borderRadius: '3px 3px 0 0', opacity: '0.85' })),
            box(64, 695, 400, 2, { backgroundColor: '#D9E2EC' }),
            box(1140, 24, 116, 116, art(116, 116, `<circle cx="58" cy="58" r="40" fill="none" stroke="#D9E2EC" stroke-width="18"/><circle cx="58" cy="58" r="40" fill="none" stroke="#${t.cyan}" stroke-width="18" stroke-dasharray="151 251" transform="rotate(-90 58 58)"/><circle cx="58" cy="58" r="40" fill="none" stroke="#${t.gold}" stroke-width="18" stroke-dasharray="63 251" stroke-dashoffset="-151" transform="rotate(-90 58 58)"/>`)),
        ],
        header: { left: 64, top: 40, right: 180, height: 48 },
        badge: { backgroundColor: `#${t.cyan}`, color: '#FFFFFF', padding: '6px 18px', borderRadius: '6px' },
        body: { left: 64, top: 110, right: 160, bottom: 128 }, titleTop: 160, watermark: { right: 64, bottom: 32, width: 600, align: 'right' },
    }),
    abacus: (t) => ({
        decorations: [
            { behind: true, style: box(0, 0, 1280, 96, { backgroundColor: `#${t.cyan}` }) },
            box(280, 0, 1000, 96, art(1000, 96, '<rect x="0" y="44" width="1000" height="8" fill="#F3D9C4"/>' + range(16, i => { const x = 40 + i * 62 + (i > 4 ? 40 : 0) + (i > 9 ? 40 : 0); return `<ellipse cx="${x}" cy="48" rx="22" ry="26" fill="${i % 5 === 4 ? '#3B2F2F' : '#FDF6E3'}"/><ellipse cx="${x - 6}" cy="40" rx="6" ry="9" fill="#FFFFFF" fill-opacity=".45"/>`; }))),
            box(0, 96, 1280, 6, { backgroundColor: '#8C3A28' }),
            box(64, 690, 1152, 4, { backgroundColor: `#${t.cyan}`, opacity: '0.5' }),
        ],
        header: { left: 48, top: 24, width: 220, height: 48 },
        badge: { color: '#FFF4E6', fontSize: '26px', fontWeight: '800', letterSpacing: '1px' }, rule: null,
        body: { left: 64, top: 136, right: 64, bottom: 64 }, titleTop: 160, watermark: { right: 64, bottom: 36, width: 600, align: 'right' },
    }),
    tangram: (t) => ({
        decorations: [
            box(0, 0, 8, 720, { backgroundColor: `#${t.cyan}` }),
            box(980, 480, 300, 240, art(300, 240, [['60,0 300,0 180,120', '#F4A261'], ['60,0 60,240 180,120', '#E76F51'], ['300,120 300,240 180,240', '#2A9D8F'], ['180,120 240,60 300,120 240,180', '#E9C46A'], ['240,60 300,0 300,120', '#8ECAE6'], ['180,120 240,180 180,240', '#B5838D'], ['60,240 180,240 240,180 120,180', '#6D597A']].map(([pts, fill]) => `<polygon points="${pts}" fill="${fill}" stroke="#101418" stroke-width="3"/>`).join(''))),
        ],
        header: { left: 72, top: 36, right: 320, height: 48 },
        badge: { backgroundColor: `#${t.cyan}`, color: '#101418', padding: '6px 18px', borderRadius: '2px' },
        body: { left: 72, top: 100, right: 320, bottom: 56 }, titleTop: 150, watermark: { right: 72, top: 40, width: 220, align: 'right', color: '#8A94A6' },
    }),
    ticket: (t, { workspace }) => ({
        display: BLACK_DISPLAY,
        decorations: [
            { behind: true, style: box(0, 0, 200, 720, { backgroundColor: `#${t.cyan}` }) },
            box(198, 0, 0, 720, { borderLeft: '4px dashed #FFF8E7' }),
            box(176, -24, 48, 48, { backgroundColor: '#FFF8E7', borderRadius: '50%' }),
            box(176, 696, 48, 48, { backgroundColor: '#FFF8E7', borderRadius: '50%' }),
            label(box(0, 640, 200, 40, { color: 'rgba(255,255,255,0.8)', fontSize: '14px', letterSpacing: '4px', textAlign: 'center', lineHeight: '40px' }), 'ADMIT ONE'),
            label(box(1000, 24, 208, 24, { color: '#9A8F7A', fontSize: '13px', letterSpacing: '3px', textAlign: 'right', lineHeight: '24px' }), 'PRACTICE PASS'),
            box(248, 668, 960, 2, { backgroundColor: '#E8DCC5' }),
        ],
        header: { left: 0, top: 40, width: 190, height: 560, justifyContent: 'center' },
        badge: { writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#FFF8E7', fontSize: workspace ? '36px' : '64px', fontWeight: '900', fontFamily: BLACK_DISPLAY, letterSpacing: '4px' }, rule: null,
        body: { left: 248, top: 72, right: 72, bottom: 72 }, titleTop: 150, watermark: { left: 248, bottom: 20, width: 700, color: '#9A8F7A' },
    }),
    nightdrill: (t, { workspace }) => ({
        display: BLACK_DISPLAY,
        decorations: [
            { behind: true, style: box(0, 0, 160, 720, { backgroundColor: `#${t.cyan}` }) },
            label(box(0, 640, 160, 40, { color: '#0B0B0F', fontSize: '14px', letterSpacing: '6px', textAlign: 'center', lineHeight: '40px', fontWeight: '700' }), 'DRILL'),
            box(208, 656, 1000, 1, { backgroundColor: '#2A2A33' }),
            label(box(640, 680, 568, 24, { color: '#5A5A66', fontSize: '13px', letterSpacing: '4px', textAlign: 'right', lineHeight: '24px' }), 'SPEED · ACCURACY · CONFIDENCE'),
        ],
        header: { left: 0, top: 40, width: 160, height: 560, justifyContent: 'center' },
        badge: { writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#0B0B0F', fontSize: workspace ? '36px' : '72px', fontWeight: '900', fontFamily: BLACK_DISPLAY }, rule: null,
        body: { left: 208, top: 72, right: 72, bottom: 72 }, titleTop: 150, watermark: { left: 208, bottom: 16, width: 400, color: '#5A5A66' },
    }),
    sudoku: (t) => ({
        decorations: [
            box(1080, 24, 180, 180, art(180, 180, range(10, i => `<path d="M${i * 20} 0v180M0 ${i * 20}h180" stroke="${i % 3 === 0 ? '#1E1B2E' : '#C9CBDA'}" stroke-width="${i % 3 === 0 ? 2.5 : 1}"/>`) + [[0, 0, 5], [2, 1, 3], [4, 0, 7], [1, 3, 9], [6, 2, 1], [3, 5, 8], [8, 4, 2], [5, 7, 6], [7, 8, 4], [0, 6, 3]].map(([c, r, d]) => `<text x="${c * 20 + 10}" y="${r * 20 + 15}" font-size="14" font-weight="700" text-anchor="middle" font-family="Arial" fill="#${t.cyan}">${d}</text>`).join(''))),
            box(64, 668, 1152, 1, { backgroundColor: '#D9DCE6' }),
        ],
        header: { left: 64, top: 40, right: 232, height: 48 },
        badge: { backgroundColor: `#${t.cyan}`, color: '#FFFFFF', padding: '6px 18px', borderRadius: '6px' },
        body: { left: 64, top: 110, right: 232, bottom: 72 }, titleTop: 160, watermark: { right: 64, bottom: 24, width: 600, align: 'right' },
    }),
};

export const SIGNATURE_DESIGN_IDS = Object.keys(DESIGNS);

const region = ({ left, top, right, bottom, width, height }) => ({ position: 'absolute', left: px(left), top: px(top), ...(right !== undefined ? { right: px(right) } : { width: px(width) }), ...(bottom !== undefined ? { bottom: px(bottom) } : { height: px(height) }) });

export function signatureSlide(theme, title, workspace) {
    const build = DESIGNS[theme.design];
    if (!build) return null;
    const d = build(theme, { title, workspace });
    const { justifyContent, textAlign, ...headerRect } = d.header;
    const display = d.display || d.font || 'Arial, sans-serif';
    return {
        font: d.font || 'Arial, sans-serif',
        decorations: d.decorations.map(item => item.style ? item : { style: item }),
        header: { ...region(headerRect), display: 'flex', alignItems: 'center', gap: '24px', color: `#${theme.cyan}`, fontSize: '22px', fontWeight: '700', fontFamily: display, ...(justifyContent ? { justifyContent } : {}), ...(textAlign ? { textAlign } : {}) },
        badge: { whiteSpace: 'nowrap', ...d.badge },
        rule: d.rule === null ? null : { flex: 1, height: '1px', backgroundColor: `#${theme.rule}` },
        body: { ...region({ ...d.body, top: title ? d.titleTop : d.body.top }), color: `#${theme.textWhite}`, textAlign: 'left', overflowWrap: 'anywhere' },
        watermark: { color: `#${theme.cyan}`, ...d.watermark },
        title: { fontSize: '68px', lineHeight: 1.15, fontWeight: '700', marginBottom: '32px', fontFamily: display },
        subtitle: { fontSize: '22px', letterSpacing: '2px', color: `#${theme.cyan}` },
        footer: { fontSize: '24px', marginTop: '48px' },
        workspace: { height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 55px, #${theme.rule} 55px, #${theme.rule} 56px)` },
    };
}
