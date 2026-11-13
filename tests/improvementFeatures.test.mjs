import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRevealHtml } from '../src/utils/exportRevealJS.js';
import { buildHandoutHtml } from '../src/utils/handoutExport.js';
import { parseLocalText, serializeQuestions } from '../src/utils/questionParser.js';
import { deckSequence, slideData } from '../src/utils/deckSequence.js';
import { passagePages } from '../src/utils/passagePages.js';
import { THEMES, themeGroup } from '../src/utils/themeConfig.js';
import { hasSignatureLayout } from '../src/utils/teachingDesign.js';
import { watermarkStyle } from '../src/utils/watermark.js';
import { layoutThumbnail, THUMBNAIL_TEMPLATES, DEFAULT_THUMBNAIL } from '../src/utils/thumbnailDesign.js';
import { isQuestionFigure } from '../src/utils/questionFigure.js';

const config = { mainTitle1: 'Maths', mainTitle2: 'Workshop', answerKeySlide: true };
const figure = 'data:image/png;base64,aW1hZ2U=';
const q = { badge: 'Q.1', qText: 'Find the area.', options: [{ label: 'a', text: '7' }], answer: 'a' };

test('mixed lessons, figures and multiline notes round trip without shifting question numbering', () => {
    const raw = '## Geometry\nConcept: Triangle area\n- Base and height\nFormula: $A=bh/2$\nSpeaker notes: Ask the class.\nWait 10 seconds.\n\n'
        + 'Q.4: Find the area.\n(A) 7\nAnswer: (a)\nFigure: ' + figure + '\nSpeaker notes: Sketch first.\n\nFormula sheet:\nFormula: $P=a+b+c$\n\nQ.5: Find the perimeter.';
    const slides = parseLocalText(raw);
    assert.deepEqual(slides.map(item => item.kind || item.badge), ['concept', 'Q.1', 'formula', 'Q.2']);
    assert.deepEqual(parseLocalText(serializeQuestions(slides)), slides);
    const sequence = deckSequence({ ...config, sectionSlides: true, insertBlankSlides: true }, slides);
    assert.deepEqual(sequence.map(item => item.kind), ['title','concept','section','question','workspace','formula','question','workspace','key']);
    assert.equal(sequence.find(item => item.kind === 'section').config.pill1, '2 QUESTIONS');
    assert.equal(sequence.at(-1).entries.length, 2);
    assert.equal(slides[0].notes, 'Ask the class.\nWait 10 seconds.');
    assert.equal(slides[1].figure, figure);
});

test('passages split before dependent questions and preserve every table row and mathematical expression', () => {
    const rows = Array.from({ length: 150 }, (_, i) => '| Factory ' + i + ' | ' + (i + 2500) + ' |');
    const context = 'Given $x + 2$ items, compare.\n| Site | Units |\n| --- | --- |\n' + rows.join('\n');
    const pages = passagePages(context);
    assert.ok(pages.length > 1);
    assert.ok(pages[0].includes('Given $x + 2$ items'));
    assert.ok(pages.filter(page => page.includes('Factory')).every(page => page.includes('| Site | Units |')));
    assert.deepEqual(pages.flatMap(page => page.split('\n').filter(line => line.startsWith('| Factory'))), rows);
    const sequence = deckSequence(config, [{ ...q, context }, { ...q, badge: 'Q.2', context }]);
    assert.equal(sequence.filter(item => item.kind === 'passage').length, pages.length);
    assert.ok(sequence.filter(item => item.kind === 'question').every(item => !slideData(item).context && slideData(item).contextReference.includes('Q.1')));
});

test('presentation embeds only safe figures and escapes notes; learner handout excludes answers and notes', () => {
    const question = { ...q, figure, answer: 'private answer', notes: 'Notes <script>private</script>' };
    const html = buildRevealHtml(config, [question, { ...q, figure: 'https://example.com/remote.png' }], THEMES['orbit-lab'], 'modern-sidebar', { notesJs: '/* local notes */' });
    assert.match(html, /<aside class="notes"[^>]*>Notes &lt;script&gt;private&lt;\/script&gt;<\/aside>/);
    assert.match(html, /local notes/);
    assert.ok(html.includes(figure));
    assert.ok(!html.includes('remote.png'));
    assert.equal(isQuestionFigure('data:image/svg+xml;base64,aW1hZ2U='), false);
    for (const perPage of [2, 4, 6]) {
        const slides = Array.from({ length: 11 }, () => question);
        const student = buildHandoutHtml(config, slides, { perPage });
        const teacher = buildHandoutHtml(config, slides, { perPage, includeAnswers: true });
        assert.equal([...student.matchAll(/class="sheet"/g)].length, Math.ceil(slides.length / perPage));
        assert.ok(!student.includes('private answer'));
        assert.ok(teacher.includes('private answer'));
        assert.ok(!teacher.includes('Notes'));
    }
});

test('Classic composition, watermark and grouping depend on explicit flags', () => {
    const original = THEMES['modern-neon'];
    const renamed = { ...original, name: 'Custom display name' };
    assert.equal(themeGroup(renamed), 'bold');
    assert.ok(hasSignatureLayout(renamed));
    assert.deepEqual(watermarkStyle(renamed), watermarkStyle(original));
    assert.equal(buildRevealHtml(config, [q], renamed), buildRevealHtml(config, [q], original));
    assert.equal(hasSignatureLayout({ name: original.name }), false);
});

test('thumbnail recoloring preserves contrast and emphasis consumes the asterisks', () => {
    const template = THUMBNAIL_TEMPLATES.find(item => item.id === 'clean-lecture');
    const layout = layoutThumbnail(template, { ...DEFAULT_THUMBNAIL, chapter: 'Learn *Triangles*', font: 'inter', accent: '#F1E9C5' });
    assert.ok(layout.nodes.some(node => node.fill === '#F1E9C5'));
    const chapter = layout.nodes.find(node => node.family?.includes('Inter'));
    assert.ok(chapter.lines.every(line => !line.text.includes('*')));
    const emphasized = chapter.lines.find(line => line.emphasis);
    assert.equal(emphasized.text.slice(emphasized.emphasis.start, emphasized.emphasis.start + emphasized.emphasis.length), 'Triangles');
});
