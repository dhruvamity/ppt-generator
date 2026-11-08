import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLocalText, serializeQuestions, convertFractions, extractDocumentTitle } from '../src/utils/questionParser.js';

test('document title headings become a concise slide title', () => {
    assert.equal(extractDocumentTitle('# Official Sample Paper 2026 — Questionnaire\n\n## Questions'), 'Official Sample Paper 2026');
    assert.equal(extractDocumentTitle('No title heading'), '');
});

test('Markdown question groups keep tables and scope them to section numbering', () => {
    const input = [
        '# Quiz', '## Quantitative',
        '### Questions 1–2: Production', 'Units produced and sold.',
        '| Factory | Produced | Sold |', '|:--|--:|--:|', '| A | 800 | 600 |',
        '### Question 1', 'Which factory?', '- **A.** A', '- **B.** B',
        '### Question 2', 'How many units?', '- **A.** 200', '- **B.** 300',
        '### Question 3', 'Independent question?', '(A.) 1', '(B.) 2',
        '## Logical Reasoning', '### Shared setup for Questions 1–2',
        'Choose two numbers and replace them with their difference.',
        '### Question 1', 'Which remains?', '(A) 0', '(B) 1',
        '### Question 2', 'What never changes?', 'A. Parity', 'B. Sum',
    ].join('\n');
    const questions = parseLocalText(input);
    assert.equal(questions.length, 5);
    assert.ok(questions.every(question => question.options.length === 2));
    assert.match(questions[0].context, /\| A \| 800 \| 600 \|/);
    assert.equal(questions[1].context, questions[0].context);
    assert.equal(questions[2].context, '');
    assert.match(questions[3].context, /difference/);
    assert.equal(questions[4].context, questions[3].context);
    assert.equal(questions[3].badge, 'Q.4');
    assert.equal(questions[3].topic, 'Logical Reasoning');
    assert.ok(!questions[3].context.includes('Factory'));
});

test('math delimiters, subscripts, roots, matrices and multiline choices survive parsing', () => {
    const input = [
        'Q.1: Evaluate \\(x_1 + x_2\\).',
        '$\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$',
        '- A sits immediately to the right of C.',
        '(A.) $\\sqrt{x-1}$',
        '(B.) First line', 'second line',
    ].join('\n');
    const [question] = parseLocalText(input);
    assert.match(question.qText, /x_1 \+ x_2/);
    assert.ok(question.qText.includes('$\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$'));
    assert.ok(question.qText.includes('- A sits immediately to the right of C.'));
    assert.deepEqual(question.options, [
        { label: 'a', text: '$\\sqrt{x-1}$' },
        { label: 'b', text: 'First line\nsecond line' },
    ]);
    assert.equal(convertFractions('$f(x)=\u000crac{\\sqrt{x-1}}{x-3}$'), '$f(x)=\\frac{\\sqrt{x-1}}{x-3}$');
    assert.equal(convertFractions('$\\sqrt{2}$ units$'), '$\\sqrt{2}$ units');
    assert.equal(convertFractions('Student I12 and file_name'), 'Student I12 and file_name');
});

test('editing serialized AI output preserves per-question context and option contents', () => {
    const slides = [
        { qText: 'First?', context: 'Shared passage\n| A | 1 |', options: [{ label: 'A.', text: 'One\ncontinued' }] },
        { qText: 'Second?', context: 'Shared passage\n| A | 1 |', options: [{ label: 'B', text: '$x_1$' }] },
        { qText: 'Independent?', context: '', options: [] },
    ];
    const parsed = parseLocalText(serializeQuestions(slides));
    assert.deepEqual(parsed.map(({ qText, context }) => ({ qText, context })), slides.map(({ qText, context }) => ({ qText, context })));
    assert.equal(parsed[0].options[0].text, 'One\ncontinued');
    assert.equal(parsed[1].options[0].text, '$x_1$');
});
