// Thumbnail templates (1280 × 720, YouTube size) and a pure layout engine. Templates are lists of
// layers; `layoutThumbnail` resolves them into primitive SVG nodes so the live preview and the PNG
// export draw exactly the same thing. Text wraps and shrinks inside its box and never overflows it.
// Stickers are the maths / CAT illustrations; those not marked `behind` must stay clear of text and photo.
import { STICKERS } from './thumbnailStickers.js';

export const THUMB_W = 1280;
export const THUMB_H = 720;
const HEAVY = "'Arial Black', 'Segoe UI Black', Impact, sans-serif";
const SANS = 'Arial, Helvetica, sans-serif';
const SERIF = "Georgia, 'Times New Roman', serif";
const CHALK = "'Chalkboard SE', 'Segoe Print', 'Comic Sans MS', sans-serif";
const YELLOW = '#FFD400', RED = '#E53935', BLACK = '#111111', WHITE = '#FFFFFF';

export const THUMBNAIL_FIELDS = [
    { key: 'chapter', label: 'Chapter name', placeholder: 'Quadratic Equations' },
    { key: 'sub', label: 'Sub name / topic', placeholder: 'Nature of roots & the discriminant' },
    { key: 'lecture', label: 'Lecture no.', placeholder: '05' },
    { key: 'subject', label: 'Subject', placeholder: 'Maths', suggestions: ['Maths', 'Quant', 'DILR', 'Aptitude', 'Reasoning', 'Arithmetic'] },
    { key: 'exam', label: 'Exam / badge', placeholder: 'CAT 2026', suggestions: ['CAT 2026', 'XAT 2026', 'CLASS 10', 'JEE 2026', 'SSC CGL', 'BANK PO', 'NMAT'] },
    { key: 'tagline', label: 'Tagline', placeholder: 'Shortcuts · Tricks · PYQs' },
    { key: 'teacher', label: 'Teacher name', placeholder: 'Dhruv Sir' },
];
export const DEFAULT_THUMBNAIL = { templateId: 'cat-blast', chapter: 'Quadratic Equations', sub: 'Nature of roots & the discriminant', lecture: '05', subject: 'Maths', exam: 'CAT 2026', tagline: 'Shortcuts · Tricks · PYQs', teacher: 'Dhruv Sir', photo: { zoom: 1, x: 0, y: 0, fit: 'cover' } };

const text = (field, box, extra) => ({ type: 'text', text: field, ...box, ...extra });
const chip = (field, x, y, extra) => ({ type: 'chip', text: field, x, y, size: 26, padX: 22, padY: 12, rx: 8, weight: 700, family: SANS, upper: true, spacing: 2, ...extra });
const sticker = (kind, x, y, w, h, extra = {}) => ({ type: 'sticker', kind, x, y, w, h, ...extra });
const behind = (kind, extra = {}) => sticker(kind, 0, 0, THUMB_W, THUMB_H, { behind: true, ...extra });
const glow = (id, color) => ({ type: 'radial', id, color });
const title = (box, extra) => text('{chapter}', box, { size: 88, min: 46, lines: 3, weight: 900, family: HEAVY, ...extra });
const subline = (box, extra) => text('{sub}', box, { size: 32, min: 22, lines: 2, weight: 700, family: SANS, ...extra });
const small = (field, box, extra) => text(field, box, { size: 24, min: 18, lines: 1, weight: 400, family: SANS, ...extra });

export const THUMBNAIL_TEMPLATES = [
    {
        id: 'cat-blast', name: 'CAT Blast', subject: 'cat', description: 'Yellow with light rays, a starburst exam badge, outlined title and an arrow at the teacher cutout.',
        bg: YELLOW, defs: [glow('blast', WHITE)], layers: [
            behind('rays', { color: '#FF9F1C', opacity: 0.5 }),
            behind('formulas', { color: BLACK, color2: RED, opacity: 0.08 }),
            { type: 'circle', cx: 1030, cy: 420, r: 340, fill: 'gradient:blast' },
            { type: 'photo', x: 800, y: 40, w: 460, h: 680, shape: 'rect' },
            sticker('burst', 56, 24, 190, 190, { color: RED, color2: WHITE, text: '{exam}', rotate: -6 }),
            chip('{subject}', 270, 60, { fill: BLACK, color: YELLOW }),
            sticker('badge', 480, 44, 290, 86, { color: WHITE, color2: BLACK, text: 'LEC {lecture}' }),
            title({ x: 56, y: 230, w: 700, h: 270 }, { fill: BLACK, outline: WHITE, outlineWidth: 10, shadow: '#B38600' }),
            subline({ x: 56, y: 510, w: 700, h: 70 }, { fill: '#3A2A00' }),
            text('{teacher}', { x: 56, y: 600, w: 420, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: RED }),
            small('{tagline}', { x: 56, y: 652, w: 420, h: 36 }, { fill: '#5B4300', weight: 700 }),
            sticker('arrow', 520, 590, 240, 130, { color: RED, color2: BLACK }),
        ],
    },
    {
        id: 'quant-tricks', name: 'Quant Tricks', subject: 'cat', description: 'Navy grid with calculator, stopwatch and number tiles. Photo cutout on the left.',
        bg: '#0B1E3F', defs: [glow('orange', '#FF8C42')], layers: [
            behind('grid', { color: WHITE, opacity: 0.06 }),
            behind('formulas', { color: WHITE, color2: '#FFC857', opacity: 0.09 }),
            { type: 'circle', cx: 250, cy: 420, r: 330, fill: 'gradient:orange' },
            { type: 'photo', x: 30, y: 60, w: 440, h: 660, shape: 'rect' },
            chip('{exam}', 520, 44, { fill: '#FF8C42', color: BLACK }),
            sticker('badge', 980, 30, 280, 84, { color: YELLOW, color2: BLACK, text: 'SHORTCUT', rotate: 3 }),
            title({ x: 520, y: 140, w: 720, h: 280 }, { fill: WHITE, shadow: '#000000' }),
            subline({ x: 520, y: 430, w: 720, h: 76 }, { fill: '#FFC857' }),
            chip('LEC {lecture}', 520, 530, { fill: WHITE, color: '#0B1E3F', size: 28 }),
            text('{teacher}', { x: 760, y: 530, w: 330, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#FF8C42' }),
            small('{tagline}', { x: 760, y: 584, w: 330, h: 36 }, { fill: '#9FB3D9' }),
            sticker('calculator', 1110, 520, 130, 180, { color: '#FFC857', color2: '#FF8C42', rotate: 8 }),
            sticker('clock', 520, 600, 100, 110, { color: YELLOW, color2: RED }),
            sticker('tiles', 640, 630, 280, 80, { color: '#FF8C42', color2: YELLOW, text: '7 2 9 4' }),
        ],
    },
    {
        id: 'di-charts', name: 'DI Charts', subject: 'cat', description: 'Clean white with bar, pie and table stickers for data interpretation sets.',
        bg: WHITE, layers: [
            behind('grid', { color: '#CFE3E8', opacity: 0.6 }),
            { type: 'photo', x: 820, y: 50, w: 440, h: 440, shape: 'circle', ring: { color: '#0E7490', width: 12 } },
            sticker('barchart', 820, 520, 200, 170, { color: '#0E7490', color2: '#F97316' }),
            sticker('pie', 1060, 510, 180, 180, { color: '#0E7490', color2: '#F97316', rotate: -10 }),
            chip('{exam}', 56, 44, { fill: '#0E7490', color: WHITE }),
            sticker('badge', 330, 40, 300, 84, { color: '#F97316', color2: BLACK, text: 'DI SPECIAL', rotate: -3 }),
            title({ x: 56, y: 140, w: 720, h: 290 }, { fill: '#0B2A2A', outline: WHITE, outlineWidth: 8 }),
            subline({ x: 56, y: 440, w: 720, h: 76 }, { fill: '#F97316' }),
            chip('LEC {lecture}', 56, 530, { fill: BLACK, color: WHITE, size: 28 }),
            text('{teacher}', { x: 300, y: 530, w: 460, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#0E7490' }),
            small('{tagline}', { x: 300, y: 584, w: 460, h: 36 }, { fill: '#4A5568' }),
            sticker('table', 56, 600, 200, 110, { color: '#0E7490', color2: '#F97316', rotate: -4 }),
            sticker('arrowRight', 560, 630, 200, 80, { color: '#F97316', color2: BLACK }),
        ],
    },
    {
        id: 'lr-puzzle', name: 'LR Puzzle', subject: 'cat', description: 'Purple with Venn diagram, dice, cube and puzzle piece for logical reasoning.',
        bg: '#3A0CA3', defs: [glow('pink', '#F72585')], layers: [
            behind('formulas', { color: WHITE, color2: '#FFD60A', opacity: 0.1, text: '? ! ⇒ ∴ ∧ ∨ ¬ ⊂ ∪ ∩ ≡ ∃ ∀ ⊕ ≠ ∅ ⇔ ∈' }),
            { type: 'circle', cx: 1030, cy: 500, r: 320, fill: 'gradient:pink' },
            sticker('venn', 1020, 24, 240, 200, { color: '#FFD60A', color2: '#F72585', rotate: 6 }),
            { type: 'photo', x: 800, y: 240, w: 460, h: 480, shape: 'rect' },
            chip('{exam}', 56, 44, { fill: '#FFD60A', color: BLACK }),
            sticker('badge', 300, 40, 300, 84, { color: '#F72585', color2: WHITE, text: 'PUZZLE TIME', rotate: -3 }),
            title({ x: 56, y: 140, w: 720, h: 290 }, { fill: WHITE, shadow: '#1A0550' }),
            subline({ x: 56, y: 440, w: 720, h: 76 }, { fill: '#FFD60A' }),
            chip('LEC {lecture}', 56, 530, { fill: WHITE, color: '#3A0CA3', size: 28 }),
            text('{teacher}', { x: 300, y: 530, w: 440, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#F72585' }),
            small('{tagline}', { x: 300, y: 584, w: 440, h: 36 }, { fill: '#D9CCFF' }),
            sticker('dice', 56, 600, 200, 120, { color: '#FFD60A', color2: BLACK }),
            sticker('puzzle', 300, 630, 90, 90, { color: '#F72585', color2: '#FFD60A', rotate: 15 }),
            sticker('cube', 620, 630, 90, 90, { color: '#4CC9F0', color2: '#3A0CA3', rotate: -8 }),
        ],
    },
    {
        id: 'geometry-lab', name: 'Geometry Lab', subject: 'maths', description: 'Chalk-green board with a polaroid photo, triangle, ruler, graph and light bulb.',
        bg: '#1E4D3B', layers: [
            behind('formulas', { color: '#F7F3E8', color2: '#FFE08A', opacity: 0.12, text: '∠ △ ⊥ ∥ π r² ≅ ∼ ° √ ∑ θ ⌒ ≡ ∞ ½ ab' }),
            { type: 'rect', x: 28, y: 28, w: 1224, h: 664, fill: 'none', stroke: '#F7F3E8', sw: 4, rx: 6 },
            { type: 'photo', x: 860, y: 110, w: 340, h: 440, shape: 'rect', ring: { color: WHITE, width: 14 } },
            sticker('geometry', 860, 572, 150, 138, { color: '#FFE08A', color2: '#F28B82' }),
            sticker('ruler', 1030, 600, 200, 40, { color: '#FFE08A', color2: BLACK, rotate: -6 }),
            chip('{subject}', 72, 56, { fill: 'none', stroke: '#F7F3E8', sw: 3, color: '#F7F3E8', family: CHALK, upper: true }),
            sticker('badge', 300, 44, 280, 80, { color: '#FFE08A', color2: BLACK, text: '{exam}', rotate: 2 }),
            title({ x: 72, y: 140, w: 740, h: 280 }, { size: 80, fill: '#FFE08A', family: CHALK, weight: 700 }),
            subline({ x: 72, y: 430, w: 740, h: 76 }, { fill: '#F7F3E8', family: CHALK, weight: 400 }),
            chip('Lec {lecture}', 72, 520, { fill: 'none', stroke: '#F7F3E8', sw: 3, color: '#F7F3E8', rx: 30, size: 30, family: CHALK, upper: false }),
            text('{teacher}', { x: 330, y: 520, w: 480, h: 44 }, { size: 30, min: 20, lines: 1, weight: 700, family: CHALK, fill: '#F7F3E8' }),
            small('{tagline}', { x: 330, y: 574, w: 480, h: 36 }, { fill: '#BFD9CC', family: CHALK }),
            sticker('graph', 72, 590, 190, 110, { color: '#FFE08A', color2: '#F28B82' }),
            sticker('bulb', 640, 616, 70, 96, { color: '#FFE08A', color2: '#F28B82', rotate: 10 }),
        ],
    },
    {
        id: 'arithmetic-sprint', name: 'Arithmetic Sprint', subject: 'aptitude', description: 'Red with a giant percent sign, stopwatch, number tiles and a lecture starburst.',
        bg: '#C8102E', layers: [
            behind('rays', { color: WHITE, opacity: 0.12 }),
            sticker('percent', 1000, 20, 230, 230, { color: WHITE, color2: BLACK, rotate: 8 }),
            { type: 'photo', x: 820, y: 270, w: 440, h: 440, shape: 'circle', ring: { color: WHITE, width: 12 } },
            chip('{exam}', 56, 44, { fill: BLACK, color: YELLOW }),
            sticker('badge', 300, 40, 320, 84, { color: YELLOW, color2: BLACK, text: 'SPEED MATHS', rotate: -3 }),
            title({ x: 56, y: 140, w: 720, h: 290 }, { fill: WHITE, shadow: '#5A0010' }),
            subline({ x: 56, y: 440, w: 720, h: 76 }, { fill: '#FFE5E5' }),
            sticker('burst', 56, 530, 180, 180, { color: BLACK, color2: YELLOW, text: 'LEC {lecture}', rotate: -8 }),
            text('{teacher}', { x: 260, y: 540, w: 300, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: YELLOW }),
            small('{tagline}', { x: 260, y: 594, w: 300, h: 36 }, { fill: '#FFC2C2' }),
            sticker('clock', 580, 530, 180, 190, { color: YELLOW, color2: RED }),
            sticker('tiles', 260, 650, 290, 70, { color: WHITE, color2: YELLOW, text: '3 8 1 6' }),
        ],
    },
    {
        id: 'algebra-board', name: 'Algebra Board', subject: 'maths', description: 'Dark board with chalk formulas, a sticky-note x², light bulb and graph beside a polaroid photo.',
        bg: '#17202A', layers: [
            behind('formulas', { color: '#E5E7EB', color2: '#FDE68A', opacity: 0.14, text: 'x² y=mx+c a²+b² (x+y)² b²−4ac ∑ √ ∞ f(x) ≠ ∫ π α β Δ ≥' }),
            { type: 'photo', x: 60, y: 200, w: 380, h: 480, shape: 'rect', ring: { color: WHITE, width: 12 } },
            sticker('note', 60, 50, 130, 130, { color: '#FDE68A', color2: '#F59E0B', text: 'x²' }),
            sticker('bulb', 1100, 36, 120, 160, { color: '#FDE68A', color2: '#F59E0B', rotate: 8 }),
            chip('{exam}', 480, 48, { fill: '#FDE68A', color: BLACK }),
            sticker('badge', 740, 40, 300, 84, { color: WHITE, color2: BLACK, text: 'FORMULA', rotate: 2 }),
            title({ x: 480, y: 140, w: 600, h: 300 }, { fill: '#FDE68A', shadow: '#000000' }),
            subline({ x: 480, y: 450, w: 740, h: 76 }, { fill: '#E5E7EB' }),
            chip('LEC {lecture}', 480, 540, { fill: '#F59E0B', color: BLACK, size: 28 }),
            text('{teacher}', { x: 720, y: 540, w: 500, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: WHITE }),
            small('{tagline}', { x: 720, y: 594, w: 500, h: 36 }, { fill: '#9CA3AF' }),
            sticker('graph', 480, 606, 200, 110, { color: '#FDE68A', color2: '#34D399' }),
            sticker('sigma', 1120, 630, 70, 90, { color: '#FDE68A', color2: BLACK, rotate: -10 }),
        ],
    },
    {
        id: 'percentile-pop', name: 'Percentile Pop', subject: 'cat', description: 'Purple-to-orange gradient, giant outlined lecture number, 99.9 %ile speech bubble, target and tick.',
        bg: 'gradient:pop', defs: [{ type: 'gradient', id: 'pop', x1: 0, y1: 0, x2: 1, y2: 1, stops: [['0%', '#7B2CBF'], ['100%', '#FF7A00']] }], layers: [
            behind('rays', { color: WHITE, opacity: 0.15 }),
            text('{lecture}', { x: 800, y: 24, w: 440, h: 190 }, { size: 170, min: 90, lines: 1, weight: 900, family: HEAVY, fill: 'none', stroke: WHITE, sw: 5, align: 'end' }),
            { type: 'photo', x: 810, y: 240, w: 460, h: 460, shape: 'circle', ring: { color: WHITE, width: 10 } },
            chip('{exam}', 64, 48, { fill: WHITE, color: '#7B2CBF' }),
            sticker('speech', 330, 30, 300, 120, { color: YELLOW, color2: BLACK, text: '99.9 %ile', rotate: -4 }),
            title({ x: 64, y: 170, w: 700, h: 290 }, { fill: WHITE, shadow: '#3A0C6E' }),
            subline({ x: 64, y: 470, w: 700, h: 76 }, { fill: '#FFE9D6' }),
            text('{teacher}', { x: 64, y: 580, w: 380, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: YELLOW }),
            small('{tagline}', { x: 64, y: 634, w: 380, h: 36 }, { fill: '#FFD9B8' }),
            sticker('target', 470, 560, 150, 150, { color: '#FF7A00', color2: '#7B2CBF', rotate: -6 }),
            sticker('check', 640, 600, 100, 100, { color: '#34D399', color2: WHITE }),
        ],
    },
    {
        id: 'formula-sheet', name: 'Formula Sheet', subject: 'maths', description: 'Ruled paper with sticky-note formulas, pencil, ruler and a marker-highlighted chapter.',
        bg: '#FFFDF7', layers: [
            { type: 'pattern', kind: 'rules', x: 0, y: 120, w: 1280, h: 600, color: '#DCE3EC', opacity: 1 },
            { type: 'line', x1: 110, y1: 0, x2: 110, y2: 720, stroke: '#F28B82', sw: 2 },
            { type: 'rect', x: 892, y: 122, w: 320, h: 400, fill: '#000000', opacity: 0.15 },
            { type: 'photo', x: 880, y: 110, w: 320, h: 400, shape: 'rect', ring: { color: WHITE, width: 14 } },
            sticker('note', 870, 540, 160, 160, { color: '#FFE66D', color2: '#F59E0B', text: 'a²+b²' }),
            sticker('note', 1050, 540, 160, 160, { color: '#FFB3C6', color2: '#E63946', text: '(x+y)²', rotate: 8 }),
            chip('{subject}', 140, 44, { fill: '#2B6CB0', color: WHITE }),
            sticker('badge', 370, 40, 280, 80, { color: '#FFE66D', color2: BLACK, text: '{exam}', rotate: -2 }),
            title({ x: 140, y: 130, w: 700, h: 280 }, { size: 78, fill: '#1F2933', highlight: '#FFE66D' }),
            subline({ x: 140, y: 420, w: 700, h: 76 }, { fill: '#3E4C59', family: SERIF, weight: 400, style: 'italic' }),
            chip('LEC {lecture}', 140, 520, { fill: BLACK, color: WHITE, size: 28 }),
            text('{teacher}', { x: 380, y: 520, w: 460, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#2B6CB0' }),
            small('{tagline}', { x: 380, y: 574, w: 460, h: 36 }, { fill: '#6B7A8C' }),
            sticker('pencil', 140, 610, 300, 66, { color: '#FFD400', color2: '#F28B82', rotate: -4 }),
            sticker('sigma', 480, 620, 70, 90, { color: '#2B6CB0', color2: WHITE, rotate: 6 }),
            sticker('ruler', 580, 640, 260, 48, { color: '#FFE66D', color2: BLACK, rotate: -3 }),
        ],
    },
    {
        id: 'number-theory', name: 'Number Theory', subject: 'aptitude', description: 'Deep blue with primes floating behind, a factor tree, number line and digit tiles.',
        bg: '#061A40', defs: [glow('cyan', '#7DF9FF')], layers: [
            behind('formulas', { color: '#D7FF3F', color2: '#7DF9FF', opacity: 0.12, text: '2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79' }),
            { type: 'circle', cx: 1030, cy: 500, r: 320, fill: 'gradient:cyan' },
            sticker('factortree', 1020, 24, 240, 210, { color: '#D7FF3F', color2: '#7DF9FF' }),
            { type: 'photo', x: 800, y: 250, w: 460, h: 470, shape: 'rect' },
            chip('{exam}', 56, 44, { fill: '#D7FF3F', color: BLACK }),
            sticker('badge', 300, 40, 340, 84, { color: '#7DF9FF', color2: BLACK, text: 'NUMBER SYSTEM', rotate: 2 }),
            title({ x: 56, y: 140, w: 720, h: 290 }, { fill: '#D7FF3F', shadow: '#000000' }),
            subline({ x: 56, y: 440, w: 720, h: 76 }, { fill: '#7DF9FF' }),
            chip('LEC {lecture}', 56, 530, { fill: WHITE, color: '#061A40', size: 28 }),
            text('{teacher}', { x: 300, y: 530, w: 460, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: WHITE }),
            small('{tagline}', { x: 300, y: 584, w: 460, h: 36 }, { fill: '#9FB3D9' }),
            sticker('numberline', 56, 640, 420, 70, { color: '#D7FF3F', color2: '#7DF9FF' }),
            sticker('tiles', 500, 630, 260, 70, { color: '#7DF9FF', color2: '#D7FF3F', text: '2 3 5 7' }),
        ],
    },
    {
        id: 'clean-lecture', name: 'Clean Lecture', subject: 'maths', description: 'Calm white with one blue accent, an outlined lecture number and a ringed photo. Reads well at any size.',
        bg: WHITE, layers: [
            behind('grid', { color: '#2563EB', opacity: 0.05 }),
            { type: 'rect', x: 0, y: 0, w: 24, h: 720, fill: '#2563EB' },
            text('{lecture}', { x: 860, y: 24, w: 380, h: 150 }, { size: 140, min: 80, lines: 1, weight: 900, family: HEAVY, fill: 'none', stroke: '#BFD0FF', sw: 4, align: 'end' }),
            { type: 'photo', x: 860, y: 200, w: 380, h: 380, shape: 'circle', ring: { color: '#2563EB', width: 10 } },
            chip('{subject}', 72, 56, { fill: '#2563EB', color: WHITE }),
            chip('{exam}', 320, 56, { fill: 'none', stroke: '#2563EB', sw: 3, color: '#2563EB' }),
            title({ x: 72, y: 150, w: 740, h: 280 }, { fill: '#0F172A' }),
            subline({ x: 72, y: 440, w: 740, h: 76 }, { fill: '#475569' }),
            text('{teacher}', { x: 72, y: 540, w: 420, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#2563EB' }),
            small('{tagline}', { x: 72, y: 594, w: 420, h: 36 }, { fill: '#64748B' }),
            sticker('check', 520, 540, 80, 80, { color: '#DBEAFE', color2: '#2563EB' }),
            sticker('sigma', 630, 530, 70, 90, { color: '#2563EB', color2: WHITE, rotate: -6 }),
            sticker('scribble', 72, 650, 400, 40, { color: '#93C5FD' }),
        ],
    },
    {
        id: 'one-shot', name: 'One Shot', subject: 'any', description: 'Black with a lime ONE SHOT badge, a FULL CHAPTER stamp and a slanted photo panel.',
        bg: '#0B0B0F', defs: [glow('lime', '#D7FF3F')], layers: [
            behind('rays', { color: '#D7FF3F', opacity: 0.08 }),
            behind('formulas', { color: WHITE, color2: '#D7FF3F', opacity: 0.06 }),
            { type: 'circle', cx: 1040, cy: 460, r: 330, fill: 'gradient:lime' },
            { type: 'photo', x: 780, y: 0, w: 500, h: 720, shape: 'slant', slant: 120 },
            sticker('badge', 56, 40, 330, 96, { color: '#D7FF3F', color2: BLACK, text: 'ONE SHOT', rotate: -3 }),
            chip('{exam}', 420, 62, { fill: WHITE, color: BLACK }),
            title({ x: 56, y: 170, w: 680, h: 270 }, { fill: WHITE, shadow: '#000000' }),
            subline({ x: 56, y: 450, w: 680, h: 70 }, { fill: '#D7FF3F' }),
            sticker('stamp', 56, 540, 250, 115, { color: '#FF3B30', color2: '#FF3B30', text: 'FULL CHAPTER', rotate: -6 }),
            text('{teacher}', { x: 330, y: 548, w: 400, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: WHITE }),
            small('{tagline}', { x: 330, y: 600, w: 400, h: 36 }, { fill: '#A3A3A3' }),
            sticker('bolt', 330, 646, 40, 66, { color: '#D7FF3F', color2: BLACK }),
            chip('LEC {lecture}', 390, 656, { fill: '#D7FF3F', color: BLACK, size: 24 }),
        ],
    },
    {
        id: 'pyq-marathon', name: 'PYQ Marathon', subject: 'cat', description: 'Red and black with a PYQs stamp, trophy, lightning bolt and a year-tile strip.',
        bg: '#B91C1C', layers: [
            behind('halftone', { color: '#7F1D1D', opacity: 0.5 }),
            behind('rays', { color: WHITE, opacity: 0.08 }),
            { type: 'rect', x: 0, y: 560, w: 1280, h: 160, fill: '#111111' },
            { type: 'photo', x: 820, y: 60, w: 440, h: 500, shape: 'rect' },
            sticker('stamp', 56, 36, 260, 120, { color: YELLOW, color2: YELLOW, text: 'PYQs', rotate: -8 }),
            chip('{exam}', 350, 60, { fill: YELLOW, color: BLACK }),
            sticker('trophy', 640, 30, 110, 122, { color: YELLOW, color2: RED, rotate: 6 }),
            title({ x: 56, y: 180, w: 740, h: 260 }, { fill: WHITE, shadow: '#450A0A' }),
            subline({ x: 56, y: 450, w: 740, h: 70 }, { fill: '#FECACA' }),
            text('{teacher}', { x: 56, y: 590, w: 420, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: YELLOW }),
            small('{tagline}', { x: 56, y: 644, w: 420, h: 36 }, { fill: '#D4D4D4' }),
            sticker('burst', 500, 572, 140, 140, { color: YELLOW, color2: BLACK, text: 'LEC {lecture}', rotate: -8 }),
            sticker('bolt', 670, 580, 70, 120, { color: YELLOW, color2: BLACK, rotate: 12 }),
            sticker('tiles', 800, 600, 280, 80, { color: YELLOW, color2: WHITE, text: '2 0 2 5' }),
        ],
    },
    {
        id: 'mock-analysis', name: 'Mock Analysis', subject: 'cat', description: 'Teal gradient with a sectional scoreboard, bar chart and target for mock reviews.',
        bg: 'gradient:mock', defs: [{ type: 'gradient', id: 'mock', x1: 0, y1: 0, x2: 1, y2: 1, stops: [['0%', '#0F766E'], ['100%', '#134E4A']] }, glow('mint', '#5EEAD4')], layers: [
            behind('grid', { color: WHITE, opacity: 0.06 }),
            { type: 'circle', cx: 1040, cy: 470, r: 320, fill: 'gradient:mint' },
            { type: 'photo', x: 800, y: 220, w: 460, h: 500, shape: 'rect' },
            sticker('scoreboard', 1000, 30, 250, 144, { color: '#5EEAD4', color2: '#FCD34D' }),
            chip('{exam}', 56, 44, { fill: '#FCD34D', color: BLACK }),
            sticker('badge', 300, 40, 320, 86, { color: WHITE, color2: '#0F766E', text: 'MOCK ANALYSIS', rotate: -2 }),
            title({ x: 56, y: 150, w: 720, h: 280 }, { fill: WHITE, shadow: '#042F2E' }),
            subline({ x: 56, y: 440, w: 720, h: 76 }, { fill: '#99F6E4' }),
            chip('LEC {lecture}', 56, 530, { fill: WHITE, color: '#0F766E', size: 28 }),
            text('{teacher}', { x: 300, y: 530, w: 460, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#FCD34D' }),
            small('{tagline}', { x: 300, y: 584, w: 460, h: 36 }, { fill: '#CCFBF1' }),
            sticker('barchart', 56, 600, 170, 110, { color: '#5EEAD4', color2: '#FCD34D' }),
            sticker('target', 640, 630, 84, 84, { color: '#FCD34D', color2: '#0F766E' }),
        ],
    },
    {
        id: 'speed-trick', name: '10-Second Trick', subject: 'aptitude', description: 'Electric blue with a 10 SEC burst, stopwatch, lightning bolt and number tiles.',
        bg: '#1D4ED8', defs: [glow('sky', '#93C5FD')], layers: [
            behind('rays', { color: WHITE, opacity: 0.1 }),
            { type: 'circle', cx: 250, cy: 430, r: 320, fill: 'gradient:sky' },
            { type: 'photo', x: 30, y: 160, w: 420, h: 560, shape: 'rect' },
            sticker('clock', 40, 10, 130, 143, { color: YELLOW, color2: RED }),
            sticker('burst', 200, 4, 150, 150, { color: YELLOW, color2: BLACK, text: '10 SEC', rotate: -8 }),
            chip('{exam}', 500, 44, { fill: YELLOW, color: BLACK }),
            sticker('badge', 900, 36, 330, 90, { color: WHITE, color2: '#1D4ED8', text: 'SPEED TRICK', rotate: 3 }),
            title({ x: 500, y: 140, w: 740, h: 280 }, { fill: WHITE, shadow: '#1E3A8A' }),
            subline({ x: 500, y: 430, w: 740, h: 76 }, { fill: '#FDE68A' }),
            chip('LEC {lecture}', 500, 530, { fill: WHITE, color: '#1D4ED8', size: 28 }),
            text('{teacher}', { x: 740, y: 530, w: 400, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: YELLOW }),
            small('{tagline}', { x: 740, y: 584, w: 400, h: 36 }, { fill: '#BFDBFE' }),
            sticker('bolt', 500, 600, 60, 100, { color: YELLOW, color2: BLACK, rotate: 10 }),
            sticker('tiles', 580, 630, 260, 70, { color: YELLOW, color2: WHITE, text: '7 × 8' }),
        ],
    },
    {
        id: 'red-pen', name: 'Paper & Red Pen', subject: 'maths', description: 'Ruled paper with a red 100/100 stamp, pencil and tick. Calm and classroom-real.',
        bg: '#FFFDF7', layers: [
            { type: 'pattern', kind: 'rules', x: 0, y: 140, w: 1280, h: 580, color: '#DCE3EC', opacity: 1 },
            { type: 'line', x1: 96, y1: 0, x2: 96, y2: 720, stroke: '#F28B82', sw: 2 },
            { type: 'photo', x: 860, y: 150, w: 360, h: 430, shape: 'rect', ring: { color: WHITE, width: 14 } },
            sticker('stamp', 880, 16, 300, 116, { color: '#DC2626', color2: '#DC2626', text: '100/100', rotate: -6 }),
            chip('{subject}', 130, 44, { fill: '#DC2626', color: WHITE }),
            chip('{exam}', 370, 44, { fill: 'none', stroke: '#1F2933', sw: 3, color: '#1F2933' }),
            title({ x: 130, y: 140, w: 700, h: 280 }, { size: 80, fill: '#1F2933' }),
            subline({ x: 130, y: 430, w: 700, h: 76 }, { fill: '#DC2626', family: SERIF, weight: 400, style: 'italic' }),
            chip('LEC {lecture}', 130, 524, { fill: BLACK, color: WHITE, size: 28 }),
            text('{teacher}', { x: 370, y: 524, w: 460, h: 44 }, { size: 30, min: 20, lines: 1, weight: 900, family: HEAVY, fill: '#1F2933' }),
            small('{tagline}', { x: 370, y: 578, w: 460, h: 36 }, { fill: '#6B7A8C' }),
            sticker('pencil', 130, 630, 280, 60, { color: '#FFD400', color2: '#F28B82', rotate: -3 }),
            sticker('check', 440, 626, 70, 70, { color: '#FEE2E2', color2: '#DC2626' }),
            sticker('scribble', 540, 650, 280, 34, { color: '#DC2626' }),
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
        if (layer.type === 'sticker') {
            if (!STICKERS[layer.kind]) continue;
            const value = layer.text ? interpolate(layer.text, data) : '';
            if (layer.text && /\{\w+\}/.test(layer.text) && !value) continue;
            nodes.push({ type: 'sticker', kind: layer.kind, x: layer.x, y: layer.y, w: layer.w, h: layer.h, rotate: layer.rotate || 0, opacity: layer.opacity ?? 1, color: layer.color || BLACK, color2: layer.color2 || WHITE, text: value || undefined });
            boxes.push({ kind: 'sticker', box: { x: layer.x, y: layer.y, w: layer.w, h: layer.h }, behind: Boolean(layer.behind), field: layer.kind });
            continue;
        }
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
                boxes.push({ kind: 'text', box: { x: layer.x, y: layer.y, w, h }, field: layer.text });
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
            nodes.push({ type: 'text', lines, ...font, fill: layer.fill, stroke: layer.stroke, sw: layer.sw, outline: layer.outline, outlineWidth: layer.outlineWidth, shadow: layer.shadow, anchor, truncated: fit.truncated });
            boxes.push({ kind: 'text', box: { x: layer.x, y: layer.y, w: layer.w, h: layer.h }, field: layer.text });
            continue;
        }
        nodes.push(layer);
    }
    return { width: THUMB_W, height: THUMB_H, defs: template.defs || [], nodes, boxes };
}
