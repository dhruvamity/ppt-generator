import { teachingStyles, teachingIllustrationStyle, inlineStyle } from './teachingDesign.js';
import { signatureSlide } from './signatureDesigns.js';
import { watermarkStyle } from './watermark.js';
import { installSlidePdfExport } from './slidePdfRuntime.js';
import { installPresenterTools } from './presenterRuntime.js';
import { fitSlideBox } from './fitSlideBox.js';
import { deckSequence, slideData, answerIndex, answerLabel, PRESENTATION_DEFAULTS } from './deckSequence.js';
import katex from 'katex';
import { isQuestionFigure } from './questionFigure.js';

import { escapeHtml } from './escapeHtml.js';
import { classicSlideMarkup } from './classicSlides.js';

const enforceDisplayMath = (text) => {
    if (!text) return "";
    const parts = String(text).replaceAll(String.fromCharCode(12) + 'rac', '\\frac').split('$');
    return parts.map((part, index) => {
        if (part === '') return '';
        if (index % 2 !== 0) return renderTex(part);
        return escapeHtml(part);
    }).join('');
};

// Render $…$ with the same KaTeX settings as the live preview, so the file matches what the
// teacher saw. Fractions are forced to display style, as the preview does for readability.
const renderTex = (tex) => katex.renderToString(tex.includes('\\displaystyle') ? tex : `\\displaystyle ${tex}`, { displayMode: false, throwOnError: false, strict: false, trust: false, output: 'html' });

const CDN = {
    resetCss: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/reset.min.css">',
    revealCss: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/reveal.min.css">',
    katexCss: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.22/katex.min.css">',
    notesJs: '<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/plugin/notes/notes.min.js"></script>',
    revealJs: '<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/reveal.min.js"></script>',
};

const fs = (pt) => (pt * 1.77664) + 'px';

export const renderStudyText = (text) => {
    const lines = text.split('\n');
    const cells = line => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(value => value.trim());
    const cellText = value => enforceDisplayMath(value.replace(/\\\|/g, '|'));
    let html = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('|') && lines[i + 1]?.includes('|') && cells(lines[i + 1]).every(value => /^:?-{2,}:?$/.test(value))) {
            html += '<table style="width:100%;border-collapse:collapse;font-size:inherit;margin:16px 0"><thead><tr>';
            html += cells(lines[i]).map(value => '<th style="padding:0.35em 0.45em;border-bottom:2px solid currentColor;text-align:left">' + cellText(value) + '</th>').join('');
            html += '</tr></thead><tbody>';
            i += 2;
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                html += '<tr>' + cells(lines[i]).map(value => {
                    const numeric = /^[−-]?\d[\d.,]*%?$/.test(value);
                    return `<td style="padding:0.35em 0.45em;border-bottom:1px solid currentColor;${numeric ? 'white-space:nowrap;overflow-wrap:normal' : ''}">${cellText(value)}</td>`;
                }).join('') + '</tr>';
                i++;
            }
            i--;
            html += '</tbody></table>';
        } else {
            html += '<div style="white-space:pre-wrap">' + (enforceDisplayMath(lines[i]) || '<br>') + '</div>';
        }
    }
    return html;
};

export const buildRevealHtml = (config, activeSlides, theme, layoutId = 'modern-sidebar', assets = {}, { embedded = false } = {}) => {
    const style = key => assets[key] ? `<style>${assets[key]}</style>` : CDN[key];
    const presentation = { ...PRESENTATION_DEFAULTS, ...config };
    const timerSeconds = Math.max(0, Math.min(3600, Number(presentation.timerSeconds) || 0));
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${escapeHtml(config.mainTitle1)} ${escapeHtml(config.mainTitle2)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${style('resetCss')}
    ${style('revealCss')}
    ${style('katexCss')}
    
    <style>
        html, body, .reveal { background-color: #${theme.bgColor} !important; margin: 0; padding: 0; width: 100%; height: 100%; }
        .reveal { font-family: 'Segoe UI', Arial, sans-serif; color: #${theme.textWhite}; }
        .reveal .slides section {
            text-align: left;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box;
            position: relative;
        }
        .katex { font-size: 1.1em; }
        
        .slide-container {
            position: relative;
            width: 1280px;
            height: 720px;
            background-color: #${theme.bgColor};
            overflow: hidden;
            box-sizing: border-box;
        }

        #print-slides { display: none; }
        .answer-opt { border-radius: 10px; transition: background-color .25s ease, box-shadow .25s ease; }
        .answer-opt.visible { background-color: rgba(22, 163, 74, 0.16); box-shadow: 0 0 0 3px #16A34A; }
        .answer-opt.visible::after { content: '✓'; margin-left: auto; padding: 0 12px; color: #16A34A; font-weight: 900; }
        @media print {
            @page { size: 960pt 540pt; margin: 0; }
            html, body { margin: 0 !important; padding: 0 !important; width: 1280px !important; height: auto !important; overflow: visible !important; }
            body > * { display: none !important; }
            #print-slides { display: block !important; }
            #print-slides .slide-container { display: block; margin: 0; break-inside: avoid; break-after: page; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            #print-slides .slide-container:last-child { break-after: auto; }
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
`;

    const renderOptionsGrid = (options, color, hasContext = false, answerIdx = -1) => {
        const optionsArray = Array.isArray(options) ? options : [];
        if (optionsArray.length === 0) return '';
        
        const totalChars = optionsArray.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
        const cols = theme.teaching && hasContext && totalChars > 160 ? 1 : !hasContext && totalChars < 60 && optionsArray.length === 4 ? 4 : 2;

        let optsHtml = `<div style="margin-top: ${theme.teaching ? '30.72px' : '2em'}; display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); width: 100%; gap: ${theme.teaching ? '15.36px' : '20px'};">`;
        optionsArray.forEach((opt, i) => {
            // The correct option lights up as a Reveal fragment: question first, answer on the next click.
            const reveal = i === answerIdx && presentation.revealAnswers ? ' class="fragment custom answer-opt"' : '';
            const label = escapeHtml(String(opt.label).replace(/[().]/g, '').toUpperCase());
            optsHtml += `
                <div${reveal} data-poll-choice="${label}" style="min-width: 0; display: flex; gap: 8px; margin-bottom: 0.25rem; color: #${color}; font-size: ${theme.teaching ? '28px' : fs(11)}; line-height: 1.5;">
                    <strong style="white-space: nowrap;">(${label})</strong> <span style="min-width: 0;">${enforceDisplayMath(opt.text)}</span>
                </div>
            `;
        });
        optsHtml += '</div>';
        return optsHtml;
    };

    const textSize = theme.teaching ? '32px' : fs(11);
    const renderSolution = (slide, color, textColor) => {
        const answer = slide.answerText ?? answerLabel(slide);
        return `${answer ? `<div style="color: #${color}; font-size: ${textSize}; font-weight: bold; margin-bottom: 16px;">Answer: ${enforceDisplayMath(answer)}</div>` : ''}
            <div style="color: #${textColor}; font-size: ${theme.teaching ? '28px' : fs(10)}; line-height: 1.5;">${renderStudyText(String(slide.solution || ''))}</div>`;
    };
    const renderAnswerKey = (entries, color, textColor) => `<div style="display: grid; grid-template-columns: repeat(${entries.length > 12 ? 4 : entries.length > 6 ? 3 : 2}, minmax(0, 1fr)); gap: 12px 32px; font-size: ${theme.teaching ? '28px' : fs(11)}; color: #${textColor};">${entries.map(entry => `<div style="display: flex; gap: 12px; align-items: baseline; border-bottom: 1px dashed currentColor; padding-bottom: 6px;"><strong style="color: #${color}; white-space: nowrap;">${escapeHtml(entry.badge)}</strong><span>${enforceDisplayMath(entry.answer)}</span></div>`).join('')}</div>`;

    const renderQuestionContent = (slide, color, textColor = theme.textWhite, bold = false) => {
        // Long questions, passages and solutions scale down at present time instead of being clipped.
        const fit = html => `<div class="q-fit" style="width: 100%; height: 100%; min-height: 0; flex: 0 0 auto; overflow-wrap: anywhere;">${html}</div>`;
        if (slide.kind === 'solution') return fit(renderSolution(slide, color, textColor));
        if (slide.kind === 'key') return fit(renderAnswerKey(slide.entries || [], color, textColor));
        if (['concept', 'formula', 'passage'].includes(slide.kind)) return fit(`
            <div style="color:#${textColor};font-size:${textSize};line-height:1.45">
                <div style="color:#${color};font-weight:bold;margin-bottom:12px">${escapeHtml(slide.title)}</div>
                ${renderStudyText(slide.qText || '')}
                ${slide.formula ? `<div style="border-left:4px solid #${color};padding:10px 16px;margin-top:18px;white-space:pre-wrap">${enforceDisplayMath(slide.formula)}</div>` : ''}
            </div>`);
        const answerIdx = answerIndex(slide);
        const freeAnswer = answerIdx < 0 && presentation.revealAnswers && String(slide.answer ?? '').trim()
            ? `<div class="fragment fade-up answer-line" style="margin-top: 28px; color: #${color}; font-size: ${textSize}; font-weight: bold;">Answer: ${enforceDisplayMath(String(slide.answer).trim())}</div>` : '';
        const question = `
            ${slide.contextReference ? `<p style="color:#${color};font-size:${textSize};margin-bottom:12px">${escapeHtml(slide.contextReference)}</p>` : ''}
            <div style="color: #${textColor}; font-size: ${textSize}; font-weight: ${bold ? 'bold' : 'normal'}; line-height: 1.5; white-space: pre-wrap;">${enforceDisplayMath(slide.qText)}</div>
            ${renderOptionsGrid(slide.options, color, Boolean(slide.context || slide.figure), answerIdx)}${freeAnswer}
        `;
        const context = slide.context?.trim();
        const figure = isQuestionFigure(slide.figure) ? `<img src="${slide.figure}" alt="Figure for ${escapeHtml(slide.badge)}" style="width:100%;max-height:${context ? 256 : 460}px;object-fit:contain;display:block">` : '';
        if (!context && !figure) return fit(question);

        return fit(`
            <div style="display: grid; grid-template-columns: ${theme.teaching ? 'minmax(0, 0.48fr) minmax(0, 0.52fr)' : 'minmax(0, 1fr) minmax(0, 1fr)'}; width: 100%; min-height: 100%; gap: 32px; align-items: stretch;">
                <div style="min-width: 0; box-sizing: border-box; padding-right: ${theme.teaching ? '24px' : '28px'}; border-right: 1px solid #${theme.cyan || theme.pinkOrb || theme.black}; color: #${textColor}; font-size: ${theme.teaching ? '24px' : fs(10)}; line-height: 1.45;">${figure}${context ? renderStudyText(context) : ''}</div>
                <div style="min-width: 0;">
                    ${question}
                </div>
            </div>
        `);
    };

    const generateSlideHtml = (isTitle, slide, layoutType, config) => {
        if (theme.design) {
            const workspace = Boolean(slide?.isWorkspace);
            const composed = signatureSlide(theme, isTitle, workspace);
            const s = key => inlineStyle(composed[key]);
            return `<section><div class="slide-container" data-workspace="${workspace}" style="font-family:${composed.font}">
                ${composed.decorations.map(item => `<div style="${inlineStyle(item.style)}">${escapeHtml(item.text || '')}</div>`).join('')}
                ${!isTitle ? `<div style="${s('header')}"><span style="${s('badge')}">${workspace ? 'WORK SPACE' : escapeHtml(slide?.badge)}</span>${composed.rule ? `<div style="${s('rule')}"></div>` : ''}</div>` : ''}
                <div style="${s('body')}">${isTitle
                    ? `<div style="${s('title')}">${escapeHtml(config?.mainTitle1)}<br><span style="color:#${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span></div><div style="${s('subtitle')}">${[config?.pill1, config?.pill2].filter(Boolean).map(escapeHtml).join(' / ')}</div><div style="${s('footer')}">${escapeHtml(config?.footer)}</div>`
                    : workspace ? `<div style="${s('workspace')}"></div>` : renderQuestionContent(slide, theme.cyan)}</div></div></section>`;
        }

        if (theme.teaching) {
            const workspace = Boolean(slide?.isWorkspace);
            const styles = Object.fromEntries(Object.entries(teachingStyles(theme, layoutType, isTitle, workspace)).map(([key, style]) => [key, inlineStyle(style)]));
            const illustration = theme.illustration ? inlineStyle(teachingIllustrationStyle(theme)) : '';
            return `<section><div class="slide-container" data-workspace="${workspace}" style="font-family:Arial,sans-serif"><div style="${styles.accent}"></div>${illustration ? `<div style="${illustration}"></div>` : ''}
                ${!isTitle ? `<div style="${styles.header}"><span>${workspace ? 'WORK SPACE' : escapeHtml(slide?.badge)}</span><div style="${styles.rule}"></div></div>` : ''}
                ${layoutType === 'split-focus' && !isTitle && !workspace ? `<div style="${styles.rail}"></div>` : ''}
                <div style="${styles.body}">${isTitle
                    ? `<div style="${styles.title}">${escapeHtml(config?.mainTitle1)}<br><span style="color:#${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span></div><div style="${styles.subtitle}">${[config?.pill1, config?.pill2].filter(Boolean).map(escapeHtml).join(' / ')}</div><div style="${styles.footer}">${escapeHtml(config?.footer)}</div>`
                    : workspace ? `<div style="${styles.workspace}"></div>` : renderQuestionContent(slide, theme.cyan)}</div></div></section>`;
        }

        return `<section><div class="slide-container" data-workspace="${Boolean(slide?.isWorkspace)}">
            ${classicSlideMarkup({ theme, isTitle, slide, layoutType, config, renderQuestionContent })}
        </div></section>`;
    };

    // Wrap all slides in a single section for vertical (up-down) navigation
    const watermarkText = String(config?.watermark ?? '').trim();
    const withWatermark = html => watermarkText ? html.replace(/(<div class="slide-container"[^>]*>)/, opening => `${opening}<div style="${inlineStyle(watermarkStyle(theme, layoutId))}">${escapeHtml(watermarkText)}</div>`) : html;
    // The presenter runtime reads the slide kind (timer runs on questions only).
    const tagSlide = (html, kind) => html.replace('<div class="slide-container"', `<div class="slide-container" data-kind="${kind}"${kind === 'question' && timerSeconds ? ` data-timer="${timerSeconds}"` : ''}`);

    htmlContent += `<section>\n`;

    // Title, optional section dividers, questions and their workspace / solution pages, optional key.
    const sequence = deckSequence(config, activeSlides);
    const hasNotes = sequence.some(entry => ['question', 'concept', 'formula'].includes(entry.kind) && entry.slide?.notes?.trim());
    for (const entry of sequence) {
        const isTitle = entry.kind === 'title' || entry.kind === 'section';
        const slideHtml = generateSlideHtml(isTitle, isTitle ? null : slideData(entry), layoutId, entry.kind === 'section' ? entry.config : config);
        const notes = ['question', 'concept', 'formula'].includes(entry.kind) ? entry.slide?.notes?.trim() : '';
        const html = notes ? slideHtml.replace(/<\/section>$/, () => `<aside class="notes" style="white-space:pre-wrap">${escapeHtml(notes)}</aside></section>`) : slideHtml;
        htmlContent += withWatermark(tagSlide(html, entry.kind));
    }

    // Keep ink attached to this particular deck, even when two decks have the same title.
    let deckHash = 2166136261;
    for (const char of htmlContent) deckHash = Math.imul(deckHash ^ char.codePointAt(0), 16777619);
    const inkStorageKey = 'deckful.ink.' + (deckHash >>> 0).toString(36) + '.' + htmlContent.length;

    // Close the vertical stack
    htmlContent += `</section>\n`;

    htmlContent += `
        </div>
    </div>

    <!-- Floating PDF Export Button -->
    <button type="button" id="pdf-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #${theme.cyan || theme.blueOrb || theme.acidGreen || '2563EB'}; color: black; padding: 10px 20px; border-radius: 8px; font-family: sans-serif; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); opacity: 0.8; transition: opacity 0.2s;">
        Save as PDF
    </button>

    <p id="slide-overflow-warning" role="alert" hidden style="position:fixed;top:0;left:0;right:0;z-index:10000;background:#fff5d6;color:#352500;padding:12px;text-align:center"></p>

    <!-- Presenter tools: never part of a slide, so print and PDF output stay clean -->
    <style>
        #presenter-bar { position: fixed; left: 16px; bottom: 16px; z-index: 9999; display: flex; gap: 2px; padding: 5px; border-radius: 12px; background: rgba(15, 23, 42, 0.82); box-shadow: 0 6px 18px rgba(0,0,0,0.35); opacity: 0.35; transition: opacity .2s; font-family: 'Segoe UI', Arial, sans-serif; }
        #presenter-bar.is-idle:not(:focus-within):not(:hover) { opacity: 0; pointer-events: none; }
        #presenter-bar:hover, #presenter-bar:focus-within, #presenter-bar:has([data-tool][aria-pressed="true"]) { opacity: 1; }
        #presenter-bar button { width: 34px; height: 34px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: #E2E8F0; cursor: pointer; padding: 0; }
        #presenter-bar button:disabled { opacity:.35; cursor:default; }
        #presenter-bar button:hover { background: rgba(255,255,255,0.12); }
        #presenter-bar button[aria-pressed="true"] { background: #F8FAFC; color: #0F172A; }
        #presenter-bar svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        #presenter-bar [data-action="color"] span { width: 14px; height: 14px; border-radius: 50%; background: var(--ink, #E11D48); box-shadow: 0 0 0 2px #E2E8F0; }
        #presenter-bar .sep { width: 1px; margin: 6px 3px; background: rgba(255,255,255,0.18); }
        #presenter-timer { position: fixed; top: 14px; right: 14px; z-index: 9999; padding: 6px 16px; border-radius: 999px; background: rgba(15, 23, 42, 0.78); color: #F8FAFC; font: 800 26px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: 1px; font-variant-numeric: tabular-nums; cursor: grab; border: 0; touch-action: none; }
        #presenter-timer[hidden] { display: none; }
        #presenter-timer[data-state="low"] { background: #B45309; }
        #presenter-timer[data-state="done"] { background: #DC2626; animation: presenter-pulse 0.9s ease-in-out infinite; }
        @keyframes presenter-pulse { 50% { transform: scale(1.08); } }
        #presenter-laser { position: fixed; z-index: 60; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: #FF2D2D; box-shadow: 0 0 14px 5px rgba(255, 45, 45, 0.6); pointer-events: none; display: none; }
        #presenter-poll { color:#0f172a; background:#fff; border:0; border-radius:16px; padding:24px; width:min(420px,90vw); font:16px/1.45 Arial,sans-serif; }
        #presenter-poll::backdrop { background:rgba(15,23,42,.6); }
        #presenter-poll h2 { font-size:1.35rem; margin:0; }
        #presenter-poll p { margin:8px 0 16px; }
        #presenter-poll label { display:grid; grid-template-columns:30px 72px 1fr 44px; gap:8px; align-items:center; margin:10px 0; }
        #presenter-poll label[hidden] { display:none; }
        #presenter-poll input { width:100%; padding:5px; box-sizing:border-box; }
        #presenter-poll meter { width:100%; accent-color:#2563eb; }
        #presenter-poll output { text-align:right; }
        #presenter-poll button { border:1px solid #64748b; background:white; padding:6px 12px; border-radius:6px; cursor:pointer; }
        #presenter-poll .poll-actions { display:flex; justify-content:space-between; align-items:center; gap:6px; margin-top:16px; }
        @media print { #presenter-poll { display:none !important; } }
        .presenter-laser-on, .presenter-laser-on * { cursor: none !important; }
    </style>
    <div id="presenter-bar" role="toolbar" aria-label="Presenter tools">
        <button type="button" data-tool="pen" aria-pressed="false" title="Pen (D)"><svg viewBox="0 0 24 24"><path d="M4 20l4-1L19 8l-3-3L5 16z"/></svg></button>
        <button type="button" data-tool="marker" aria-pressed="false" title="Highlighter (M)"><svg viewBox="0 0 24 24"><path d="M14 4l6 6-8 8-6-6zM6 12l-2 6h6"/></svg></button>
        <button type="button" data-action="color" title="Pen colour"><span></span></button>
        <button type="button" data-tool="laser" aria-pressed="false" title="Laser pointer (X)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button>
        <button type="button" data-action="undo" title="Undo stroke (U)"><svg viewBox="0 0 24 24"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/></svg></button>
        <button type="button" data-action="erase" title="Erase ink on this slide (E)"><svg viewBox="0 0 24 24"><path d="M20 20H9l-5-5L14 5l7 7-8 8"/></svg></button>
        <span class="sep"></span>
        <button type="button" data-action="answer" title="Show / hide answer (A)"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></button>
        <button type="button" data-action="timer" aria-pressed="false" title="Timer (T)"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg></button>
        <button type="button" data-action="poll" title="Class poll (P)" disabled><svg viewBox="0 0 24 24"><path d="M4 19h16M6 15v-4m6 4V5m6 10V8"/></svg></button>
    </div>
    <dialog id="presenter-poll" aria-labelledby="presenter-poll-title">
        <h2 id="presenter-poll-title">Class poll</h2>
        <p>Enter the number of hands raised for each choice.</p>
        ${'ABCDEF'.split('').map(label => `<label data-choice="${label}"><strong>${label}</strong><input aria-label="Votes for ${label}" type="number" min="0" max="9999" step="1" placeholder="0"><meter min="0" max="1" value="0" aria-label="Vote share for ${label}"></meter><output>0%</output></label>`).join('')}
        <form method="dialog" class="poll-actions"><button type="button" data-poll-reset>Reset</button><span role="status" data-poll-total>0 votes</span><button>Close</button></form>
    </dialog>
    <button type="button" id="presenter-timer" title="Click to pause or drag to move" hidden>00:00</button>

    ${assets.revealJs ? `<script>${assets.revealJs}</script>` : CDN.revealJs}
    ${hasNotes ? assets.notesJs ? `<script>${assets.notesJs.replace(/<\/script/gi, '<\\/script')}</script>` : CDN.notesJs : ''}
    <script>
        window.slidesReady = Reveal.initialize({
            plugins: window.RevealNotes ? [window.RevealNotes] : [],
            width: 1280,
            height: 720,
            margin: 0,
            minScale: 0.1,
            maxScale: 3.0,
            controls: true, progress: true, center: true, hash: ${!embedded}, transition: 'slide',
            slideNumber: ${presentation.slideNumbers ? "'c/t'" : 'false'},
            pdfSeparateFragments: false,
            pdfMaxPagesPerSlide: 1,
            pdfPageHeightOffset: 0,
        });

        window.addEventListener('beforeprint', () => {
            document.getElementById('print-slides')?.remove();
            const pages = document.createElement('div');
            pages.id = 'print-slides';
            pages.className = 'reveal';
            document.querySelectorAll('.slides .slide-container').forEach(slide => {
                pages.appendChild(slide.cloneNode(true));
            });
            // Handouts never give answers away; the optional answer key slide is the place for them.
            pages.querySelectorAll('.answer-opt, .answer-line').forEach(item => item.classList.remove('visible'));
            const warning = document.getElementById('slide-overflow-warning');
            if (!warning.hidden) pages.textContent = warning.textContent;
            else if (warning.dataset.ready !== 'true') pages.textContent = 'Slides are still loading. Try printing again in a moment.';
            document.body.appendChild(pages);
        });
        (${installSlidePdfExport.toString()})();
        (${installPresenterTools.toString()})(${fitSlideBox.toString()}, ${JSON.stringify(inkStorageKey)});
    </script>
</body>
</html>`;

    return htmlContent;
};

export const exportToRevealJS = (config, activeSlides, theme, layoutId = 'modern-sidebar', assets = {}) => {
    const htmlContent = buildRevealHtml(config, activeSlides, theme, layoutId, assets);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.mainTitle1}_${config.mainTitle2}_Slides.html`.replace(/ /g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
