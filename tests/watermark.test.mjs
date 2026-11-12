import assert from 'node:assert/strict';
import test from 'node:test';
import { THEMES } from '../src/utils/themeConfig.js';
import { watermarkStyle, watermarkRect } from '../src/utils/watermark.js';
import { signatureSlide } from '../src/utils/signatureDesigns.js';
import { teachingStyles } from '../src/utils/teachingDesign.js';
import { buildRevealHtml } from '../src/utils/exportRevealJS.js';

const W = 1280, H = 720;
const num = value => Number(String(value).replace('px', ''));
const rect = style => {
    const left = num(style.left), top = num(style.top);
    return { left, top, right: style.right !== undefined ? W - num(style.right) : left + num(style.width), bottom: style.bottom !== undefined ? H - num(style.bottom) : top + num(style.height) };
};
const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const layouts = ['modern-sidebar', 'classic-header', 'split-focus'];
const config = { mainTitle1: 'Quadratic', mainTitle2: 'Equations', pill1: 'PRACTICE', pill2: 'CLASS 10', footer: 'Think. Solve. Discuss.', watermark: 'Dhruv Sir · Quant Academy <b>', insertBlankSlides: true };
const question = { badge: 'Q.1', qText: 'Solve $x^2 = 9$.', options: [{ label: 'A', text: '$3$' }, { label: 'B', text: '$\\pm 3$' }] };

test('every design has a watermark spot inside the slide and clear of the header and body', () => {
    for (const [id, theme] of Object.entries(THEMES)) for (const layout of layouts) {
        const style = watermarkStyle(theme, layout);
        const mark = watermarkRect(style);
        assert.ok(mark.left >= 0 && mark.top >= 0 && mark.right <= W && mark.bottom <= H, `${id} watermark stays on the slide`);
        assert.ok(mark.right - mark.left >= 200, `${id} leaves room for a name`);
        assert.doesNotMatch(JSON.stringify(style), /undefined|NaN|#\$/);
        if (theme.design) {
            for (const [title, workspace] of [[true, false], [false, false], [false, true]]) {
                const slide = signatureSlide(theme, title, workspace);
                const regions = title ? [rect(slide.body)] : [rect(slide.body), rect(slide.header)];
                for (const region of regions) assert.ok(!overlaps(mark, region), `${id} watermark ${JSON.stringify(mark)} clears ${JSON.stringify(region)}`);
                for (const item of slide.decorations) if (!item.behind) assert.ok(!overlaps(mark, rect(item.style)), `${id} watermark clears decoration ${JSON.stringify(rect(item.style))}`);
            }
        } else if (theme.teaching) {
            for (const [title, workspace] of [[true, false], [false, false], [false, true]]) {
                const styles = teachingStyles(theme, layout, title, workspace);
                for (const region of [rect(styles.body), ...(title ? [] : [rect(styles.header)])]) assert.ok(!overlaps(mark, region), `${id} (${layout}) watermark clears ${JSON.stringify(region)}`);
            }
        } else {
            // Original designs pad their body 60px (signature) or 40px (flexible) from the bottom edge.
            const bodyBottom = ['Cyberpunk Neon', 'Blueprint Architect', 'Aurora Glassmorphism'].includes(theme.name) ? 660 : theme.name === 'Neo-Brutalism' ? 648 : 680;
            assert.ok(mark.top >= bodyBottom, `${id} watermark sits below the body (${mark.top} >= ${bodyBottom})`);
        }
    }
});

test('the watermark is exported once per slide, escaped, and omitted when blank', () => {
    for (const [id, theme] of Object.entries(THEMES)) {
        const html = buildRevealHtml(config, [question], theme, 'classic-header');
        const slides = html.split('class="slide-container"').slice(1);
        assert.equal(slides.length, 3, id);
        for (const slide of slides) {
            assert.equal((slide.match(/Dhruv Sir · Quant Academy &lt;b&gt;/g) || []).length, 1, `${id} watermark once per slide`);
            assert.match(slide, /z-index:20;[^"]*white-space:nowrap;overflow:hidden;text-overflow:ellipsis/);
        }
        assert.doesNotMatch(buildRevealHtml({ ...config, watermark: '   ' }, [question], theme), /z-index:20;font-family:Arial/);
    }
});
