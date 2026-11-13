import { isQuestionFigure } from './questionFigure.js';

// Keep parsing independent of the store so imports and edited AI output use the
// same lossless rules. A shared passage belongs to every dependent question.
const mathParts = /(\$\$[\s\S]*?\$\$|(?<!\\)\$[\s\S]*?(?<!\\)\$)/;
const outsideMath = (text, fn) => text.split(mathParts).map(part => (
    part.startsWith('$') ? part : fn(part)
)).join('');

export const normalizeMathText = (text) => {
    if (!text) return text;
    return String(text)
        .replaceAll(String.fromCharCode(12) + 'rac', '\\frac')
        .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => '$' + math + '$')
        .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => '$' + math + '$');
};

export const extractDocumentTitle = (rawText) => {
    const heading = String(rawText || '').match(/^\s*#\s+(.+?)\s*$/m);
    if (!heading) return '';
    return heading[1].split(/\s+[–—]\s+/)[0].trim();
};

export const convertFractions = (text) => {
    if (!text) return text;
    let normalized = normalizeMathText(text);
    const dollars = [...normalized.matchAll(/(?<!\\)\$/g)];
    if (dollars.length >= 3 && dollars.length % 2 && !normalized.slice(dollars.at(-1).index + 1).trim()) {
        normalized = normalized.slice(0, dollars.at(-1).index) + normalized.slice(dollars.at(-1).index + 1);
    }
    return outsideMath(normalized, (part) => part
        .replace(/\b([a-zA-Z0-9])\/√(\d+)/g, '$\\frac{$1}{\\sqrt{$2}}$')
        .replace(/\b(\d+)\/(\d+)\b/g, '$\\frac{$1}{$2}$')
        .replace(/√(\d+)/g, '$\\sqrt{$1}$')
        .replace(/\b([a-zA-Z0-9]+)\^(-?\d+|\([^)]+\)|\{[^}]+\})/g, (_, base, exp) => (
            '$' + base + '^{' + exp.replace(/^[({]|[)}]$/g, '') + '}$'
        ))
    );
};

const stripEmphasis = (text) => outsideMath(text, part => part
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
);
const questionStart = /^(?:(?:Question|Q)\.?\s*(\d+)|Case\s*(\d+)|Exp\.\s*(\d+))\s*(?:[:.)-]\s*)?(.*)$/i;
const optionStart = /^(?:[-*+]\s+)?(?:\(([A-Fa-f1-6])\.?\)|([A-Fa-f1-6])[.)])\s*(.*)$/;
const labelFor = label => /^\d$/.test(label) ? String.fromCharCode(96 + Number(label)) : label.toLowerCase();
const answerStart = /^(?:Correct\s+)?(?:Answer|Ans)\s*(?:key)?\s*[:.\-–]\s*(.*)$/i;
const notesStart = /^Speaker notes:\s*(.*)$/i;
const figureStart = /^Figure:\s*(data:image\/[^\s]+)$/i;
const teachingStart = /^(Concept|Formula sheet):\s*(.*)$/i;
const solutionStart = /^(?:Solution|Sol|Explanation|Working)\s*[:.\-–]\s*(.*)$/i;
// "(b)", "B.", "b) 105:77", "(2)" and a lone "2" name an option; anything else is a free-form answer.
const parseAnswer = (value, options) => {
    const trimmed = value.trim();
    const letter = trimmed.match(/^(?:\(([A-Fa-f])\)|([A-Fa-f])[.)](?=\s|$)|([A-Fa-f])$)/);
    if (letter && options.length) return (letter[1] || letter[2] || letter[3]).toLowerCase();
    const digit = trimmed.match(/^(?:\(([1-6])\)|([1-6])\)|([1-6])$)/);
    if (digit && options.length) {
        const number = digit[1] || digit[2] || digit[3];
        return options.every(option => /^[a-f]$/.test(option.label)) ? labelFor(number) : number;
    }
    return convertFractions(trimmed);
};

export const parseLocalText = (rawText) => {
    if (!rawText?.trim()) return [];
    const questions = [];
    let current = null;
    let section = '';
    let questionCount = 0;
    let rangeContext = null;
    let singleContext = null;
    let collectingContext = null;

    const flush = () => {
        if (!current) return;
        if (current.kind) {
            questions.push({
                kind: current.kind, title: current.title,
                qText: convertFractions(current.lines.join('\n').trim()),
                formula: convertFractions(current.formula || ''),
                notes: current.notes.join('\n').trim(),
                ...(current.section ? { section: current.section } : {}),
            });
            current = null;
            return;
        }
        questions.push({
            badge: 'Q.' + (++questionCount),
            tag: current.options.length ? 'MCQ' : 'PRACTICE',
            topic: current.section || 'Practice Question',
            ...(current.section ? { section: current.section } : {}),
            qText: convertFractions(current.lines.join('\n').trim()),
            context: convertFractions(current.context.join('\n').trim()),
            options: current.options.map(option => ({
                label: option.label,
                text: convertFractions(option.lines.join('\n').trim()),
            })),
            ...(current.figure ? { figure: current.figure } : {}),
            ...(current.notes.join('').trim() ? { notes: current.notes.join('\n').trim() } : {}),
            ...(current.answer ? { answer: parseAnswer(current.answer, current.options) } : {}),
            ...(current.solution.join('').trim() ? { solution: convertFractions(current.solution.join('\n').trim()) } : {}),
        });
        current = null;
    };

    // Convert math delimiters before splitting lines, including display matrices.
    for (const original of normalizeMathText(rawText).replace(/\r\n?/g, '\n').split('\n')) {
        const line = stripEmphasis(original.trim()).replace(/^#{1,6}\s+/, '');
        const heading = original.trim().match(/^(#{1,6})\s+/);
        const sharedRange = line.match(/^(?:(?:Shared\s+(?:setup|context)|Directions)\s+for\s+)?Questions\s+(\d+)\s*[–—-]\s*(\d+)\s*:?(.*)$/i);
        if (sharedRange) {
            flush();
            rangeContext = { start: Number(sharedRange[1]), end: Number(sharedRange[2]), lines: [] };
            if (sharedRange[3].trim()) rangeContext.lines.push(sharedRange[3].trim());
            singleContext = null;
            collectingContext = rangeContext;
            continue;
        }
        const sharedSingle = line.match(/^Shared context:\s*(.*)$/i);
        if (sharedSingle) {
            flush();
            singleContext = { lines: sharedSingle[1] ? [sharedSingle[1]] : [] };
            collectingContext = singleContext;
            continue;
        }
        const teaching = line.match(teachingStart);
        if (teaching) {
            flush();
            current = { kind: teaching[1].toLowerCase() === 'concept' ? 'concept' : 'formula', title: teaching[2], section, lines: [], notes: [] };
            singleContext = null;
            collectingContext = null;
            continue;
        }
        const question = line.match(questionStart);
        if (question) {
            flush();
            const sourceNumber = Number(question[1] || question[2] || question[3]);
            const applicableRange = rangeContext && sourceNumber >= rangeContext.start && sourceNumber <= rangeContext.end;
            current = {
                section,
                lines: question[4] ? [question[4]] : [],
                context: [...(singleContext?.lines || (applicableRange ? rangeContext.lines : []))],
                options: [],
                answer: '',
                notes: [],
                solution: [],
                inSolution: false,
            };
            singleContext = null;
            collectingContext = null;
            continue;
        }
        // Section headings reset source numbering and passage scope. Do not
        // mistake numbered statements within a question for a section heading.
        if ((heading && heading[1].length <= 2) || /^\d+\.\s+(?:Worked Examples|.*Theory Questions)$/i.test(line)) {
            flush();
            if (heading?.[1].length !== 1) section = line.replace(/^\d+\.\s*/, '');
            else section = '';
            rangeContext = null;
            singleContext = null;
            collectingContext = null;
            continue;
        }
        if (collectingContext) {
            collectingContext.lines.push(line);
            continue;
        }
        if (!current) continue;
        const notes = line.match(notesStart);
        if (notes) {
            current.inNotes = true;
            current.notes.push(notes[1]);
            continue;
        }
        const figure = line.match(figureStart);
        if (figure && !current.kind) {
            if (isQuestionFigure(figure[1])) current.figure = figure[1];
            continue;
        }
        if (current.inNotes) {
            current.notes.push(line);
            continue;
        }
        if (current.kind) {
            const formula = line.match(/^Formula:\s*(.*)$/i);
            if (formula) current.formula = formula[1];
            else current.lines.push(line);
            continue;
        }
        const answer = line.match(answerStart);
        if (answer) {
            current.answer = answer[1];
            current.inSolution = false;
            continue;
        }
        const solution = line.match(solutionStart);
        if (solution) {
            current.inSolution = true;
            if (solution[1].trim()) current.solution.push(solution[1]);
            continue;
        }
        if (current.inSolution) {
            current.solution.push(line);
            continue;
        }
        const option = line.match(optionStart);
        if (option) {
            current.options.push({ label: labelFor(option[1] || option[2]), lines: [option[3]] });
        } else if (current.options.length) {
            current.options[current.options.length - 1].lines.push(line);
        } else {
            current.lines.push(line);
        }
    }
    flush();
    return questions;
};

export const serializeQuestions = questions => {
    let questionNumber = 0;
    return questions.map((question, index) => {
        const section = question.section?.trim() || '';
        const previous = questions[index - 1]?.section?.trim() || '';
        // An empty section after reordering needs an explicit boundary too.
        let text = section !== previous ? '## ' + (section || 'Practice Questions') + '\n\n' : '';
        if (question.kind === 'concept' || question.kind === 'formula') {
            text += (question.kind === 'concept' ? 'Concept: ' : 'Formula sheet: ') + (question.title || '');
            if (question.qText) text += '\n' + question.qText;
            if (question.formula) text += '\nFormula: ' + question.formula;
            if (question.notes?.trim()) text += '\nSpeaker notes: ' + question.notes.trim();
            return text;
        }
        if (question.context?.trim()) text += 'Shared context: ' + question.context.trim() + '\n';
        text += 'Q.' + (++questionNumber) + ': ' + (question.qText || '');
        if (question.options?.length) {
            text += '\n' + question.options.map((option, optionIndex) => '(' + String(option.label || String.fromCharCode(97 + optionIndex)).replace(/[().]/g, '') + ') ' + (option.text || '')).join('\n');
        }
        const answer = String(question.answer ?? '').trim();
        if (answer) text += '\nAnswer: ' + (/^[a-f1-6]$/i.test(answer) && question.options?.length ? '(' + answer + ')' : answer);
        if (question.solution?.trim()) text += '\nSolution: ' + question.solution.trim();
        if (isQuestionFigure(question.figure)) text += '\nFigure: ' + question.figure;
        if (question.notes?.trim()) text += '\nSpeaker notes: ' + question.notes.trim();
        return text;
    }).join('\n\n');
};
