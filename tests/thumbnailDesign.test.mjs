import assert from 'node:assert/strict';
import test from 'node:test';
import { THUMBNAIL_TEMPLATES, DEFAULT_THUMBNAIL, THUMBNAIL_FIELDS, layoutThumbnail, fitText, wrapText, estimateTextWidth, THUMB_W, THUMB_H } from '../src/utils/thumbnailDesign.js';

const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const samples = [
    DEFAULT_THUMBNAIL,
    { ...DEFAULT_THUMBNAIL, chapter: 'Permutations, Combinations and the Fundamental Principle of Counting', sub: 'Circular arrangements, restricted seating, selections with repetition allowed and more', lecture: '128', subject: 'CAT Quant', tagline: 'CAT 2026 · Arithmetic + Algebra marathon', teacher: 'Professor Dhruvarajeshnarayanan' },
    { ...DEFAULT_THUMBNAIL, chapter: 'Antidisestablishmentarianism', sub: '', lecture: '', subject: 'Aptitude', tagline: '', teacher: '' },
];

test('every template lays out without text or stickers overlapping the photo slot, and nothing leaves the canvas', () => {
    assert.ok(THUMBNAIL_TEMPLATES.length >= 10);
    assert.equal(new Set(THUMBNAIL_TEMPLATES.map(item => item.id)).size, THUMBNAIL_TEMPLATES.length);
    for (const template of THUMBNAIL_TEMPLATES) for (const data of samples) {
        const layout = layoutThumbnail(template, data);
        const photos = layout.boxes.filter(item => item.kind === 'photo');
        assert.equal(photos.length, 1, `${template.id} has one photo slot`);
        const texts = layout.boxes.filter(item => item.kind === 'text');
        const stickers = layout.boxes.filter(item => item.kind === 'sticker' && !item.behind);
        assert.ok(texts.length >= 2, `${template.id} shows the main fields`);
        assert.ok(stickers.length >= 3 || data === samples[2], `${template.id} carries illustrations`);
        const solid = [...texts, ...stickers];
        for (const item of solid) {
            assert.ok(!overlaps(item.box, photos[0].box), `${template.id}: ${item.field || 'chip'} box ${JSON.stringify(item.box)} clears the photo ${JSON.stringify(photos[0].box)}`);
            assert.ok(item.box.x >= 0 && item.box.y >= 0 && item.box.x + item.box.w <= THUMB_W && item.box.y + item.box.h <= THUMB_H, `${template.id}: ${item.field || 'chip'} stays on the canvas`);
        }
        for (let i = 0; i < solid.length; i++) for (let j = i + 1; j < solid.length; j++) assert.ok(!overlaps(solid[i].box, solid[j].box), `${template.id}: ${solid[i].field} ${JSON.stringify(solid[i].box)} and ${solid[j].field} ${JSON.stringify(solid[j].box)} do not overlap`);
        for (const node of layout.nodes) assert.doesNotMatch(JSON.stringify(node), /undefined|NaN|\{\w+\}/, `${template.id} resolves every field`);
    }
});

test('text shrinks and wraps to stay inside its box, truncating only as a last resort', () => {
    const layer = { x: 0, y: 0, w: 600, h: 270, size: 84, min: 44, lines: 3, weight: 900, family: "'Arial Black', sans-serif" };
    const short = fitText(layer, 'Quadratic Equations', estimateTextWidth);
    assert.equal(short.lines.length, 2);
    assert.equal(short.truncated, false);
    const long = fitText(layer, samples[1].chapter, estimateTextWidth);
    assert.ok(long.size < 84 && long.size >= 44);
    assert.ok(long.lines.length <= 3);
    for (const line of long.lines) assert.ok(estimateTextWidth(line, { size: long.size, weight: 900, family: layer.family }) <= 600, `"${line}" fits the box width`);
    const absurd = fitText(layer, 'word '.repeat(80), estimateTextWidth);
    assert.equal(absurd.truncated, true);
    assert.equal(absurd.lines.length, 3);
    assert.match(absurd.lines[2], /…$/);
    assert.deepEqual(wrapText('Supercalifragilistic', 100, line => line.length * 20), ['Super', 'calif', 'ragil', 'istic']);
});

test('empty fields disappear and photo framing responds to zoom, pan and fit', () => {
    const template = THUMBNAIL_TEMPLATES[0];
    const sparse = layoutThumbnail(template, samples[2]);
    assert.ok(!sparse.boxes.some(item => item.field === '{sub}' || item.field === '{teacher}'));
    const photo = layoutThumbnail(template, { ...DEFAULT_THUMBNAIL, photoHref: 'data:image/png;base64,AAAA', photo: { zoom: 2, x: 0.5, y: -0.5, fit: 'contain' } }).nodes.find(node => node.type === 'photo');
    assert.equal(photo.href, 'data:image/png;base64,AAAA');
    assert.equal(photo.image.w, photo.slot.w * 2);
    assert.equal(photo.image.preserve, 'xMidYMax meet');
    assert.ok(photo.image.x > photo.slot.x - photo.slot.w / 2 && photo.image.y < photo.slot.y);
    assert.equal(layoutThumbnail(template, DEFAULT_THUMBNAIL).nodes.find(node => node.type === 'photo').href, null);
    assert.deepEqual(THUMBNAIL_FIELDS.map(field => field.key), ['chapter', 'sub', 'lecture', 'subject', 'exam', 'tagline', 'teacher']);
});
