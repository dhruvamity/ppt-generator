import { passagePages } from './passagePages.js';

// One ordered list of slides drives both the live preview and the export, so the editor shows
// exactly what the teacher will present (title, sections, questions, workspaces, solutions, key).
export const PRESENTATION_DEFAULTS = {
    insertBlankSlides: false,
    solutionSlides: true,
    revealAnswers: true,
    answerKeySlide: false,
    sectionSlides: false,
    slideNumbers: false,
    timerSeconds: 0,
};

export const TIMER_CHOICES = [0, 30, 60, 90, 120, 180, 300];

export const normalizeLabel = label => String(label ?? '').replace(/[().\s]/g, '').toLowerCase();

const letterFor = label => /^\d$/.test(label) ? String.fromCharCode(96 + Number(label)) : label;

// Index of the correct option, or -1. Accepts "b", "(B)", "2" (second option) and option text.
export function answerIndex(slide) {
    const answer = normalizeLabel(slide?.answer);
    const options = Array.isArray(slide?.options) ? slide.options : [];
    if (!answer || !options.length) return -1;
    const labels = options.map(option => normalizeLabel(option.label));
    let index = labels.indexOf(answer);
    if (index < 0 && /^\d$/.test(answer) && labels.every(label => /^[a-z]$/.test(label))) index = labels.indexOf(letterFor(answer));
    if (index < 0) index = options.findIndex(option => normalizeLabel(option.text) === answer);
    return index;
}

export const hasAnswer = slide => Boolean(String(slide?.answer ?? '').trim());

// Short form for the answer key and the solution slide, e.g. "(B)" or "42".
export function answerLabel(slide) {
    const index = answerIndex(slide);
    if (index >= 0) return `(${normalizeLabel(slide.options[index].label).toUpperCase() || String.fromCharCode(65 + index)})`;
    return String(slide?.answer ?? '').trim();
}

export const solutionBadge = (slide, index) => (slide?.badge || `Q.${index + 1}`).replace(/^Q\.?\s*/i, 'SOL.');

export function sectionConfig(config, topic, part, count, first) {
    return {
        ...config,
        mainTitle1: `Part ${part}`,
        mainTitle2: topic,
        pill1: `${count} ${count === 1 ? 'QUESTION' : 'QUESTIONS'}`,
        pill2: count > 1 ? `Q.${first}–Q.${first + count - 1}` : `Q.${first}`,
    };
}

const ANSWERS_PER_PAGE = 24;

export function deckSequence(config, slides) {
    const options = { ...PRESENTATION_DEFAULTS, ...config };
    const list = Array.isArray(slides) ? slides : [];
    const sequence = [{ kind: 'title' }];
    let part = 0;
    let questionNumber = 0;
    let previousTopic = '';
    let previousContext;
    let precedingPassage;
    list.forEach((slide, index) => {
        const topic = String(slide?.section ?? '').trim();
        if (slide.kind === 'concept' || slide.kind === 'formula') {
            sequence.push({ kind: slide.kind, slide, index });
            return;
        }
        questionNumber++;
        if (options.sectionSlides && topic && topic !== previousTopic) {
            let count = 1;
            for (const next of list.slice(index + 1)) {
                if (next.kind) continue;
                if (String(next.section ?? '').trim() !== topic) break;
                count++;
            }
            part++;
            sequence.push({ kind: 'section', index, config: sectionConfig(config, topic, part, count, questionNumber) });
        }
        previousTopic = topic;
        if (slide.context !== previousContext) {
            const pages = passagePages(slide.context);
            precedingPassage = pages.length ? slide.badge || `Q.${questionNumber}` : null;
            pages.forEach((context, page) => sequence.push({ kind: 'passage', slide, index, page, context }));
        }
        previousContext = slide.context;
        sequence.push({ kind: 'question', slide, index, ...(precedingPassage ? { contextReference: `Use the passage for ${precedingPassage}.` } : {}) });
        if (options.insertBlankSlides) sequence.push({ kind: 'workspace', slide, index });
        if (options.solutionSlides && String(slide?.solution ?? '').trim()) sequence.push({ kind: 'solution', slide, index });
    });
    const questions = list.filter(slide => !slide.kind);
    if (options.answerKeySlide && questions.some(hasAnswer)) {
        const entries = questions.map((slide, index) => ({
            badge: slide?.badge || `Q.${index + 1}`,
            answer: answerLabel(slide) || '—',
        }));
        for (let start = 0; start < entries.length; start += ANSWERS_PER_PAGE) {
            sequence.push({ kind: 'key', entries: entries.slice(start, start + ANSWERS_PER_PAGE) });
        }
    }
    return sequence;
}

// The question-shaped data each slide kind renders with, so every design family can draw it.
export function slideData(entry) {
    if (entry.kind === 'passage') return {
        kind: 'passage', badge: 'TEXT', title: 'Passage for ' + entry.slide.badge + ' · ' + (entry.page + 1),
        qText: entry.context, options: [],
    };
    if (entry.kind === 'concept' || entry.kind === 'formula') return {
        ...entry.slide, badge: entry.kind === 'concept' ? 'IDEA' : 'FORM',
    };
    if (entry.contextReference) return { ...entry.slide, context: '', contextReference: entry.contextReference };
    if (entry.kind === 'workspace') return { ...entry.slide, qText: '', context: '', options: [], isWorkspace: true };
    if (entry.kind === 'solution') return { ...entry.slide, kind: 'solution', badge: solutionBadge(entry.slide, entry.index), context: '', options: [], answerText: answerLabel(entry.slide) };
    if (entry.kind === 'key') return { kind: 'key', badge: 'KEY', entries: entry.entries, qText: '', context: '', options: [] };
    return entry.slide;
}
