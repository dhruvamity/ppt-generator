// Thumbnail templates (1280 × 720, YouTube size) and a pure layout engine. Templates are lists of
// layers; `layoutThumbnail` resolves them into primitive SVG nodes so the live preview and the PNG
// export draw exactly the same thing. Text wraps and shrinks inside its box and never overflows it.
export const THUMB_W = 1280;
export const THUMB_H = 720;
const HEAVY = "'Arial Black', 'Segoe UI Black', Impact, sans-serif";
const SANS = 'Arial, Helvetica, sans-serif';
const SERIF = "Georgia, 'Times New Roman', serif";
const CHALK = "'Chalkboard SE', 'Segoe Print', 'Comic Sans MS', sans-serif";

export const THUMBNAIL_FIELDS = [
    { key: 'chapter', label: 'Chapter name', placeholder: 'Quadratic Equations' },
    { key: 'sub', label: 'Sub name / topic', placeholder: 'Nature of roots & the discriminant' },
    { key: 'lecture', label: 'Lecture no.', placeholder: '05' },
    { key: 'subject', label: 'Subject', placeholder: 'Maths', suggestions: ['Maths', 'CAT Quant', 'CAT DILR', 'Aptitude', 'Reasoning'] },
    { key: 'tagline', label: 'Tagline', placeholder: 'Class 10 · CBSE' },
    { key: 'teacher', label: 'Teacher name', placeholder: 'Dhruv Sir' },
];
export const DEFAULT_THUMBNAIL = { templateId: 'bold-split', chapter: 'Quadratic Equations', sub: 'Nature of roots & the discriminant', lecture: '05', subject: 'Maths', tagline: 'Class 10 · CBSE', teacher: 'Dhruv Sir', photo: { zoom: 1, x: 0, y: 0, fit: 'cover' } };

const text = (field, box, extra) => ({ type: 'text', text: field, ...box, ...extra });
const chip = (field, x, y, extra) => ({ type: 'chip', text: field, x, y, size: 26, padX: 22, padY: 12, rx: 8, weight: 700, family: SANS, upper: true, spacing: 2, ...extra });

export const THUMBNAIL_TEMPLATES = [
    {
        id: 'bold-split', name: 'Bold Split', subject: 'any', description: 'Photo on a slanted right panel, chapter in heavy type on navy.',
        bg: '#0F1B3D', layers: [
            { type: 'photo', x: 760, y: 0, w: 520, h: 720, shape: 'slant', slant: 80 },
            { type: 'polygon', points: '820,0 852,0 772,720 740,720', fill: '#FFC930' },
            chip('{subject}', 64, 56, { fill: '#FFC930', color: '#0F1B3D' }),
            text('{chapter}', { x: 64, y: 140, w: 620, h: 270 }, { size: 84, min: 44, lines: 3, weight: 900, family: HEAVY, fill: '#FFFFFF' }),
            text('{sub}', { x: 64, y: 420, w: 620, h: 90 }, { size: 34, min: 22, lines: 2, weight: 400, family: SANS, fill: '#C9D3F0' }),
            chip('LECTURE {lecture}', 64, 530, { fill: '#FFFFFF', color: '#0F1B3D', size: 30 }),
            text('{tagline}', { x: 64, y: 612, w: 620, h: 32 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#8FA0D0' }),
            text('{teacher}', { x: 64, y: 652, w: 620, h: 32 }, { size: 26, min: 18, lines: 1, weight: 700, family: SANS, fill: '#FFC930' }),
        ],
    },
    {
        id: 'spotlight', name: 'Spotlight Circle', subject: 'any', description: 'Black stage, photo in an amber ring, outlined lecture number.',
        bg: '#111111', layers: [
            { type: 'circle', cx: 1000, cy: 360, r: 330, fill: '#1E1E24' },
            { type: 'photo', x: 750, y: 110, w: 500, h: 500, shape: 'circle', ring: { color: '#F5B700', width: 10 } },
            text('{subject}', { x: 64, y: 56, w: 640, h: 40 }, { size: 26, min: 20, lines: 1, weight: 700, family: SANS, fill: '#F5B700', upper: true, spacing: 6 }),
            text('{chapter}', { x: 64, y: 120, w: 640, h: 330 }, { size: 90, min: 48, lines: 3, weight: 900, family: HEAVY, fill: '#FFFFFF' }),
            text('{sub}', { x: 64, y: 462, w: 640, h: 90 }, { size: 34, min: 22, lines: 2, weight: 400, family: SANS, fill: '#BBBBBB' }),
            text('LEC {lecture}', { x: 64, y: 570, w: 640, h: 90 }, { size: 72, min: 40, lines: 1, weight: 900, family: HEAVY, fill: 'none', stroke: '#F5B700', sw: 3, upper: true }),
            text('{teacher}', { x: 750, y: 636, w: 500, h: 40 }, { size: 28, min: 20, lines: 1, weight: 700, family: SANS, fill: '#F5B700', align: 'middle' }),
            text('{tagline}', { x: 64, y: 676, w: 640, h: 30 }, { size: 22, min: 18, lines: 1, weight: 400, family: SANS, fill: '#777777' }),
        ],
    },
    {
        id: 'chalk-lesson', name: 'Chalk Lesson', subject: 'maths', description: 'Green board with a chalk frame and a polaroid photo.',
        bg: '#2F5D50', layers: [
            { type: 'rect', x: 28, y: 28, w: 1224, h: 664, fill: 'none', stroke: '#F7F3E8', sw: 4, rx: 6 },
            text('{subject}', { x: 860, y: 80, w: 360, h: 60 }, { size: 30, min: 20, lines: 1, weight: 700, family: CHALK, fill: '#F7F3E8', align: 'middle', upper: true, spacing: 4 }),
            { type: 'photo', x: 860, y: 200, w: 360, h: 440, shape: 'rounded', rx: 6, ring: { color: '#FFFFFF', width: 14 } },
            text('{chapter}', { x: 72, y: 110, w: 740, h: 300 }, { size: 80, min: 44, lines: 3, weight: 700, family: CHALK, fill: '#FFE08A' }),
            text('{sub}', { x: 72, y: 420, w: 740, h: 90 }, { size: 34, min: 22, lines: 2, weight: 400, family: CHALK, fill: '#F7F3E8' }),
            chip('Lecture {lecture}', 72, 530, { fill: 'none', stroke: '#F7F3E8', sw: 3, color: '#F7F3E8', rx: 30, size: 30, family: CHALK, upper: false }),
            text('{tagline}', { x: 72, y: 624, w: 740, h: 40 }, { size: 24, min: 18, lines: 1, weight: 400, family: CHALK, fill: '#BFD9CC' }),
            text('{teacher}', { x: 860, y: 650, w: 360, h: 36 }, { size: 24, min: 18, lines: 1, weight: 700, family: CHALK, fill: '#F7F3E8', align: 'middle' }),
        ],
    },
    {
        id: 'cat-sprint', name: 'CAT Sprint', subject: 'cat', description: 'Red and black diagonal, photo cutout on the left, exam tag up top.',
        bg: '#B3001B', layers: [
            { type: 'polygon', points: '560,0 1280,0 1280,720 420,720', fill: '#141414' },
            text('{subject}', { x: 40, y: 36, w: 440, h: 100 }, { size: 80, min: 40, lines: 1, weight: 900, family: HEAVY, fill: '#FFFFFF', upper: true }),
            { type: 'photo', x: 40, y: 150, w: 440, h: 570, shape: 'rect' },
            text('{chapter}', { x: 600, y: 110, w: 620, h: 300 }, { size: 80, min: 44, lines: 3, weight: 900, family: HEAVY, fill: '#FFFFFF' }),
            text('{sub}', { x: 600, y: 420, w: 620, h: 90 }, { size: 32, min: 22, lines: 2, weight: 400, family: SANS, fill: '#FF8A80' }),
            chip('LECTURE {lecture}', 600, 530, { fill: '#FFC930', color: '#141414' }),
            text('{tagline}', { x: 600, y: 612, w: 620, h: 34 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#BBBBBB' }),
            text('{teacher}', { x: 600, y: 652, w: 620, h: 34 }, { size: 26, min: 18, lines: 1, weight: 700, family: SANS, fill: '#FFFFFF' }),
        ],
    },
    {
        id: 'neon-formula', name: 'Neon Formula', subject: 'maths', description: 'Dark with faint notation bands, gradient title and a glowing photo frame.',
        bg: '#0A0F1E', defs: [{ type: 'gradient', id: 'neon', x1: 0, y1: 0, x2: 1, y2: 0, stops: [['0%', '#00E5FF'], ['100%', '#FF2E9A']] }], layers: [
            { type: 'pattern', kind: 'formulas', x: 0, y: 0, w: 1280, h: 90, color: '#FFFFFF', opacity: 0.12 },
            { type: 'pattern', kind: 'formulas', x: 0, y: 640, w: 1280, h: 80, color: '#FFFFFF', opacity: 0.12 },
            { type: 'rect', x: 790, y: 80, w: 440, h: 560, rx: 34, fill: '#00E5FF', opacity: 0.25 },
            { type: 'photo', x: 800, y: 90, w: 420, h: 540, shape: 'rounded', rx: 28, ring: { color: '#00E5FF', width: 6 } },
            chip('{subject}', 64, 48, { fill: 'none', stroke: '#00E5FF', sw: 2, color: '#00E5FF' }),
            text('{chapter}', { x: 64, y: 120, w: 680, h: 300 }, { size: 84, min: 44, lines: 3, weight: 900, family: HEAVY, fill: 'gradient:neon' }),
            text('{sub}', { x: 64, y: 430, w: 680, h: 90 }, { size: 34, min: 22, lines: 2, weight: 400, family: SANS, fill: '#9BB0FF' }),
            chip('LECTURE {lecture}', 64, 540, { fill: '#FF2E9A', color: '#FFFFFF' }),
            text('{tagline}', { x: 64, y: 606, w: 680, h: 32 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#6B7AA8' }),
            text('{teacher}', { x: 800, y: 648, w: 420, h: 36 }, { size: 26, min: 18, lines: 1, weight: 700, family: SANS, fill: '#00E5FF', align: 'middle' }),
        ],
    },
    {
        id: 'paper-note', name: 'Paper Note', subject: 'any', description: 'Ruled paper, marker-highlighted chapter, sticky note lecture number.',
        bg: '#FFFDF7', layers: [
            { type: 'pattern', kind: 'rules', x: 0, y: 120, w: 1280, h: 600, color: '#DCE3EC', opacity: 1 },
            { type: 'line', x1: 110, y1: 0, x2: 110, y2: 720, stroke: '#F28B82', sw: 2 },
            { type: 'rect', x: 892, y: 122, w: 320, h: 400, fill: '#000000', opacity: 0.15 },
            { type: 'photo', x: 880, y: 110, w: 320, h: 400, shape: 'rect', ring: { color: '#FFFFFF', width: 14 } },
            chip('{subject}', 140, 44, { fill: '#2B6CB0', color: '#FFFFFF' }),
            text('{chapter}', { x: 140, y: 110, w: 700, h: 280 }, { size: 78, min: 44, lines: 3, weight: 900, family: HEAVY, fill: '#1F2933', highlight: '#FFE66D' }),
            text('{sub}', { x: 140, y: 410, w: 700, h: 90 }, { size: 32, min: 22, lines: 2, weight: 400, family: SERIF, fill: '#3E4C59', style: 'italic' }),
            { type: 'rect', x: 880, y: 540, w: 220, h: 120, fill: '#FFE66D' },
            text('LEC {lecture}', { x: 880, y: 540, w: 220, h: 120 }, { size: 44, min: 28, lines: 1, weight: 900, family: HEAVY, fill: '#1F2933', align: 'middle', valign: 'middle', upper: true }),
            text('{tagline}', { x: 140, y: 540, w: 700, h: 36 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#6B7A8C' }),
            text('{teacher}', { x: 140, y: 596, w: 700, h: 40 }, { size: 28, min: 18, lines: 1, weight: 700, family: SANS, fill: '#2B6CB0' }),
        ],
    },
    {
        id: 'gradient-pop', name: 'Gradient Pop', subject: 'any', description: 'Purple-to-orange gradient, giant outlined lecture number, round photo.',
        bg: 'gradient:pop', defs: [{ type: 'gradient', id: 'pop', x1: 0, y1: 0, x2: 1, y2: 1, stops: [['0%', '#7B2CBF'], ['100%', '#FF7A00']] }], layers: [
            text('{lecture}', { x: 800, y: 30, w: 440, h: 200 }, { size: 170, min: 90, lines: 1, weight: 900, family: HEAVY, fill: 'none', stroke: '#FFFFFF', sw: 4, align: 'end' }),
            { type: 'photo', x: 810, y: 240, w: 460, h: 460, shape: 'circle', ring: { color: '#FFFFFF', width: 10 } },
            chip('{subject}', 64, 48, { fill: '#FFFFFF', color: '#7B2CBF' }),
            text('{chapter}', { x: 64, y: 120, w: 700, h: 330 }, { size: 88, min: 44, lines: 3, weight: 900, family: HEAVY, fill: '#FFFFFF' }),
            text('{sub}', { x: 64, y: 470, w: 700, h: 90 }, { size: 34, min: 22, lines: 2, weight: 400, family: SANS, fill: '#FFE9D6' }),
            text('{tagline}', { x: 64, y: 590, w: 700, h: 34 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#FFD9B8' }),
            text('{teacher}', { x: 64, y: 640, w: 700, h: 40 }, { size: 28, min: 18, lines: 1, weight: 700, family: SANS, fill: '#FFFFFF' }),
        ],
    },
    {
        id: 'minimal-pro', name: 'Minimal Pro', subject: 'any', description: 'White, blue accent bar, photo in a rounded frame. Calm and clear.',
        bg: '#FFFFFF', layers: [
            { type: 'rect', x: 0, y: 0, w: 16, h: 720, fill: '#004AC6' },
            { type: 'pattern', kind: 'dots', x: 780, y: 40, w: 480, h: 640, color: '#C7D2E8', opacity: 1 },
            { type: 'photo', x: 820, y: 80, w: 400, h: 560, shape: 'rounded', rx: 12 },
            chip('{subject}', 72, 60, { fill: '#E8F0FF', color: '#004AC6' }),
            text('{chapter}', { x: 72, y: 140, w: 700, h: 300 }, { size: 76, min: 44, lines: 3, weight: 800, family: SANS, fill: '#0B1C30' }),
            text('{sub}', { x: 72, y: 450, w: 700, h: 90 }, { size: 32, min: 22, lines: 2, weight: 400, family: SANS, fill: '#4A5568' }),
            text('Lecture {lecture}', { x: 72, y: 560, w: 700, h: 50 }, { size: 36, min: 24, lines: 1, weight: 700, family: SANS, fill: '#004AC6' }),
            text('{tagline}', { x: 72, y: 628, w: 700, h: 34 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#718096' }),
            text('{teacher}', { x: 820, y: 652, w: 400, h: 36 }, { size: 24, min: 18, lines: 1, weight: 700, family: SANS, fill: '#0B1C30', align: 'middle' }),
        ],
    },
    {
        id: 'aptitude-arena', name: 'Aptitude Arena', subject: 'aptitude', description: 'Teal and yellow sports stripes with a tall rounded photo.',
        bg: '#0B3D3A', layers: [
            { type: 'polygon', points: '0,0 120,0 0,300', fill: '#F5C518' },
            { type: 'polygon', points: '0,720 0,560 220,720', fill: '#F5C518' },
            { type: 'photo', x: 820, y: 60, w: 400, h: 600, shape: 'rounded', rx: 40, ring: { color: '#F5C518', width: 8 } },
            chip('{subject}', 160, 48, { fill: 'none', stroke: '#F5C518', sw: 2, color: '#F5C518' }),
            text('{chapter}', { x: 160, y: 110, w: 620, h: 310 }, { size: 84, min: 44, lines: 3, weight: 900, family: HEAVY, fill: '#FFFFFF' }),
            text('{sub}', { x: 160, y: 430, w: 620, h: 90 }, { size: 32, min: 22, lines: 2, weight: 400, family: SANS, fill: '#BFE6E0' }),
            chip('LECTURE {lecture}', 160, 540, { fill: '#F5C518', color: '#0B3D3A' }),
            text('{tagline}', { x: 160, y: 616, w: 620, h: 34 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#8FC9C2' }),
            text('{teacher}', { x: 820, y: 672, w: 400, h: 36 }, { size: 24, min: 18, lines: 1, weight: 700, family: SANS, fill: '#F5C518', align: 'middle' }),
        ],
    },
    {
        id: 'exam-ticket', name: 'Exam Ticket', subject: 'cat', description: 'A red ticket stub carries the lecture number; photo framed on the right.',
        bg: '#FFF8E7', layers: [
            { type: 'rect', x: 0, y: 0, w: 200, h: 720, fill: '#E63946' },
            { type: 'line', x1: 200, y1: 0, x2: 200, y2: 720, stroke: '#FFF8E7', sw: 4, dash: '14 10' },
            text('{subject}', { x: 20, y: 60, w: 160, h: 60 }, { size: 28, min: 18, lines: 1, weight: 700, family: SANS, fill: '#FFFFFF', align: 'middle', upper: true }),
            text('{lecture}', { x: 20, y: 200, w: 160, h: 160 }, { size: 110, min: 60, lines: 1, weight: 900, family: HEAVY, fill: '#FFFFFF', align: 'middle', valign: 'middle' }),
            text('LECTURE', { x: 20, y: 370, w: 160, h: 40 }, { size: 22, min: 16, lines: 1, weight: 700, family: SANS, fill: '#FFFFFF', align: 'middle', spacing: 4 }),
            { type: 'photo', x: 860, y: 60, w: 380, h: 600, shape: 'rect', ring: { color: '#1D1D1D', width: 6 } },
            text('{chapter}', { x: 248, y: 110, w: 560, h: 310 }, { size: 76, min: 44, lines: 3, weight: 900, family: HEAVY, fill: '#1D1D1D' }),
            text('{sub}', { x: 248, y: 430, w: 560, h: 90 }, { size: 30, min: 22, lines: 2, weight: 400, family: SANS, fill: '#5C5C5C' }),
            text('{tagline}', { x: 248, y: 560, w: 560, h: 34 }, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, fill: '#9A8F7A' }),
            text('{teacher}', { x: 248, y: 618, w: 560, h: 40 }, { size: 28, min: 18, lines: 1, weight: 700, family: SANS, fill: '#E63946' }),
        ],
    },
];

export const estimateTextWidth = (value, { size, weight, family, spacing = 0 }) => {
    const factor = /Black|Impact/.test(family) ? 0.74 : Number(weight) >= 700 ? 0.62 : 0.55;
    return value.length * size * factor + Math.max(0, value.length - 1) * spacing;
};

const interpolate = (template, data) => template.replace(/\{(\w+)\}/g, (_, key) => String(data[key] ?? '').trim());

export function wrapText(value, width, measureLine) {
    const lines = [];
    for (const paragraph of value.split('\n')) {
        let line = '';
        for (const word of paragraph.split(/\s+/).filter(Boolean)) {
            const candidate = line ? `${line} ${word}` : word;
            if (measureLine(candidate) <= width || !line && measureLine(word) <= width) { line = candidate; continue; }
            if (line) lines.push(line);
            line = '';
            // A single word wider than the box is broken by character.
            let chunk = '';
            for (const char of word) {
                if (measureLine(chunk + char) > width && chunk) { lines.push(chunk); chunk = ''; }
                chunk += char;
            }
            line = chunk;
        }
        lines.push(line);
    }
    return lines;
}

export function fitText(layer, value, measure) {
    const maxLines = layer.lines || 1, lineHeight = layer.lineHeight || 1.12, min = layer.min || layer.size;
    const font = size => ({ size, weight: layer.weight, family: layer.family, spacing: layer.spacing || 0, style: layer.style });
    for (let size = layer.size; size >= min; size -= 2) {
        const lines = wrapText(value, layer.w, line => measure(line, font(size)));
        if (lines.length <= maxLines && lines.length * size * lineHeight <= layer.h + 1) return { size, lines, truncated: false };
    }
    let lines = wrapText(value, layer.w, line => measure(line, font(min)));
    if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        let last = lines[maxLines - 1];
        while (last.length > 1 && measure(`${last}…`, font(min)) > layer.w) last = last.slice(0, -1).trimEnd();
        lines[maxLines - 1] = `${last}…`;
    }
    return { size: min, lines, truncated: true };
}

const PATTERNS = {
    rules: ({ x, y, w, h, color, opacity }) => Array.from({ length: Math.floor(h / 48) }, (_, i) => ({ type: 'line', x1: x, y1: y + i * 48, x2: x + w, y2: y + i * 48, stroke: color, sw: 1.5, opacity })),
    dots: ({ x, y, w, h, color, opacity }) => { const nodes = []; for (let r = 0; r <= h; r += 32) for (let c = 0; c <= w; c += 32) nodes.push({ type: 'circle', cx: x + c, cy: y + r, r: 2, fill: color, opacity }); return nodes; },
    formulas: ({ x, y, w, h, color, opacity }) => ['∑', '∫', 'π', '√', 'θ', '∞', 'Δ', '≈', 'x²', 'f(x)', '∂', '±', 'log', 'sin', '∝'].map((symbol, i) => ({ type: 'text', lines: [{ x: x + 40 + i * (w / 15), y: y + h * 0.7, text: symbol }], size: Math.min(h * 0.55, 44), weight: 700, family: SERIF, fill: color, opacity, anchor: 'start' })),
};

const photoClip = (layer) => {
    const { x, y, w, h } = layer;
    if (layer.shape === 'circle') return { type: 'circle', cx: x + w / 2, cy: y + h / 2, r: Math.min(w, h) / 2 };
    if (layer.shape === 'slant') return { type: 'polygon', points: `${x + (layer.slant || 80)},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}` };
    return { type: 'rect', x, y, w, h, rx: layer.shape === 'rounded' ? layer.rx || 16 : 0 };
};

export function layoutThumbnail(template, data, measure = estimateTextWidth) {
    const nodes = [], boxes = [];
    const photo = { zoom: 1, x: 0, y: 0, fit: 'cover', ...(data.photo || {}) };
    nodes.push({ type: 'rect', x: 0, y: 0, w: THUMB_W, h: THUMB_H, fill: template.bg });
    for (const layer of template.layers) {
        if (layer.type === 'pattern') { nodes.push(...PATTERNS[layer.kind](layer)); continue; }
        if (layer.type === 'photo') {
            const clip = photoClip(layer);
            const iw = layer.w * photo.zoom, ih = layer.h * photo.zoom;
            const image = { x: layer.x - (iw - layer.w) / 2 + photo.x * layer.w / 2, y: layer.y - (ih - layer.h) / 2 + photo.y * layer.h / 2, w: iw, h: ih, preserve: photo.fit === 'contain' ? 'xMidYMax meet' : 'xMidYMid slice' };
            nodes.push({ type: 'photo', clip, image, href: data.photoHref || null, ring: layer.ring || null, slot: { x: layer.x, y: layer.y, w: layer.w, h: layer.h } });
            boxes.push({ kind: 'photo', box: { x: layer.x, y: layer.y, w: layer.w, h: layer.h } });
            continue;
        }
        if (layer.type === 'text' || layer.type === 'chip') {
            let value = interpolate(layer.text, data);
            if (!value) continue;
            if (layer.upper) value = value.toUpperCase();
            if (layer.type === 'chip') {
                const font = { size: layer.size, weight: layer.weight, family: layer.family, spacing: layer.spacing || 0 };
                const w = measure(value, font) + layer.padX * 2, h = layer.size + layer.padY * 2;
                nodes.push({ type: 'rect', x: layer.x, y: layer.y, w, h, rx: layer.rx, fill: layer.fill, stroke: layer.stroke, sw: layer.sw });
                nodes.push({ type: 'text', lines: [{ x: layer.x + layer.padX, y: layer.y + layer.padY + layer.size * 0.78, text: value }], ...font, fill: layer.color, anchor: 'start' });
                boxes.push({ kind: 'text', box: { x: layer.x, y: layer.y, w, h } });
                continue;
            }
            const fit = fitText(layer, value, measure);
            const lineHeight = layer.lineHeight || 1.12, block = fit.lines.length * fit.size * lineHeight;
            const top = layer.valign === 'middle' ? layer.y + (layer.h - block) / 2 : layer.valign === 'bottom' ? layer.y + layer.h - block : layer.y;
            const anchor = layer.align || 'start';
            const lx = anchor === 'middle' ? layer.x + layer.w / 2 : anchor === 'end' ? layer.x + layer.w : layer.x;
            const font = { size: fit.size, weight: layer.weight, family: layer.family, spacing: layer.spacing || 0, style: layer.style };
            const lines = fit.lines.map((line, i) => ({ x: lx, y: top + i * fit.size * lineHeight + fit.size * 0.8, text: line, w: measure(line, font) }));
            if (layer.highlight) for (const line of lines) nodes.push({ type: 'rect', x: anchor === 'middle' ? line.x - line.w / 2 - 10 : anchor === 'end' ? line.x - line.w - 10 : line.x - 10, y: line.y - fit.size * 0.8 - 4, w: line.w + 20, h: fit.size * lineHeight + 4, fill: layer.highlight, rx: 4 });
            nodes.push({ type: 'text', lines, ...font, fill: layer.fill, stroke: layer.stroke, sw: layer.sw, anchor, truncated: fit.truncated });
            boxes.push({ kind: 'text', box: { x: layer.x, y: layer.y, w: layer.w, h: layer.h }, field: layer.text });
            continue;
        }
        nodes.push(layer);
    }
    return { width: THUMB_W, height: THUMB_H, defs: template.defs || [], nodes, boxes };
}
