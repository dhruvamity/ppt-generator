import { classicSlideMarkup } from '../../utils/classicSlides.js';
import { teachingStyles, teachingIllustrationStyle, previewStyle } from '../../utils/teachingDesign.js';
import { signatureSlide } from '../../utils/signatureDesigns.js';
import { watermarkStyle } from '../../utils/watermark.js';
import { answerIndex, answerLabel } from '../../utils/deckSequence.js';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { isQuestionFigure } from '../../utils/questionFigure.js';
import { fitSlideBox } from '../../utils/fitSlideBox.js';
import EditableBlock from './EditableBlock';
import MathRenderer from './MathRenderer';
import { useStore } from '../../store/useStore';

const CORRECT = '16A34A';

const MathText = ({ text }) => <span>{String(text ?? '').split('$').map((part, i) => i % 2 ? <MathRenderer key={i} math={`\\displaystyle ${part}`} /> : part)}</span>;

function SampleText({ value, style }) {
    return <div style={style}><MathText text={value} /></div>;
}

// Mirrors the export's present-time auto-fit: overflowing content scales down (to half size at
// most) instead of being clipped, so the preview shows what the class will see.
function FitBox({ children }) {
    const ref = useRef(null);
    const [overflow, setOverflow] = useState(false);
    const fit = useCallback(() => {
        if (ref.current) setOverflow(!fitSlideBox(ref.current));
    }, []);
    useLayoutEffect(fit);
    useEffect(() => {
        const parent = ref.current?.parentElement;
        if (!parent || typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(() => fit());
        observer.observe(parent);
        let mounted = true;
        document.fonts.ready.then(() => { if (mounted) fit(); });
        const box = ref.current;
        box?.addEventListener('load', fit, true);
        return () => { mounted = false; observer.disconnect(); box?.removeEventListener('load', fit, true); };
    }, [fit]);
    return <>
        <div ref={ref} style={{ width: '100%', height: '100%', minHeight: 0, flex: '0 0 auto', overflowWrap: 'anywhere' }}>{children}</div>
        {overflow && <span role="status" className="absolute bottom-0 left-0 z-30 bg-amber-100 px-2 py-0.5 text-xs text-amber-950">Slide is too long. Shorten or split the content.</span>}
    </>;
}

// Math helpers to map PPTX inches to CSS percentages
// Interpret only the Classic layout's divs and spans. The question slot stays an editable
// React subtree, while the same layout dimensions scale with the width of the preview.
const fs = pt => `${pt * 0.1388}cqw`;

function classicPreview(markup, questionBody) {
    const document = new DOMParser().parseFromString(markup, 'text/html');
    const render = (node, key) => {
        if (node.nodeType === 3) return node.textContent;
        if (node.localName === 'deck-question') return questionBody;
        if (!['div', 'span'].includes(node.localName)) return null;
        const style = Object.fromEntries((node.getAttribute('style') || '').split(';').flatMap(entry => {
            const separator = entry.indexOf(':');
            if (separator < 0) return [];
            return [[entry.slice(0, separator).trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), entry.slice(separator + 1).trim()]];
        }));
        return React.createElement(node.localName, { key, style: previewStyle(style) }, Array.from(node.childNodes, render));
    };
    return Array.from(document.body.childNodes, render);
}

export default function LiveSlidePreview({ theme, type = 'title', config, questionData, layoutId, thumbnail = false }) {
    // Action references are stable. Deck edits should only render the slides whose props change.
    const updateSlideQuestion = useStore(state => state.updateSlideQuestion);
    const updateSlideContext = useStore(state => state.updateSlideContext);
    const updateSlideOption = useStore(state => state.updateSlideOption);
    const updateSlideAnswer = useStore(state => state.updateSlideAnswer);
    const updateSlideSolution = useStore(state => state.updateSlideSolution);
    if (!theme) return null;

    const layoutType = layoutId || 'modern-sidebar';
    const watermarkText = String(config?.watermark ?? '').trim();
    const watermark = watermarkText ? <div style={previewStyle(watermarkStyle(theme, layoutType))}>{watermarkText}</div> : null;

    const baseStyle = {
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: `#${theme.bgColor}`,
        overflow: 'hidden',
        containerType: 'inline-size',
        fontFamily: 'Arial, sans-serif'
    };

    // Catalogue cards use a fixed, short sample. Measuring every card forces synchronous layout
    // during the click that opens the picker, so only the editable preview uses FitBox.
    const TextBlock = thumbnail ? SampleText : EditableBlock;
    const renderOptionsGrid = (options, color, slideIndex) => {
        if (!options || !Array.isArray(options) || options.length === 0) return null;
        
        const totalChars = options.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
        const hasContext = Boolean(questionData?.context?.trim());
        const cols = hasContext && totalChars > 160 ? 1 : !hasContext && totalChars < 60 && options.length === 4 ? 4 : 2;
        const correct = answerIndex(questionData);

        return (
            <div style={{ marginTop: '2.4cqw', display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, width: '100%', gap: '1.2cqw' }}>
                {options.map((opt, i) => (
                    <div key={i} title={i === correct ? 'Correct answer: revealed on the next click when presenting' : undefined} style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: '0.4em', color: `#${color}`, fontSize: theme.teaching ? '2.1875cqw' : fs(11), lineHeight: 1.5, ...(i === correct ? { outline: `0.16cqw dashed #${CORRECT}`, outlineOffset: '0.3cqw', borderRadius: '0.6cqw' } : {}) }}>
                        <strong style={{ whiteSpace: 'nowrap' }}>({opt.label})</strong> 
                        <TextBlock
                            value={opt.text} 
                            theme={theme}
                            onChange={(newVal) => updateSlideOption(slideIndex, i, newVal)} 
                            style={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere', lineHeight: 1.5 }}
                        />
                        {i === correct && <span aria-label="correct answer" style={{ color: `#${CORRECT}`, fontWeight: 900, paddingRight: '0.6cqw' }}>✓</span>}
                    </div>
                ))}
            </div>
        );
    };

    const questionSize = theme.teaching ? '2.5cqw' : fs(11);
    const renderSolutionBody = (accent, textColor) => {
        const answer = questionData?.answerText ?? answerLabel(questionData);
        return <div style={{ minWidth: 0 }}>
            {answer && <div style={{ display: 'flex', gap: '0.4em', color: `#${accent}`, fontSize: questionSize, fontWeight: 'bold', marginBottom: '1.25cqw' }}>Answer:
                <TextBlock value={answer} theme={theme} onChange={value => updateSlideAnswer(questionData?.index, value)} />
            </div>}
            <div style={{ color: `#${textColor}`, fontSize: theme.teaching ? '2.1875cqw' : fs(10), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                <TextBlock value={questionData?.solution} renderTables theme={theme} onChange={value => updateSlideSolution(questionData?.index, value)} />
            </div>
        </div>;
    };
    const renderAnswerKey = (accent, textColor) => {
        const entries = questionData?.entries || [];
        return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${entries.length > 12 ? 4 : entries.length > 6 ? 3 : 2}, minmax(0, 1fr))`, gap: '0.94cqw 2.5cqw', fontSize: theme.teaching ? '2.1875cqw' : fs(11), color: `#${textColor}` }}>
            {entries.map(entry => <div key={entry.badge} style={{ display: 'flex', gap: '0.94cqw', alignItems: 'baseline', borderBottom: '0.08cqw dashed currentColor', paddingBottom: '0.47cqw' }}>
                <strong style={{ color: `#${accent}`, whiteSpace: 'nowrap' }}>{entry.badge}</strong><MathText text={entry.answer} />
            </div>)}
        </div>;
    };

    const renderQuestionBody = (optionColor, textColor = theme.textWhite, bold = false) => {
        const content = renderQuestionContent(optionColor, textColor, bold);
        return thumbnail ? content : <FitBox>{content}</FitBox>;
    };
    const renderQuestionContent = (optionColor, textColor, bold) => {
        if (questionData?.kind === 'solution') return renderSolutionBody(optionColor, textColor);
        if (questionData?.kind === 'key') return renderAnswerKey(optionColor, textColor);
        if (['concept', 'formula', 'passage'].includes(questionData?.kind)) {
            const readOnly = questionData.kind === 'passage';
            return <div style={{ color: `#${textColor}`, fontSize: questionSize, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                <h3 style={{ color: `#${optionColor}`, fontWeight: 700, marginBottom: '1cqw' }}>{questionData.title}</h3>
                <TextBlock value={questionData.qText} renderTables readOnly={readOnly} onChange={value => updateSlideQuestion(questionData.index, value)} />
                {questionData.formula && <div style={{ marginTop: '1.4cqw', borderLeft: `0.3cqw solid #${optionColor}`, padding: '0.8cqw 1.2cqw' }}><MathText text={questionData.formula} /></div>}
            </div>;
        }
        const freeAnswer = answerIndex(questionData) < 0 && String(questionData?.answer ?? '').trim();
        const promptAndOptions = (
            <div style={{ minWidth: 0 }}>
                {questionData?.contextReference && <p style={{ fontSize: questionSize, marginBottom: '0.7cqw', color: `#${optionColor}` }}>{questionData.contextReference}</p>}
                <div style={{ color: `#${textColor}`, fontSize: questionSize, lineHeight: 1.5, whiteSpace: 'pre-wrap', fontWeight: bold ? 'bold' : 'normal' }}>
                    <TextBlock
                        value={questionData?.qText}
                        theme={theme}
                        onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)}
                    />
                </div>
                {renderOptionsGrid(questionData?.options, optionColor, questionData?.index)}
                {freeAnswer && <div title="Revealed on the next click when presenting" style={{ marginTop: '2.2cqw', display: 'inline-flex', gap: '0.4em', color: `#${optionColor}`, fontSize: questionSize, fontWeight: 'bold', outline: `0.16cqw dashed #${CORRECT}`, outlineOffset: '0.3cqw', borderRadius: '0.6cqw' }}>Answer:
                    <TextBlock value={String(questionData.answer)} theme={theme} onChange={value => updateSlideAnswer(questionData?.index, value)} />
                </div>}
            </div>
        );

        const figure = isQuestionFigure(questionData?.figure) ? questionData.figure : '';
        if (!questionData?.context?.trim() && !figure) return promptAndOptions;

        const accent = theme.cyan || theme.blueOrb || theme.black || textColor;
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.48fr) minmax(0, 0.52fr)', gap: '2.5cqw', width: '100%', minHeight: '100%' }}>
                <div style={{ boxSizing: 'border-box', minWidth: 0, paddingRight: '1.875cqw', borderRight: `0.08cqw solid #${accent}`, color: `#${textColor}`, fontSize: theme.teaching ? '1.875cqw' : fs(10), lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                    {figure && <img src={figure} alt={`Figure for ${questionData.badge}`} style={{ width: '100%', maxHeight: questionData.context ? '20cqw' : '36cqw', objectFit: 'contain' }} />}
                    {questionData.context && <TextBlock
                        value={questionData.context}
                        renderTables
                        style={{ lineHeight: 1.45 }}
                        theme={theme}
                        onChange={(newVal) => updateSlideContext(questionData?.index, newVal)}
                    />}
                </div>
                {promptAndOptions}
            </div>
        );
    };

    if (theme.design) {
        const title = type === 'title';
        const workspace = Boolean(questionData?.isWorkspace);
        const slide = signatureSlide(theme, title, workspace);
        const s = key => previewStyle(slide[key]);
        return <div style={{ ...baseStyle, fontFamily: slide.font }} className="rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
            {slide.decorations.map((item, i) => <div key={i} style={previewStyle(item.style)}>{item.text}</div>)}
            {!title && <div style={s('header')}><span style={s('badge')}>{workspace ? 'WORK SPACE' : questionData?.badge}</span>{slide.rule && <div style={s('rule')} />}</div>}
            <div style={s('body')}>
                {title ? <><div style={s('title')}>{config?.mainTitle1}<br /><span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span></div><div style={s('subtitle')}>{[config?.pill1, config?.pill2].filter(Boolean).join(' / ')}</div><div style={s('footer')}>{config?.footer}</div></>
                    : workspace ? <div style={s('workspace')} /> : renderQuestionBody(theme.cyan)}
            </div>
        </div>;
    }

    if (theme.teaching) {
        const title = type === 'title';
        const workspace = Boolean(questionData?.isWorkspace);
        const styles = Object.fromEntries(Object.entries(teachingStyles(theme, layoutType, title, workspace)).map(([key, style]) => [key, previewStyle(style)]));
        const illustration = theme.illustration ? previewStyle(teachingIllustrationStyle(theme)) : null;
        return <div style={baseStyle} className="rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
            <div style={styles.accent} />
            {illustration && <div style={illustration} />}
            {!title && <div style={styles.header}><span>{workspace ? 'WORK SPACE' : questionData?.badge}</span><div style={styles.rule} /></div>}
            {layoutType === 'split-focus' && !title && !workspace && <div style={styles.rail} />}
            <div style={styles.body}>
                {title ? <><div style={styles.title}>{config?.mainTitle1}<br /><span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span></div><div style={styles.subtitle}>{[config?.pill1, config?.pill2].filter(Boolean).join(' / ')}</div><div style={styles.footer}>{config?.footer}</div></>
                    : workspace ? <div style={styles.workspace} /> : renderQuestionBody(theme.cyan)}
            </div>
        </div>;
    }

    let body;
    const markup = classicSlideMarkup({
        theme, isTitle: type === 'title', slide: questionData, layoutType, config,
        renderQuestionContent: (_, ...style) => {
            body = <React.Fragment key="question-body">{renderQuestionBody(...style)}</React.Fragment>;
            return '<deck-question></deck-question>';
        },
    });
    return <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
        {watermark}{classicPreview(markup, body)}
    </div>;
}
