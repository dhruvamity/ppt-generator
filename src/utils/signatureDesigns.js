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
        body: { left: 64, top: 72, right: 340, bottom: 72 }, titleTop: 150, watermark: { right: 40, bottom: 56, width: 300, align: 'center', color: '#8D99AE' },
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
    // Calm: the working area sits between two tall matrix brackets.
    matrix: (t) => ({
        display: "Cambria, Georgia, 'Times New Roman', serif",
        decorations: [
            box(40, 112, 22, 560, { borderLeft: `4px solid #${t.cyan}`, borderTop: `4px solid #${t.cyan}`, borderBottom: `4px solid #${t.cyan}`, boxSizing: 'border-box' }),
            box(1218, 112, 22, 560, { borderRight: `4px solid #${t.cyan}`, borderTop: `4px solid #${t.cyan}`, borderBottom: `4px solid #${t.cyan}`, boxSizing: 'border-box' }),
            label(box(1040, 680, 200, 24, { color: '#9AA0C3', fontSize: '15px', lineHeight: '24px', textAlign: 'right', fontStyle: 'italic', fontFamily: 'Cambria, Georgia, serif' }), 'A = [aᵢⱼ]ₘ×ₙ'),
        ],
        header: { left: 96, top: 40, right: 96, height: 48 },
        badge: { color: `#${t.cyan}`, fontSize: '26px', fontWeight: '700' },
        body: { left: 96, top: 120, right: 96, bottom: 72 }, titleTop: 180, watermark: { left: 96, bottom: 28, width: 600, color: '#9AA0C3' },
    }),
    // Calm: a textbook theorem panel with a Q.E.D. tombstone.
    theorem: (t) => ({
        font: "'Palatino Linotype', Palatino, Georgia, serif", display: "'Palatino Linotype', Palatino, Georgia, serif",
        decorations: [
            { behind: true, style: box(64, 108, 1152, 548, { backgroundColor: `#${t.bgCard}`, borderRadius: '4px' }) },
            box(64, 108, 6, 548, { backgroundColor: `#${t.cyan}` }),
            label(box(1040, 672, 140, 24, { color: '#8A8478', fontSize: '15px', lineHeight: '24px', textAlign: 'right', fontStyle: 'italic' }), 'Q.E.D.'),
            box(1192, 672, 24, 24, { backgroundColor: `#${t.cyan}` }),
        ],
        header: { left: 64, top: 44, right: 64, height: 48 },
        badge: { color: `#${t.cyan}`, fontSize: '26px', fontWeight: '700', fontVariant: 'small-caps', letterSpacing: '2px' },
        body: { left: 96, top: 128, right: 96, bottom: 80 }, titleTop: 170, watermark: { left: 96, bottom: 24, width: 600, color: '#8A8478' },
    }),
    // Balanced: aluminium-framed whiteboard, marker tray and a sticky note.
    whiteboard: (t) => ({
        display: "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', 'Chalkboard SE', sans-serif",
        decorations: [
            box(0, 0, 1280, 18, { background: 'linear-gradient(180deg, #E2E6EB, #A9B2BD)' }),
            box(0, 702, 1280, 18, { background: 'linear-gradient(0deg, #E2E6EB, #A9B2BD)' }),
            box(0, 0, 18, 720, { background: 'linear-gradient(90deg, #E2E6EB, #A9B2BD)' }),
            box(1262, 0, 18, 720, { background: 'linear-gradient(270deg, #E2E6EB, #A9B2BD)' }),
            box(36, 36, 22, 22, { backgroundColor: `#${t.gold}`, borderRadius: '50%', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }),
            box(1070, 40, 160, 150, { ...art(160, 150, `<path d="M6 12h148v118l-20 16H6Z" fill="#FDE68A"/><path d="M154 130l-20 16v-16Z" fill="#F59E0B" fill-opacity=".6"/><rect x="56" y="2" width="48" height="16" fill="#FFFFFF" fill-opacity=".75"/><g font-family="Segoe Print,Comic Sans MS,sans-serif" fill="#1E293B"><text x="20" y="62" font-size="24">a² − b²</text><text x="20" y="98" font-size="18">= (a+b)(a−b)</text></g><path d="M110 116l8 8 16-18" fill="none" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>`), transform: 'rotate(3deg)' }),
            box(200, 680, 880, 16, { backgroundColor: '#C3CAD3', borderRadius: '4px 4px 0 0', boxShadow: 'inset 0 -3px 0 #9AA4B1' }),
            box(240, 666, 96, 14, { backgroundColor: `#${t.cyan}`, borderRadius: '7px' }),
            box(352, 666, 96, 14, { backgroundColor: `#${t.gold}`, borderRadius: '7px' }),
            box(464, 666, 96, 14, { backgroundColor: '#16A34A', borderRadius: '7px' }),
            box(940, 656, 110, 24, { backgroundColor: '#334155', borderRadius: '4px', boxShadow: 'inset 0 -8px 0 #CBD5E1' }),
        ],
        header: { left: 72, top: 48, right: 240, height: 52 },
        badge: { backgroundColor: `#${t.cyan}`, color: '#FFFFFF', padding: '4px 16px', borderRadius: '6px' },
        body: { left: 72, top: 120, right: 240, bottom: 100 }, titleTop: 170, watermark: { left: 72, bottom: 72, width: 600, color: '#94A3B8' },
    }),
    // Bold: the CAT exam screen, with section bar, timer, question palette and action buttons.
    mockui: (t) => {
        const STATES = [['#2E9E44', '#FFFFFF', 'Answered'], ['#D64545', '#FFFFFF', 'Not Answered'], ['#E3E7ED', '#5B6B82', 'Not Visited'], ['#7B4FC9', '#FFFFFF', 'Marked for Review']];
        const order = [0, 0, 1, 0, 3, 0, 1, 0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        const cell = (state, x, y, w, h) => state === 3 ? `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${h / 2}" fill="${STATES[state][0]}"/>` : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${state === 2 ? 4 : 10}" fill="${STATES[state][0]}" stroke="#B8C2D0" stroke-width="${state === 2 ? 1 : 0}"/>`;
        const palette = order.map((state, i) => { const x = 6 + (i % 4) * 56, y = 6 + Math.floor(i / 4) * 50; return cell(state, x, y, 44, 36) + `<text x="${x + 22}" y="${y + 23}" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${STATES[state][1]}">${i + 1}</text>`; }).join('');
        const legend = STATES.map(([, , name], i) => cell(i, 4, 8 + i * 52, 30, 26) + `<text x="46" y="${26 + i * 52}" font-family="Arial,sans-serif" font-size="14" fill="#33415C">${name}</text>`).join('');
        const button = (fill, color, border) => ({ backgroundColor: fill, color, border: `1px solid ${border}`, borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', lineHeight: '30px', textAlign: 'center', fontWeight: '700' });
        return {
            decorations: [
                { behind: true, style: box(0, 0, 1280, 56, { backgroundColor: '#1C3D6E' }) },
                label(box(32, 16, 460, 24, { color: '#FFFFFF', fontSize: '15px', lineHeight: '24px', fontWeight: '700', letterSpacing: '0.5px' }), 'Section: Quantitative Ability'),
                box(1000, 72, 256, 576, { backgroundColor: '#FFFFFF', border: '1px solid #CDD5E0', borderRadius: '6px', boxSizing: 'border-box' }),
                label(box(1016, 84, 224, 24, { color: '#1C3D6E', fontSize: '13px', lineHeight: '24px', fontWeight: '700', letterSpacing: '2px' }), 'QUESTION PALETTE'),
                box(1016, 120, 224, 250, art(224, 250, palette)),
                box(1016, 400, 224, 220, art(224, 220, legend)),
                { behind: true, style: box(0, 664, 1280, 56, { backgroundColor: '#E6EBF2' }) },
                label(box(32, 676, 240, 32, button('#FFFFFF', '#33415C', '#8A99B0')), 'Mark for Review & Next'),
                label(box(288, 676, 160, 32, button('#FFFFFF', '#33415C', '#8A99B0')), 'Clear Response'),
                label(box(1056, 676, 192, 32, button(`#${t.cyan}`, '#FFFFFF', `#${t.cyan}`)), 'Save & Next'),
            ],
            header: { left: 32, top: 76, right: 304, height: 44 },
            badge: { color: '#1A1A1A', fontSize: '22px', fontWeight: '800' },
            body: { left: 32, top: 136, right: 304, bottom: 72 }, titleTop: 150, watermark: { left: 470, bottom: 18, width: 560, color: '#5B6B82' },
        };
    },
    // Bold: Fibonacci squares and the golden spiral on a dark slide.
    golden: (t) => {
        const squares = [[0, 0, 233], [233, 0, 144], [288, 144, 89], [233, 178, 55], [233, 144, 34], [267, 144, 21], [275, 165, 13]];
        const spiral = 'M0 233A233 233 0 0 1 233 0A144 144 0 0 1 377 144A89 89 0 0 1 288 233A55 55 0 0 1 233 178A34 34 0 0 1 267 144A21 21 0 0 1 288 165A13 13 0 0 1 275 178';
        return {
            display: "Georgia, 'Times New Roman', serif",
            decorations: [
                label(box(900, 76, 340, 240, { color: '#2A2420', fontSize: '220px', lineHeight: '240px', textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic' }), 'φ'),
                box(880, 330, 377, 233, art(377, 233, squares.map(([x, y, s]) => `<rect x="${x + 1}" y="${y + 1}" width="${s - 2}" height="${s - 2}" fill="none" stroke="#57534E" stroke-width="2"/>`).join('') + `<path d="${spiral}" fill="none" stroke="#${t.cyan}" stroke-width="4" stroke-linecap="round"/>`)),
                label(box(880, 580, 377, 32, { color: `#${t.gold}`, fontSize: '20px', lineHeight: '32px', textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic' }), 'φ = (1 + √5) / 2 ≈ 1.618'),
                label(box(880, 620, 377, 24, { color: '#A8A29E', fontSize: '15px', lineHeight: '24px', textAlign: 'center', letterSpacing: '2px' }), '1, 1, 2, 3, 5, 8, 13, 21, 34 …'),
            ],
            header: { left: 72, top: 40, right: 420, height: 48 },
            badge: { color: '#1C1917', backgroundColor: `#${t.cyan}`, padding: '4px 18px', borderRadius: '999px', fontWeight: '800' },
            body: { left: 72, top: 110, right: 420, bottom: 64 }, titleTop: 170, watermark: { right: 40, top: 40, width: 360, align: 'right', color: '#A8A29E' },
        };
    },
    // Bold: an LCD display for the question number beside a full keypad.
    calculator: (t, { workspace }) => {
        const keys = ['AC', '√', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', 'x²', '='];
        const pad = keys.map((key, i) => { const col = i % 4, row = Math.floor(i / 4), x = col * 62 + 4, y = row * 84 + 4, op = col === 3 || i < 3; return `<rect x="${x}" y="${y}" width="54" height="72" rx="10" fill="${op ? `#${t.cyan}` : '#4A515C'}"/><rect x="${x}" y="${y + 62}" width="54" height="10" rx="5" fill="#000000" fill-opacity=".25"/><text x="${x + 27}" y="${y + 44}" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${op ? '#2B2F36' : '#F1F3F5'}">${key}</text>`; }).join('');
        return {
            decorations: [
                { behind: true, style: box(40, 24, 1200, 100, { backgroundColor: '#B9C7A5', borderRadius: '12px', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.35)' }) },
                label(box(64, 30, 360, 18, { color: '#4A5A3A', fontSize: '13px', lineHeight: '18px', letterSpacing: '4px', fontFamily: "'Courier New', monospace", fontWeight: '700' }), 'DEG   STAT   M+'),
                box(1040, 136, 200, 22, art(200, 22, range(5, i => `<rect x="${i * 40 + 1}" y="1" width="38" height="20" fill="#3B2F2A" stroke="#5C4A40"/>`))),
                box(990, 170, 250, 424, art(250, 424, pad)),
                label(box(990, 610, 250, 22, { color: '#8A919C', fontSize: '13px', lineHeight: '22px', letterSpacing: '3px', textAlign: 'center', fontWeight: '700' }), 'QUANT-CALC  fx-2026'),
            ],
            header: { left: 72, top: 52, right: 72, height: 60, justifyContent: 'flex-end' },
            badge: { color: '#1F2A16', fontFamily: "'Courier New', monospace", fontSize: workspace ? '32px' : '46px', fontWeight: '700', letterSpacing: '4px' }, rule: null,
            body: { left: 64, top: 156, right: 330, bottom: 56 }, titleTop: 170, watermark: { left: 64, bottom: 20, width: 600, color: '#8A919C' },
        };
    },
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
