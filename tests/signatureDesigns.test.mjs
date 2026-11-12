import assert from 'node:assert/strict';
import test from 'node:test';
import { signatureSlide, SIGNATURE_DESIGN_IDS } from '../src/utils/signatureDesigns.js';
import { previewStyle } from '../src/utils/teachingDesign.js';
import { buildRevealHtml } from '../src/utils/exportRevealJS.js';
import { THEMES } from '../src/utils/themeConfig.js';

const W = 1280, H = 720;
const num = value => Number(String(value).replace('px', ''));
const rect = style => {
    const left = num(style.left), top = num(style.top);
    const right = style.right !== undefined ? W - num(style.right) : left + num(style.width);
    const bottom = style.bottom !== undefined ? H - num(style.bottom) : top + num(style.height);
    return { left, top, right, bottom };
};
const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const designs = Object.entries(THEMES).filter(([, theme]) => theme.design);
const config = { mainTitle1: 'Quadratic', mainTitle2: 'Equations', pill1: 'PRACTICE', pill2: 'CLASS 10', footer: 'Think. Solve. Discuss.', insertBlankSlides: true };
const question = { badge: 'Q.1', qText: String.raw`Evaluate $\frac{1}{2} + \sqrt{4}$ <script>`, context: '| x | y |\n| --- | --- |\n| 1 | 2 |', options: [{ label: 'A', text: '$2$' }, { label: 'B', text: '$\\pm 3$' }] };

test('at least ten composed designs exist and every design id resolves to a theme', () => {
    assert.ok(designs.length >= 10, `${designs.length} composed designs`);
    assert.deepEqual(new Set(designs.map(([, theme]) => theme.design)), new Set(SIGNATURE_DESIGN_IDS));
});

test('no decoration intersects the header or body on any slide type', () => {
    for (const [id, theme] of designs) for (const [title, workspace] of [[true, false], [false, false], [false, true]]) {
        const slide = signatureSlide(theme, title, workspace);
        const body = rect(slide.body);
        assert.ok(body.right - body.left >= 760 && body.bottom - body.top >= 380, `${id} keeps a generous body (${body.right - body.left} × ${body.bottom - body.top})`);
        assert.ok(body.left >= 0 && body.top >= 0 && body.right <= W && body.bottom <= H, `${id} body stays on the slide`);
        const text = title ? [body] : [body, rect(slide.header)];
        if (!title) assert.ok(!overlaps(body, rect(slide.header)), `${id} header and body are separate`);
        for (const item of slide.decorations) {
            if (item.behind) continue;
            const box = rect(item.style);
            for (const region of text) assert.ok(!overlaps(box, region), `${id} ${title ? 'title' : workspace ? 'workspace' : 'question'}: decoration at ${JSON.stringify(box)} clears ${JSON.stringify(region)}`);
        }
    }
});

test('composed styles survive the preview unit conversion and carry no broken values', () => {
    for (const [id, theme] of designs) {
        const slide = signatureSlide(theme, false, false);
        for (const style of [slide.header, slide.badge, slide.body, ...slide.decorations.map(item => item.style)]) {
            const converted = previewStyle(style);
            for (const [key, value] of Object.entries(converted)) {
                assert.doesNotMatch(String(value), /undefined|NaN|#\$|px/, `${id} ${key}`);
                if (typeof style[key] === 'string' && /\d+px/.test(style[key])) assert.match(String(value), /cqw/, `${id} ${key} converted`);
            }
        }
    }
});

test('composed designs export title, question and workspace slides with maths and tables intact', () => {
    for (const [id, theme] of designs) {
        const html = buildRevealHtml(config, [question], theme);
        assert.equal((html.match(/class="slide-container"/g) || []).length, 3, id);
        assert.match(html, /class="mfrac"/);
        assert.match(html, /<table/);
        assert.match(html, /&lt;script&gt;/);
        assert.doesNotMatch(html.split('<!-- Floating PDF Export Button -->')[0], /undefined|NaN|\[object/);
        const [, titleSlide, questionSlide, workspace] = html.split('class="slide-container"');
        assert.match(titleSlide, /Quadratic[\s\S]*Equations[\s\S]*PRACTICE \/ CLASS 10/);
        assert.match(questionSlide, /Q\.1/);
        assert.match(workspace, /WORK SPACE/);
        assert.doesNotMatch(workspace, /Evaluate|<table/);
    }
});
