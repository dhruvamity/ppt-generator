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

export function deckSequence(config, slides) {
    const options = { ...PRESENTATION_DEFAULTS, ...config };
    const list = Array.isArray(slides) ? slides : [];
    const sequence = [{ kind: 'title' }];
    let part = 0;
    list.forEach((slide, index) => {
        const topic = String(slide?.topic ?? '').trim();
        if (options.sectionSlides && topic && topic !== String(list[index - 1]?.topic ?? '').trim()) {
            let count = 1;
            while (String(list[index + count]?.topic ?? '').trim() === topic) count++;
            part++;
            sequence.push({ kind: 'section', index, config: sectionConfig(config, topic, part, count, index + 1) });
        }
        sequence.push({ kind: 'question', slide, index });
        if (options.insertBlankSlides) sequence.push({ kind: 'workspace', slide, index });
        if (options.solutionSlides && String(slide?.solution ?? '').trim()) sequence.push({ kind: 'solution', slide, index });
    });
    if (options.answerKeySlide && list.some(hasAnswer)) {
        sequence.push({ kind: 'key', entries: list.map((slide, index) => ({ badge: slide?.badge || `Q.${index + 1}`, answer: answerLabel(slide) || '—' })) });
    }
    return sequence;
}

// The question-shaped data each slide kind renders with, so every design family can draw it.
export function slideData(entry) {
    if (entry.kind === 'workspace') return { ...entry.slide, qText: '', context: '', options: [], isWorkspace: true };
    if (entry.kind === 'solution') return { ...entry.slide, kind: 'solution', badge: solutionBadge(entry.slide, entry.index), context: '', options: [], answerText: answerLabel(entry.slide) };
    if (entry.kind === 'key') return { kind: 'key', badge: 'KEY', entries: entry.entries, qText: '', context: '', options: [] };
    return entry.slide;
}
