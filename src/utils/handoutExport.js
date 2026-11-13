import { renderStudyText } from './exportRevealJS.js';
import { escapeHtml } from './escapeHtml.js';
import { answerLabel, normalizeLabel } from './deckSequence.js';
import { isQuestionFigure } from './questionFigure.js';
import { downloadBlob, fileStem } from './download.js';

export function buildHandoutHtml(config, slides, { perPage = 4, includeAnswers = false } = {}, katexCss = '') {
    if (![2, 4, 6].includes(perPage)) throw new Error('Choose 2, 4 or 6 questions per page.');
    const questions = slides.filter(slide => !slide.kind);
    if (!questions.length) throw new Error('Add at least one question for a handout.');
    const title = [config.mainTitle1, config.mainTitle2].filter(Boolean).join(' ') || 'Practice questions';
    const articles = questions.map((slide, index) => {
        const figure = isQuestionFigure(slide.figure) ? `<img src="${slide.figure}" alt="Question figure">` : '';
        const context = slide.context ? renderStudyText(slide.context) : '';
        return `<article><h2>Q.${index + 1}</h2>${figure}${context}${renderStudyText(slide.qText || '')}
            ${slide.options?.length ? `<ul>${slide.options.map(option => `<li><b>(${escapeHtml(normalizeLabel(option.label).toUpperCase())})</b> ${renderStudyText(option.text || '')}</li>`).join('')}</ul>` : ''}
        </article>`;
    });
    const sheets = [];
    for (let index = 0; index < articles.length; index += perPage) {
        sheets.push(`<section class="sheet"><h1>${escapeHtml(title)}</h1><div class="questions">${articles.slice(index, index + perPage).join('')}</div></section>`);
    }
    if (includeAnswers) {
        const entries = questions.map((slide, index) => `<li>Q.${index + 1} ${renderStudyText(answerLabel(slide) || '—')}</li>`);
        for (let index = 0; index < entries.length; index += 30) {
            sheets.push(`<section class="sheet"><h1>Answer key</h1><ol class="answers">${entries.slice(index, index + 30).join('')}</ol></section>`);
        }
    }
    return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
    <style>${katexCss}
    @page { size:A4 portrait; margin:13mm }
    *{box-sizing:border-box}
    body{font:11pt/1.35 Arial,sans-serif;color:#141a25;margin:20px auto;max-width:190mm;padding:0 8px}
    h1{font-size:18pt;margin:0 0 8pt} h2{font-size:11pt;margin:0 0 4pt;color:#14528c}
    .questions{display:grid;grid-template-columns:${perPage === 2 ? '1fr' : 'repeat(2,minmax(0,1fr))'};align-items:start;gap:8pt}
    article{padding:7pt;border:1px solid #aeb6c2;break-inside:avoid;min-width:0;overflow-wrap:anywhere}
    article img{max-width:100%;max-height:90pt;object-fit:contain}
    ul,.answers{list-style:none;padding:0;margin:5pt 0 0}
    li div{display:inline}
    .answers{columns:3}.answers li{break-inside:avoid;margin-bottom:6pt}
    table{font-size:9pt!important} button{padding:8px 14px;margin:0 0 16px}
    .sheet + .sheet{margin-top:24pt}
    @media print{body{padding:0;margin:0;max-width:none}button{display:none}.sheet+.sheet{break-before:page;margin:0}}
    @media screen and (max-width:620px){.questions{grid-template-columns:1fr}}
    </style><body><button type="button" onclick="window.print()">Print or save as PDF</button>${sheets.join('')}</body></html>`;
}

export function downloadHandout(config, slides, options, katexCss, printWindow) {
    const html = buildHandoutHtml(config, slides, options, katexCss);
    if (printWindow) {
        const content = printWindow.document;
        content.open();
        content.write(html);
        content.close();
        Promise.allSettled([content.fonts.ready, ...Array.from(content.images, image => image.decode())]).then(() => {
            if (!printWindow.closed) printWindow.print();
        });
        return;
    }
    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }),
        fileStem([config.mainTitle1, config.mainTitle2].filter(Boolean).join(' ')) + (options.includeAnswers ? '_teacher_handout.html' : '_student_handout.html'));
}
