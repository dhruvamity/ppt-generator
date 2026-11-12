import { teachingStyles, teachingIllustrationStyle, inlineStyle } from './teachingDesign.js';
import { signatureSlide } from './signatureDesigns.js';
import { watermarkStyle } from './watermark.js';
import { installSlidePdfExport } from './slidePdfRuntime.js';
import { installPresenterTools } from './presenterRuntime.js';
import { deckSequence, slideData, answerIndex, answerLabel, PRESENTATION_DEFAULTS } from './deckSequence.js';
import katex from 'katex';


const escapeHtml = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
const renderTex = (tex) => katex.renderToString(tex.includes('\\displaystyle') ? tex : `\\displaystyle ${tex}`, { displayMode: false, throwOnError: false, strict: false, trust: true, output: 'html' });

const CDN = {
    resetCss: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/reset.min.css">',
    revealCss: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/reveal.min.css">',
    katexCss: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.22/katex.min.css">',
    revealJs: '<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.2.1/reveal.min.js"></script>',
};

const x = (val) => (val * 128) + 'px';
const y = (val) => (val * 128) + 'px';
const w = (val) => (val * 128) + 'px';
const h = (val) => (val * 128) + 'px';
const fs = (pt) => (pt * 1.77664) + 'px';

const renderContext = (text) => {
    const lines = text.split('\n');
    let html = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('|') && lines[i + 1]?.match(/^\s*\|?\s*:?-{2,}/)) {
            const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(value => value.trim());
            html += '<table style="width:100%;border-collapse:collapse;font-size:inherit;margin:16px 0"><thead><tr>';
            html += cells(lines[i]).map(value => '<th style="padding:8px;border-bottom:2px solid currentColor;text-align:left">' + enforceDisplayMath(value) + '</th>').join('');
            html += '</tr></thead><tbody>';
            i += 2;
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                html += '<tr>' + cells(lines[i]).map(value => '<td style="padding:8px;border-bottom:1px solid currentColor">' + enforceDisplayMath(value) + '</td>').join('') + '</tr>';
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

export const buildRevealHtml = (config, activeSlides, theme, layoutId = 'modern-sidebar', assets = {}) => {
    const style = key => assets[key] ? `<style>${assets[key]}</style>` : CDN[key];
    const deckConfig = config;
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

    const renderGlobalDecorations = () => `
        <div style="position: absolute; left: ${x(-0.5)}; top: ${y(-0.5)}; width: ${w(2.0)}; height: ${h(2.0)}; background-color: #${theme.tealDecor}; opacity: 0.2; border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: ${x(8.5)}; top: ${y(4.125)}; width: ${w(2.0)}; height: ${h(2.0)}; background-color: #${theme.decorPurple}; opacity: 0.2; border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: ${x(0)}; top: ${y(5.5)}; width: ${w(10)}; height: ${h(0.125)}; background-color: #${theme.gold}; opacity: 0.8;"></div>
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
            optsHtml += `
                <div${reveal} style="min-width: 0; display: flex; gap: 8px; margin-bottom: 0.25rem; color: #${color}; font-size: ${theme.teaching ? '28px' : fs(11)}; line-height: 1.5;">
                    <strong style="white-space: nowrap;">(${escapeHtml(String(opt.label).replace(/[().]/g, "").toUpperCase())})</strong> <span style="min-width: 0;">${enforceDisplayMath(opt.text)}</span>
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
            <div style="color: #${textColor}; font-size: ${theme.teaching ? '28px' : fs(10)}; line-height: 1.5;">${renderContext(String(slide.solution || ''))}</div>`;
    };
    const renderAnswerKey = (entries, color, textColor) => `<div style="display: grid; grid-template-columns: repeat(${entries.length > 12 ? 4 : entries.length > 6 ? 3 : 2}, minmax(0, 1fr)); gap: 12px 32px; font-size: ${theme.teaching ? '28px' : fs(11)}; color: #${textColor};">${entries.map(entry => `<div style="display: flex; gap: 12px; align-items: baseline; border-bottom: 1px dashed currentColor; padding-bottom: 6px;"><strong style="color: #${color}; white-space: nowrap;">${escapeHtml(entry.badge)}</strong><span>${enforceDisplayMath(entry.answer)}</span></div>`).join('')}</div>`;

    const renderQuestionContent = (slide, color, textColor = theme.textWhite, bold = false) => {
        // Long questions, passages and solutions scale down at present time instead of being clipped.
        const fit = html => `<div class="q-fit" style="width: 100%; height: 100%; min-height: 0; flex: 1 1 auto;">${html}</div>`;
        if (slide.kind === 'solution') return fit(renderSolution(slide, color, textColor));
        if (slide.kind === 'key') return fit(renderAnswerKey(slide.entries || [], color, textColor));
        const answerIdx = answerIndex(slide);
        const freeAnswer = answerIdx < 0 && presentation.revealAnswers && String(slide.answer ?? '').trim()
            ? `<div class="fragment fade-up answer-line" style="margin-top: 28px; color: #${color}; font-size: ${textSize}; font-weight: bold;">Answer: ${enforceDisplayMath(String(slide.answer).trim())}</div>` : '';
        const question = `
            <div style="color: #${textColor}; font-size: ${textSize}; font-weight: ${bold ? 'bold' : 'normal'}; line-height: 1.5; white-space: pre-wrap;">${enforceDisplayMath(slide.qText)}</div>
            ${renderOptionsGrid(slide.options, color, Boolean(slide.context), answerIdx)}${freeAnswer}
        `;
        const context = slide.context?.trim();
        if (!context) return fit(question);

        return fit(`
            <div style="display: grid; grid-template-columns: ${theme.teaching ? 'minmax(0, 0.48fr) minmax(0, 0.52fr)' : 'minmax(0, 1fr) minmax(0, 1fr)'}; width: 100%; height: 100%; gap: 32px; min-height: 0; align-items: flex-start;">
                <div style="min-width: 0; height: 100%; box-sizing: border-box; padding-right: ${theme.teaching ? '24px' : '28px'}; border-right: 1px solid #${theme.cyan || theme.pinkOrb || theme.black}; color: #${textColor}; font-size: ${theme.teaching ? '24px' : fs(10)}; line-height: 1.45; overflow: hidden;">${renderContext(context)}</div>
                <div style="min-width: 0;">
                    ${question}
                </div>
            </div>
        `);
    };

    const generateSlideHtml = (isTitle, slide, layoutType, config = deckConfig) => {
        let slideHtml = '';

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

        if (theme.name === 'Cyberpunk Neon') {
            const isWorkspace = slide?.isWorkspace || false;
            const accentColor = isWorkspace ? theme.gold : theme.cyan;
            const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';
            const qNum = slide?.badge ? slide.badge.replace('Q.', 'Q') : 'Q1';

            const renderModernNeonDecorations = (isTitle = false) => `
                <div style="position: absolute; right: ${x(-1.0)}; top: ${y(isTitle ? -1.5 : -3.5)}; width: ${w(4.0)}; height: ${h(4.0)}; background-color: #${theme.purple}; border: 24px solid #${theme.gold}; border-radius: 50%; opacity: ${isTitle ? 1 : 0.16}; z-index: 0;"></div>
                <div style="position: absolute; left: ${x(-1.5)}; bottom: ${y(isTitle ? -2.0 : -3.0)}; width: ${w(4.0)}; height: ${h(4.0)}; background-color: #${theme.cyan}; border-radius: 50%; opacity: ${isTitle ? 1 : 0.16}; z-index: 0;"></div>
                ${!isTitle ? `<div style="position: absolute; right: ${x(0.5)}; bottom: ${y(0.8)}; font-size: ${fs(150)}; font-weight: bold; color: #${theme.watermark}; opacity: 0.1; z-index: 0; line-height: 1;">${escapeHtml(qNum)}</div>` : ''}
                <div style="position: absolute; left: 0; bottom: 0; width: 40%; height: ${h(0.4)}; background-color: #${theme.magenta}; z-index: 1;"></div>
                <div style="position: absolute; left: 40%; bottom: 0; width: 60%; height: ${h(0.4)}; background-color: #${theme.purple}; z-index: 1;"></div>
            `;

            if (isTitle) {
                slideHtml = `
                    ${renderModernNeonDecorations(true)}
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                        <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                            ${escapeHtml(config?.mainTitle1)} <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div style="background-color: #${theme.cyan}; padding: 10px 30px; border-radius: 8px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                            <div style="border: 2px solid #${theme.magenta}; padding: 10px 30px; border-radius: 8px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.magenta}">${escapeHtml(config?.pill2)}</div>
                        </div>
                        <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${escapeHtml(config?.footer)}</div>
                    </div>
                `;
            } else {
                let bodyContent = '';
                if (isWorkspace) {
                    bodyContent = `
                        <div style="width: 100%; height: 100%; background: repeating-linear-gradient(to bottom, transparent, transparent 49px, #${theme.watermark} 49px, #${theme.watermark} 50px);"></div>
                    `;
                } else {
                    bodyContent = renderQuestionContent(slide, theme.cyan);
                }

                slideHtml = `
                    ${renderModernNeonDecorations()}
                    
                    <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                        ${isWorkspace 
                            ? `<div style="font-size: ${fs(14)}; font-weight: bold; color: #${theme.gold}; padding-right: 15px;">WORK SPACE</div>` 
                            : `<div style="background-color: #${theme.cyan}; padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack}; border-radius: 8px 0 0 8px;">${escapeHtml(headerText)}</div>`
                        }
                        <div style="flex-grow: 1; height: 2px; background-color: #${accentColor};"></div>
                    </div>

                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                        ${bodyContent}
                    </div>
                `;
            }
            
            return `
                <section>
                    <div class="slide-container" data-workspace="${Boolean(slide?.isWorkspace)}">
                        ${slideHtml}
                    </div>
                </section>`;
        }

        if (theme.name === 'Blueprint Architect') {
            const isWorkspace = slide?.isWorkspace || false;
            const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';
            
            const renderBlueprintDecorations = () => `
                <div style="position: absolute; left: 16px; top: 16px; right: 16px; bottom: 16px; border: 2px solid #${theme.cyan}; z-index: 0; pointer-events: none;"></div>
                <div style="position: absolute; left: 8px; top: 8px; width: 40px; height: 40px; border-top: 4px solid #${theme.orange}; border-left: 4px solid #${theme.orange}; z-index: 1;"></div>
                <div style="position: absolute; right: 8px; bottom: 8px; width: 40px; height: 40px; border-bottom: 4px solid #${theme.orange}; border-right: 4px solid #${theme.orange}; z-index: 1;"></div>
            `;

            if (isTitle) {
                slideHtml = `
                    ${renderBlueprintDecorations()}
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                        <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                            ${escapeHtml(config?.mainTitle1)} <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div style="background-color: #${theme.orange}; padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                            <div style="border: 2px solid #${theme.cyan}; padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textWhite}">${escapeHtml(config?.pill2)}</div>
                        </div>
                        <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${escapeHtml(config?.footer)}</div>
                    </div>
                `;
            } else {
                let bodyContent = '';
                if (isWorkspace) {
                    bodyContent = `
                        <div style="width: 100%; height: 100%; background: linear-gradient(rgba(0, 255, 204, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
                    `;
                } else {
                    bodyContent = renderQuestionContent(slide, theme.cyan);
                }

                slideHtml = `
                    ${renderBlueprintDecorations()}
                    
                    <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                        <div style="background-color: #${theme.orange}; padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack};">${escapeHtml(headerText)}</div>
                    </div>

                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                        ${bodyContent}
                    </div>
                `;
            }
            return `
                <section>
                    <div class="slide-container" data-workspace="${Boolean(slide?.isWorkspace)}">
                        ${slideHtml}
                    </div>
                </section>`;
        }

        if (theme.name === 'Aurora Glassmorphism') {
            const isWorkspace = slide?.isWorkspace || false;
            const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';

            const renderAuroraDecorations = () => `
                <div style="position: absolute; left: -100px; top: -100px; width: 400px; height: 400px; background-color: #${theme.blueOrb}; filter: blur(80px); opacity: 0.3; border-radius: 50%; z-index: 0;"></div>
                <div style="position: absolute; right: -100px; bottom: -100px; width: 400px; height: 400px; background-color: #${theme.pinkOrb}; filter: blur(80px); opacity: 0.3; border-radius: 50%; z-index: 0;"></div>
            `;

            if (isTitle) {
                slideHtml = `
                    ${renderAuroraDecorations()}
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                        <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                            ${escapeHtml(config?.mainTitle1)} <span style="color: #${theme.pinkOrb}">${escapeHtml(config?.mainTitle2)}</span>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 10px 30px; border-radius: 50px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textWhite}">${escapeHtml(config?.pill1)}</div>
                            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 10px 30px; border-radius: 50px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textWhite}">${escapeHtml(config?.pill2)}</div>
                        </div>
                        <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${escapeHtml(config?.footer)}</div>
                    </div>
                `;
            } else {
                let bodyContent = '';
                if (isWorkspace) {
                    bodyContent = `
                        <div style="width: 100%; height: 100%; background: radial-gradient(#${theme.dot} 2px, transparent 2px); background-size: 40px 40px;"></div>
                    `;
                } else {
                    bodyContent = renderQuestionContent(slide, theme.textWhite);
                }

                slideHtml = `
                    ${renderAuroraDecorations()}
                    
                    <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textWhite}; border-radius: 50px;">${escapeHtml(headerText)}</div>
                    </div>

                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                        ${bodyContent}
                    </div>
                `;
            }
            return `
                <section>
                    <div class="slide-container" data-workspace="${Boolean(slide?.isWorkspace)}">
                        ${slideHtml}
                    </div>
                </section>`;
        }

        if (theme.name === 'Neo-Brutalism') {
            const isWorkspace = slide?.isWorkspace || false;
            const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';

            const renderNeoBrutalismDecorations = () => `
                <div style="position: absolute; left: 0; bottom: 0; width: 100%; height: 10%; background-color: #${theme.pink}; border-top: 3px solid #${theme.black}; z-index: 1;"></div>
            `;
            
            const shadowStyle = `box-shadow: 6px 6px 0 0 #${theme.black};`;

            if (isTitle) {
                slideHtml = `
                    ${renderNeoBrutalismDecorations()}
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                        <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textBlack}; text-align: center; margin-bottom: 20px; text-transform: uppercase;">
                            ${escapeHtml(config?.mainTitle1)} <span style="background-color: #${theme.acidGreen}; padding: 0 10px; border: 3px solid #${theme.black}; ${shadowStyle}">${escapeHtml(config?.mainTitle2)}</span>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div style="background-color: #${theme.acidGreen}; border: 3px solid #${theme.black}; ${shadowStyle} padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                            <div style="background-color: #${theme.bgColor}; border: 3px solid #${theme.black}; ${shadowStyle} padding: 10px 30px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill2)}</div>
                        </div>
                        <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textBlack}; font-weight: bold;">${escapeHtml(config?.footer)}</div>
                    </div>
                `;
            } else {
                let bodyContent = '';
                if (isWorkspace) {
                    bodyContent = `
                        <div style="width: 100%; height: 100%; background: repeating-linear-gradient(to bottom, transparent, transparent 59px, #${theme.black} 59px, #${theme.black} 60px);"></div>
                    `;
                } else {
                    bodyContent = renderQuestionContent(slide, theme.textBlack, theme.textBlack, true);
                }

                slideHtml = `
                    ${renderNeoBrutalismDecorations()}
                    
                    <div style="position: absolute; left: 0; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: 100%; padding: 0 60px; box-sizing: border-box;">
                        <div style="background-color: #${theme.acidGreen}; border: 3px solid #${theme.black}; ${shadowStyle} padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack};">${escapeHtml(headerText)}</div>
                        <div style="flex-grow: 1; height: 3px; background-color: #${theme.black}; margin: 0 20px;"></div>
                    </div>

                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 10% 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                        ${bodyContent}
                    </div>
                `;
            }
            return `
                <section>
                    <div class="slide-container" data-workspace="${Boolean(slide?.isWorkspace)}">
                        ${slideHtml}
                    </div>
                </section>`;
        }

        if (!isTitle && slide?.isWorkspace) {
            const workspaceColor = theme.cyan || theme.gold || theme.textWhite;
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.35)}; right: ${x(0.5)}; display: flex; align-items: center; gap: 18px; z-index: 2;">
                    <div style="padding: 8px 18px; border: 2px solid #${workspaceColor}; border-radius: 8px; color: #${workspaceColor}; font-size: ${fs(14)}; font-weight: bold; letter-spacing: 1px;">WORK SPACE</div>
                    <div style="height: 2px; flex: 1; background: #${workspaceColor}; opacity: 0.7;"></div>
                </div>
                <div style="position: absolute; left: ${x(0.5)}; right: ${x(0.5)}; top: ${y(1.05)}; bottom: ${y(0.55)}; background: repeating-linear-gradient(to bottom, transparent 0, transparent 55px, #${workspaceColor} 56px, transparent 57px); opacity: 0.38;"></div>
            `;
        } else if (isTitle && layoutType === 'modern-sidebar') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.cyan}"></div>
                <div style="position: absolute; left: ${x(0.05)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(1.5)}; width: ${w(8)}; height: ${h(1.5)}; font-size: ${fs(54)}; font-weight: bold; display: flex; align-items: center;">
                    <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle1)}&nbsp;</span>
                    <span style="color: #${theme.gold}">${escapeHtml(config?.mainTitle2)}</span>
                </div>

                <div style="position: absolute; left: ${x(1.2)}; top: ${y(3.0)}; width: ${w(6.5)}; height: ${h(0.04)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(1.2)}; top: ${y(3.4)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                <div style="position: absolute; left: ${x(4.4)}; top: ${y(3.4)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.bgColor}; border: 3px solid #${theme.purple}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.purple}; box-sizing: border-box;">${escapeHtml(config?.pill2)}</div>
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(4.2)}; width: ${w(8)}; height: ${h(0.5)}; font-size: ${fs(16)}; color: #${theme.textWhite}; letter-spacing: 4px; display: flex; align-items: center;">${escapeHtml(config?.footer)}</div>
            `;
        } else if (!isTitle && layoutType === 'modern-sidebar') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.cyan}"></div>
                <div style="position: absolute; left: ${x(0.05)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                
                <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; right: ${x(0.2)}; height: ${h(0.25)}; display: flex; align-items: center;">
                    <div style="width: ${w(0.6)}; height: 100%; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(slide.badge)}</div>
                    <div style="flex: 1; height: ${h(0.02)}; margin-left: ${x(0.2)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 64px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                    ${renderQuestionContent(slide, theme.cyan)}
                </div>
            `;
        } else if (isTitle && layoutType === 'classic-header') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(10)}; height: ${h(2)}; background-color: #${theme.purple}"></div>
                <div style="position: absolute; left: ${x(0)}; top: ${y(1.9)}; width: ${w(10)}; height: ${h(0.1)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.3)}; width: ${w(9)}; height: ${h(1.2)}; font-size: ${fs(45)}; font-weight: bold; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <span style="color: #${theme.textBlack}">${escapeHtml(config?.mainTitle1)}&nbsp;</span>
                    <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
                </div>

                <div style="position: absolute; left: ${x(2)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                <div style="position: absolute; left: ${x(5.2)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.purple}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill2)}</div>
                <div style="position: absolute; left: ${x(0.5)}; top: ${y(4.5)}; width: ${w(9)}; height: ${h(0.5)}; font-size: ${fs(16)}; color: #${theme.textWhite}; letter-spacing: 2px; display: flex; align-items: center; justify-content: center;">${escapeHtml(config?.footer)}</div>
            `;
        } else if (!isTitle && layoutType === 'classic-header') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(10)}; height: ${h(0.05)}; background-color: #${theme.purple}"></div>
                <div style="position: absolute; left: ${x(0)}; top: ${y(0.05)}; width: ${w(10)}; height: ${h(0.02)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; right: ${x(0.2)}; height: ${h(0.25)}; display: flex; align-items: center;">
                    <div style="width: ${w(0.6)}; height: 100%; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(slide.badge)}</div>
                    <div style="flex: 1; height: ${h(0.02)}; margin-left: ${x(0.2)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 64px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                    ${renderQuestionContent(slide, theme.cyan)}
                </div>
            `;
        } else if (isTitle && layoutType === 'split-focus') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(4.5)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                <div style="position: absolute; left: ${x(4.5)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(0.8)}; top: ${y(2.0)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill1)}</div>
                <div style="position: absolute; left: ${x(0.8)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.gold}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(config?.pill2)}</div>

                <div style="position: absolute; left: ${x(5)}; top: ${y(1.5)}; width: ${w(4.5)}; height: ${h(2)}; font-size: ${fs(49)}; font-weight: bold; display: flex; flex-direction: column; justify-content: center;">
                    <span style="color: #${theme.textWhite}">${escapeHtml(config?.mainTitle1)}</span>
                    <span style="color: #${theme.cyan}">${escapeHtml(config?.mainTitle2)}</span>
                </div>

                <div style="position: absolute; left: ${x(5)}; top: ${y(4.5)}; width: ${w(4.5)}; height: ${h(0.5)}; font-size: ${fs(14)}; color: #${theme.textWhite}; letter-spacing: 2px; display: flex; align-items: center;">${escapeHtml(config?.footer)}</div>
            `;
        } else if (!isTitle && layoutType === 'split-focus') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.1)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                
                <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; right: ${x(0.2)}; height: ${h(0.25)}; display: flex; align-items: center;">
                    <div style="width: ${w(0.6)}; height: 100%; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${escapeHtml(slide.badge)}</div>
                    <div style="flex: 1; height: ${h(0.02)}; margin-left: ${x(0.2)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>
                </div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 64px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                    ${renderQuestionContent(slide, theme.gold)}
                </div>
            `;
        }
        return `
            <section>
                <div class="slide-container" data-workspace="${Boolean(slide?.isWorkspace)}">
                    ${slideHtml}
                </div>
            </section>`;
    };

    // Wrap all slides in a single section for vertical (up-down) navigation
    const watermarkText = String(config?.watermark ?? '').trim();
    const withWatermark = html => watermarkText ? html.replace(/(<div class="slide-container"[^>]*>)/, `$1<div style="${inlineStyle(watermarkStyle(theme, layoutId))}">${escapeHtml(watermarkText)}</div>`) : html;
    // The presenter runtime reads the slide kind (timer runs on questions only).
    const tagSlide = (html, kind) => html.replace('<div class="slide-container"', `<div class="slide-container" data-kind="${kind}"${kind === 'question' && timerSeconds ? ` data-timer="${timerSeconds}"` : ''}`);

    htmlContent += `<section>\n`;

    // Title, optional section dividers, questions and their workspace / solution pages, optional key.
    for (const entry of deckSequence(config, activeSlides)) {
        const isTitle = entry.kind === 'title' || entry.kind === 'section';
        const slideHtml = generateSlideHtml(isTitle, isTitle ? null : slideData(entry), layoutId, entry.kind === 'section' ? entry.config : config);
        htmlContent += withWatermark(tagSlide(slideHtml, entry.kind));
    }

    // Close the vertical stack
    htmlContent += `</section>\n`;

    htmlContent += `
        </div>
    </div>

    <!-- Floating PDF Export Button -->
    <button type="button" id="pdf-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #${theme.cyan || theme.blueOrb || theme.acidGreen || '2563EB'}; color: black; padding: 10px 20px; border-radius: 8px; font-family: sans-serif; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); opacity: 0.8; transition: opacity 0.2s;">
        Save as PDF
    </button>

    <!-- Presenter tools: never part of a slide, so print and PDF output stay clean -->
    <style>
        #presenter-bar { position: fixed; left: 16px; bottom: 16px; z-index: 9999; display: flex; gap: 2px; padding: 5px; border-radius: 12px; background: rgba(15, 23, 42, 0.82); box-shadow: 0 6px 18px rgba(0,0,0,0.35); opacity: 0.35; transition: opacity .2s; font-family: 'Segoe UI', Arial, sans-serif; }
        #presenter-bar:hover, #presenter-bar:focus-within, #presenter-bar:has([data-tool][aria-pressed="true"]) { opacity: 1; }
        #presenter-bar button { width: 34px; height: 34px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: #E2E8F0; cursor: pointer; padding: 0; }
        #presenter-bar button:hover { background: rgba(255,255,255,0.12); }
        #presenter-bar button[aria-pressed="true"] { background: #F8FAFC; color: #0F172A; }
        #presenter-bar svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        #presenter-bar [data-action="color"] span { width: 14px; height: 14px; border-radius: 50%; background: var(--ink, #E11D48); box-shadow: 0 0 0 2px #E2E8F0; }
        #presenter-bar .sep { width: 1px; margin: 6px 3px; background: rgba(255,255,255,0.18); }
        #presenter-timer { position: fixed; top: 14px; right: 14px; z-index: 9999; padding: 6px 16px; border-radius: 999px; background: rgba(15, 23, 42, 0.78); color: #F8FAFC; font: 800 26px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: 1px; font-variant-numeric: tabular-nums; cursor: pointer; }
        #presenter-timer[hidden] { display: none; }
        #presenter-timer[data-state="low"] { background: #B45309; }
        #presenter-timer[data-state="done"] { background: #DC2626; animation: presenter-pulse 0.9s ease-in-out infinite; }
        @keyframes presenter-pulse { 50% { transform: scale(1.08); } }
        #presenter-laser { position: fixed; z-index: 60; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: #FF2D2D; box-shadow: 0 0 14px 5px rgba(255, 45, 45, 0.6); pointer-events: none; display: none; }
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
    </div>
    <div id="presenter-timer" role="timer" aria-live="off" title="Click or press T to pause" hidden>00:00</div>

    ${assets.revealJs ? `<script>${assets.revealJs}</script>` : CDN.revealJs}
    <script>
        window.slidesReady = Reveal.initialize({
            width: 1280,
            height: 720,
            margin: 0,
            minScale: 0.1,
            maxScale: 3.0,
            controls: true, progress: true, center: true, hash: true, transition: 'slide',
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
            document.body.appendChild(pages);
        });
        (${installSlidePdfExport.toString()})();
        (${installPresenterTools.toString()})();
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
