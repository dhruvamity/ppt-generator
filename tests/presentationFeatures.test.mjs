import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLocalText, serializeQuestions } from '../src/utils/questionParser.js';
import { deckSequence, answerIndex, answerLabel, PRESENTATION_DEFAULTS } from '../src/utils/deckSequence.js';
import { buildRevealHtml } from '../src/utils/exportRevealJS.js';
import { THEMES } from '../src/utils/themeConfig.js';

const SOURCE = [
    '## Number System',
    'Q.1: The ratio of two numbers is 15:11 and their HCF is 13. Find the numbers.',
    '(a) 15, 11', '(b) 75, 55', '(c) 195, 143',
    'Ans: (c)',
    'Solution: Let the numbers be $15x$ and $11x$, so $x = 13$.',
    'Hence 195 and 143.',
    'Q.2: What is the LCM of 4 and 6?',
    'Answer: 12',
    '## Arithmetic',
    'Q.3: Pick the second option.', '1) one', '2) two',
    'Answer: 2',
    'Q.4: Pick the decimal.', '(a) 3.5', '(b) 4', 'Answer: 3.5',
].join('\n');

test('answers and multi-line solutions are parsed, normalised and survive a round trip', () => {
    const questions = parseLocalText(SOURCE);
    assert.equal(questions.length, 4);
    assert.deepEqual(questions.map(q => q.answer), ['c', '12', 'b', '3.5']);
    assert.equal(questions[0].solution, 'Let the numbers be $15x$ and $11x$, so $x = 13$.\nHence 195 and 143.');
    assert.equal(questions[0].options.length, 3, 'solution lines are not mistaken for options');
    assert.deepEqual(questions.map(answerIndex), [2, -1, 1, 0]);
    assert.deepEqual(questions.map(answerLabel), ['(C)', '12', '(B)', '(A)']);
    const again = parseLocalText(serializeQuestions(questions));
    assert.deepEqual(again.map(({ answer, solution }) => ({ answer, solution })), questions.map(({ answer, solution }) => ({ answer, solution })));
    assert.ok(!('answer' in parseLocalText('Q.1: No answer here\n(a) 1')[0]), 'questions without answers carry no empty fields');
});

test('the deck sequence orders title, sections, questions, work space, solutions and key', () => {
    const questions = parseLocalText(SOURCE);
    assert.deepEqual(deckSequence({}, questions).map(e => e.kind), ['title', 'question', 'solution', 'question', 'question', 'question']);
    const full = deckSequence({ insertBlankSlides: true, sectionSlides: true, answerKeySlide: true }, questions);
    assert.deepEqual(full.map(e => e.kind), ['title', 'section', 'question', 'workspace', 'solution', 'question', 'workspace', 'section', 'question', 'workspace', 'question', 'workspace', 'key']);
    assert.equal(full[1].config.mainTitle2, 'Number System');
    assert.equal(full[1].config.pill2, 'Q.1–Q.2');
    assert.deepEqual(full.at(-1).entries.map(e => e.answer), ['(C)', '12', '(B)', '(A)']);
    assert.deepEqual(deckSequence({ solutionSlides: false }, questions).map(e => e.kind), ['title', 'question', 'question', 'question', 'question']);
    assert.equal(PRESENTATION_DEFAULTS.answerKeySlide, false);
});

test('exports reveal answers on click, add solution and key slides, and keep presenter tools off the slides', () => {
    const questions = parseLocalText(SOURCE);
    const config = { mainTitle1: 'HCF', mainTitle2: 'LCM', pill1: 'Maths', pill2: '2026', footer: 'Practice', answerKeySlide: true, timerSeconds: 90, slideNumbers: true };
    for (const theme of [THEMES['dark-neon'], THEMES['lecture-paper'], THEMES['cat-mock'], THEMES['modern-neon']]) {
        const html = buildRevealHtml(config, questions, theme, 'classic-header');
        const slides = html.split('class="slide-container"').slice(1);
        assert.equal(slides.length, 7, theme.name);
        assert.equal((html.match(/class="fragment custom answer-opt"/g) || []).length, 3, `${theme.name}: one revealable option per answered MCQ`);
        assert.match(html, /class="fragment fade-up answer-line"[^>]*>Answer: 12/);
        assert.equal((html.match(/data-kind="question" data-timer="90"/g) || []).length, 4);
        assert.match(html, /data-kind="solution"[\s\S]*SOL\.1[\s\S]*Answer: \(C\)[\s\S]*Hence 195 and 143/);
        assert.match(html, /data-kind="key"[\s\S]*Q\.1[\s\S]*\(C\)/);
        assert.match(html, /slideNumber: 'c\/t'/);
        const deck = html.split('<!-- Floating PDF Export Button -->')[0];
        assert.doesNotMatch(deck, /presenter-bar/, 'toolbar is outside the slides');
        assert.match(html, /id="presenter-bar"[\s\S]*data-tool="pen"[\s\S]*data-action="timer"/);
        assert.match(html, /function installPresenterTools|installPresenterTools/);
        assert.match(html, /pages\.querySelectorAll\('\.answer-opt, \.answer-line'\)\.forEach\(item => item\.classList\.remove\('visible'\)\)/, 'printed handouts hide answers');
    }
    const quiet = buildRevealHtml({ ...config, revealAnswers: false, timerSeconds: 0, slideNumbers: false }, questions, THEMES['lecture-paper']);
    assert.doesNotMatch(quiet, /answer-opt"|answer-line"|data-timer=/);
    assert.match(quiet, /slideNumber: false/);
});

test('section headings survive editing and inferred topics cannot create dividers', () => {
    const questions = parseLocalText(SOURCE);
    const restored = parseLocalText(serializeQuestions(questions));
    assert.deepEqual(restored.map(q => q.section), ['Number System', 'Number System', 'Arithmetic', 'Arithmetic']);
    const withTopics = restored.map((q, index) => ({ ...q, topic: 'Generated topic ' + index }));
    assert.equal(deckSequence({ sectionSlides: true }, withTopics).filter(entry => entry.kind === 'section').length, 2);
    assert.equal(deckSequence({ sectionSlides: true }, [{ topic: 'Generated topic' }]).length, 2);
});

test('long answer keys are paginated in order and retain unanswered questions', () => {
    const questions = Array.from({ length: 49 }, (_, index) => ({ badge: `Q.${index + 1}`, answer: index === 1 ? '' : String(index) }));
    const pages = deckSequence({ answerKeySlide: true }, questions).filter(entry => entry.kind === 'key');
    assert.deepEqual(pages.map(page => page.entries.length), [24, 24, 1]);
    assert.equal(pages[0].entries[1].answer, '—');
    assert.equal(pages[1].entries[0].badge, 'Q.25');
    assert.equal(pages[2].entries[0].badge, 'Q.49');
});

test('a free-text answer beginning with an article is preserved', () => {
    const [question] = parseLocalText('Q.1: Describe the shape.\nAnswer: A right triangle');
    assert.equal(question.answer, 'A right triangle');
});
