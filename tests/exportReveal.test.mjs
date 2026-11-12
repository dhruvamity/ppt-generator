import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRevealHtml } from '../src/utils/exportRevealJS.js';
import { THEMES } from '../src/utils/themeConfig.js';

const deckConfig = (insertBlankSlides) => ({
    mainTitle1: 'Practice',
    mainTitle2: 'Questions',
    pill1: 'Math',
    pill2: '2026',
    footer: 'Practice set',
    insertBlankSlides,
});

const sampleSlides = [
    { badge: 'Q.1', qText: 'First question?', options: [{ label: 'A', text: 'One' }] },
    { badge: 'Q.2', qText: 'Second question?', options: [{ label: 'A', text: 'Two' }] },
];

test('blank solution slides are added only when the setting is enabled', () => {
    const withoutWorkspaces = buildRevealHtml(deckConfig(false), sampleSlides, THEMES['dark-neon']);
    const withWorkspaces = buildRevealHtml(deckConfig(true), sampleSlides, THEMES['dark-neon']);

    assert.equal((withoutWorkspaces.match(/class="slide-container"/g) || []).length, 3);
    assert.equal((withoutWorkspaces.match(/data-workspace="true"/g) || []).length, 0);
    assert.equal((withWorkspaces.match(/class="slide-container"/g) || []).length, 5);
    assert.equal((withWorkspaces.match(/data-workspace="true"/g) || []).length, 2);
    assert.equal((withWorkspaces.match(/>WORK SPACE</g) || []).length, 2);
});

test('PDF and browser print exports retain enabled workspace slides', () => {
    const html = buildRevealHtml(deckConfig(true), sampleSlides, THEMES['dark-neon']);

    assert.match(html, /const slides = \[\.\.\.document\.querySelectorAll\('\.slides \.slide-container'\)\];/);
    assert.match(html, /document\.querySelectorAll\('\.slides \.slide-container'\)\.forEach\(slide => \{\s*pages\.appendChild\(slide\.cloneNode\(true\)\);/);
    assert.doesNotMatch(html, /dataset\.workspace !== 'true'/);
});

test('workspace slides have a writing area in the default layout', () => {
    const html = buildRevealHtml(deckConfig(true), sampleSlides, THEMES['dark-neon'], 'modern-sidebar');

    assert.match(html, /background: repeating-linear-gradient\(to bottom/);
    assert.match(html, /WORK SPACE/);
});

test('exports omit question type and topic labels from every slide corner', () => {
    const labeledSlides = sampleSlides.map(slide => ({ ...slide, tag: 'MCQ', topic: 'Set Theory' }));
    const layouts = ['modern-sidebar', 'classic-header', 'split-focus'];

    for (const theme of Object.values(THEMES)) {
        for (const layout of layouts) {
            const html = buildRevealHtml(deckConfig(false), labeledSlides, theme, layout);
            assert.ok(!html.includes('MCQ'), `${theme.name} / ${layout} still exports a question type`);
            assert.ok(!html.includes('Set Theory'), `${theme.name} / ${layout} still exports a topic`);
        }
    }
});

test('question number and divider share a header row, with content moved up', () => {
    for (const layout of ['modern-sidebar', 'classic-header', 'split-focus']) {
        const html = buildRevealHtml(deckConfig(false), sampleSlides, THEMES['dark-neon'], layout);

        assert.match(html, /left: 51\.2px; top: 25\.6px; right: 25\.6px; height: 32px; display: flex; align-items: center;/);
        assert.match(html, /padding: 64px 40px 40px 80px/);
        assert.doesNotMatch(html, /top: 89\.6px; width: 1100\.8px; height: 2\.56px/);
    }
});

test('teaching designs retain maths, shared tables, and blank workspaces in every layout', () => {
    const question = { badge: 'Q.1', tag: 'MCQ', topic: 'Algebra', qText: String.raw`Evaluate $\frac{1}{2} + \sqrt{4}$ <script>`, context: '| x | y |\n| --- | --- |\n| 1 | 2 |', options: [{ label: 'A', text: '$2$' }] };
    const teaching = Object.values(THEMES).filter(theme => theme.teaching && !theme.design);
    assert.equal(teaching.length, 20);
    for (const theme of teaching) for (const layout of ['modern-sidebar', 'classic-header', 'split-focus']) {
        const html = buildRevealHtml(deckConfig(true), [question], theme, layout);
        assert.equal((html.match(/class="slide-container"/g) || []).length, 3);
        assert.equal((html.match(/data-workspace="true"/g) || []).length, 1);
        assert.match(html, /\\frac\{1\}\{2\}/);
        assert.match(html, /\\sqrt\{4\}/);
        assert.match(html, /<table/);
        assert.match(html, /&lt;script&gt;/);
        assert.doesNotMatch(html, /MCQ|Algebra|SLIDEGEN|Dhruv|#undefined/);
        const workspace = html.split('data-workspace="true"')[1].split('</section>')[0];
        assert.match(workspace, /WORK SPACE/);
        assert.doesNotMatch(workspace, /Evaluate|<table/);
    }
});

test('margin illustrations never sit behind the title, question or options', () => {
    const illustrated = Object.values(THEMES).filter(theme => theme.illustration);
    assert.equal(illustrated.length, 16);
    const question = { badge: 'Q.1', qText: 'Solve $x^2 = 9$.', options: [{ label: 'A', text: '$3$' }, { label: 'B', text: '$\\pm 3$' }] };
    for (const theme of illustrated) for (const layout of ['modern-sidebar', 'classic-header', 'split-focus']) {
        const slides = buildRevealHtml(deckConfig(true), [question], theme, layout).split('class="slide-container"').slice(1);
        assert.equal(slides.length, 3);
        for (const slide of slides) {
            const art = slide.match(/position:absolute;top:0px;right:0px;bottom:0px;width:(\d+)px;opacity:[\d.]+;pointer-events:none;background-image:url\('data:image\/svg\+xml,([^'"]+)'\)/);
            assert.ok(art, `${theme.name} (${layout}) draws its margin artwork`);
            const svg = decodeURIComponent(art[2]);
            assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="160" height="720" viewBox="0 0 160 720">/);
            assert.doesNotMatch(svg, /undefined|NaN|#\$/);
            // Every absolutely positioned text region (header and body) must stop before the strip starts.
            const regions = [...slide.matchAll(/position:absolute;left:\d+px;right:(\d+)px;top:\d+px;(?:bottom:\d+px;)?(?:display:flex|color:#)/g)];
            assert.ok(regions.length >= 1, `${theme.name} (${layout}) positions its text regions`);
            for (const region of regions) assert.ok(Number(region[1]) > Number(art[1]), `${theme.name} (${layout}) keeps text ${region[1]}px clear of a ${art[1]}px strip`);
        }
    }
});
