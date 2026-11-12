import { teachingStyles, teachingIllustrationStyle, previewStyle } from '../../utils/teachingDesign.js';
import { signatureSlide } from '../../utils/signatureDesigns.js';
import { watermarkStyle } from '../../utils/watermark.js';
import React from 'react';
import EditableBlock from './EditableBlock';
import { useStore } from '../../store/useStore';

// Math helpers to map PPTX inches to CSS percentages
const x = (val) => `${(val / 10) * 100}%`;
const y = (val) => `${(val / 5.625) * 100}%`;
const w = (val) => `${(val / 10) * 100}%`;
const h = (val) => `${(val / 5.625) * 100}%`;
const fs = (pt) => `${pt * 0.1388}cqw`;

export default function LiveSlidePreview({ theme, type = 'title', config, questionData, layoutId }) {
    const { updateSlideQuestion, updateSlideContext, updateSlideOption } = useStore();
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

    const renderGlobalDecorations = () => (
        <>
            {/* Corner floating ellipses */}
            <div style={{ position: 'absolute', left: x(-0.5), top: y(-0.5), width: w(2.0), height: h(2.0), backgroundColor: `#${theme.tealDecor}`, opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', left: x(8.5), top: y(4.125), width: w(2.0), height: h(2.0), backgroundColor: `#${theme.decorPurple}`, opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }}></div>
            
            {/* Bottom Ribbon */}
            <div style={{ position: 'absolute', left: x(0), top: y(5.5), width: w(10), height: h(0.125), backgroundColor: `#${theme.gold}`, opacity: 0.8 }}></div>
            
        </>
    );

    const renderOptionsGrid = (options, color, slideIndex) => {
        if (!options || !Array.isArray(options) || options.length === 0) return null;
        
        const totalChars = options.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
        const hasContext = Boolean(questionData?.context?.trim());
        const cols = hasContext && totalChars > 160 ? 1 : !hasContext && totalChars < 60 && options.length === 4 ? 4 : 2;

        return (
            <div style={{ marginTop: '2.4cqw', display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, width: '100%', gap: '1.2cqw' }}>
                {options.map((opt, i) => (
                    <div key={i} style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: '0.4em', color: `#${color}`, fontSize: theme.teaching ? '2.1875cqw' : fs(11), lineHeight: 1.5 }}>
                        <strong style={{ whiteSpace: 'nowrap' }}>({opt.label})</strong> 
                        <EditableBlock 
                            value={opt.text} 
                            theme={theme}
                            onChange={(newVal) => updateSlideOption(slideIndex, i, newVal)} 
                            style={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere', lineHeight: 1.5 }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const renderQuestionBody = (optionColor, textColor = theme.textWhite, bold = false) => {
        const promptAndOptions = (
            <div style={{ minWidth: 0 }}>
                <div style={{ color: `#${textColor}`, fontSize: theme.teaching ? '2.5cqw' : fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap', fontWeight: bold ? 'bold' : 'normal' }}>
                    <EditableBlock
                        value={questionData?.qText}
                        theme={theme}
                        onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)}
                    />
                </div>
                {renderOptionsGrid(questionData?.options, optionColor, questionData?.index)}
            </div>
        );

        if (!questionData?.context?.trim()) return promptAndOptions;

        const accent = theme.cyan || theme.blueOrb || theme.black || textColor;
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.48fr) minmax(0, 0.52fr)', gap: '2.5cqw', width: '100%', height: '100%', minHeight: 0 }}>
                <div style={{ boxSizing: 'border-box', height: '100%', minWidth: 0, paddingRight: '1.875cqw', borderRight: `0.08cqw solid #${accent}`, color: `#${textColor}`, fontSize: theme.teaching ? '1.875cqw' : fs(10), lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                    <EditableBlock
                        value={questionData.context}
                        renderTables
                        style={{ lineHeight: 1.45 }}
                        theme={theme}
                        onChange={(newVal) => updateSlideContext(questionData?.index, newVal)}
                    />
                </div>
                {promptAndOptions}
            </div>
        );
    };

    const renderModernSidebarTitle = () => (
        <>
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(0.05), height: h(5.625), backgroundColor: `#${theme.cyan}` }}></div>
            <div style={{ position: 'absolute', left: x(0.05), top: y(0), width: w(0.05), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            
            <div style={{ position: 'absolute', left: x(1.2), top: y(1.5), width: w(8), height: h(1.5), fontSize: fs(54), fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle1}&nbsp;</span>
                <span style={{ color: `#${theme.gold}` }}>{config?.mainTitle2}</span>
            </div>

            <div style={{ position: 'absolute', left: x(1.2), top: y(3.0), width: w(6.5), height: h(0.04), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(1.2), top: y(3.4), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.cyan}`, borderRadius: '1.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
            <div style={{ position: 'absolute', left: x(4.4), top: y(3.4), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.bgColor}`, border: `0.25cqw solid #${theme.purple}`, borderRadius: '1.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.purple}`, boxSizing: 'border-box' }}>{config?.pill2}</div>
            <div style={{ position: 'absolute', left: x(1.2), top: y(4.2), width: w(8), height: h(0.5), fontSize: fs(16), color: `#${theme.textWhite}`, letterSpacing: '0.3cqw', display: 'flex', alignItems: 'center' }}>{config?.footer}</div>
        </>
    );

    const renderModernSidebarQuestion = () => (
        <>
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(0.05), height: h(5.625), backgroundColor: `#${theme.cyan}` }}></div>
            <div style={{ position: 'absolute', left: x(0.05), top: y(0), width: w(0.05), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            
            <div style={{ position: 'absolute', left: x(0.4), top: y(0.2), right: x(0.2), height: h(0.25), display: 'flex', alignItems: 'center' }}>
                <div style={{ width: w(0.6), height: '100%', backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
                <div style={{ flex: 1, height: h(0.02), marginLeft: x(0.2), backgroundColor: `#${theme.cyan}`, opacity: 0.5 }}></div>
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '3.125cqw', paddingTop: '5cqw', boxSizing: 'border-box' }}>
                {renderQuestionBody(theme.cyan)}
            </div>
        </>
    );

    const renderClassicHeaderTitle = () => (
        <>
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(10), height: h(2), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(0), top: y(1.9), width: w(10), height: h(0.1), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(0.5), top: y(0.3), width: w(9), height: h(1.2), fontSize: fs(45), fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{ color: `#${theme.textBlack}` }}>{config?.mainTitle1}&nbsp;</span>
                <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
            </div>

            <div style={{ position: 'absolute', left: x(2), top: y(2.8), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
            <div style={{ position: 'absolute', left: x(5.2), top: y(2.8), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill2}</div>
            <div style={{ position: 'absolute', left: x(0.5), top: y(4.5), width: w(9), height: h(0.5), fontSize: fs(16), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{config?.footer}</div>
        </>
    );

    const renderClassicHeaderQuestion = () => (
        <>
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(10), height: h(0.05), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(0), top: y(0.05), width: w(10), height: h(0.02), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(0.4), top: y(0.2), right: x(0.2), height: h(0.25), display: 'flex', alignItems: 'center' }}>
                <div style={{ width: w(0.6), height: '100%', backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
                <div style={{ flex: 1, height: h(0.02), marginLeft: x(0.2), backgroundColor: `#${theme.cyan}`, opacity: 0.5 }}></div>
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '3.125cqw', paddingTop: '5cqw', boxSizing: 'border-box' }}>
                {renderQuestionBody(theme.cyan)}
            </div>
        </>
    );

    const renderSplitFocusTitle = () => (
        <>
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(4.5), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(4.5), top: y(0), width: w(0.05), height: h(5.625), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(0.8), top: y(2.0), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
            <div style={{ position: 'absolute', left: x(0.8), top: y(2.8), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.gold}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill2}</div>

            <div style={{ position: 'absolute', left: x(5), top: y(1.5), width: w(4.5), height: h(2), fontSize: fs(49), fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: `#${theme.textWhite}` }}>{config?.mainTitle1}</span>
                <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
            </div>

            <div style={{ position: 'absolute', left: x(5), top: y(4.5), width: w(4.5), height: h(0.5), fontSize: fs(14), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw', display: 'flex', alignItems: 'center' }}>{config?.footer}</div>
        </>
    );

    const renderSplitFocusQuestion = () => (
        <>
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            
            <div style={{ position: 'absolute', left: x(0.4), top: y(0.2), right: x(0.2), height: h(0.25), display: 'flex', alignItems: 'center' }}>
                <div style={{ width: w(0.6), height: '100%', backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
                <div style={{ flex: 1, height: h(0.02), marginLeft: x(0.2), backgroundColor: `#${theme.cyan}`, opacity: 0.5 }}></div>
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '3.125cqw', paddingTop: '5cqw', boxSizing: 'border-box' }}>
                {renderQuestionBody(theme.gold)}
            </div>
        </>
    );

    const renderModernNeonDecorations = (isWorkspace, qNum, isTitle = false) => (
        <>
            <div style={{ position: 'absolute', right: x(-1.0), top: y(isTitle ? -1.5 : -3.5), width: w(4.0), height: h(4.0), backgroundColor: `#${theme.purple}`, border: `1.5cqw solid #${theme.gold}`, borderRadius: '50%', opacity: isTitle ? 1 : 0.16, zIndex: 0 }}></div>
            <div style={{ position: 'absolute', left: x(-1.5), bottom: y(isTitle ? -2.0 : -3.0), width: w(4.0), height: h(4.0), backgroundColor: `#${theme.cyan}`, borderRadius: '50%', opacity: isTitle ? 1 : 0.16, zIndex: 0 }}></div>
            {!isWorkspace && qNum && <div style={{ position: 'absolute', right: x(0.5), bottom: y(0.8), fontSize: fs(150), fontWeight: 'bold', color: `#${theme.watermark}`, opacity: 0.1, zIndex: 0, lineHeight: 1 }}>{qNum}</div>}
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '40%', height: h(0.4), backgroundColor: `#${theme.magenta}`, zIndex: 1 }}></div>
            <div style={{ position: 'absolute', left: '40%', bottom: 0, width: '60%', height: h(0.4), backgroundColor: `#${theme.purple}`, zIndex: 1 }}></div>
        </>
    );

    const renderModernNeonTitle = () => (
        <>
            {renderModernNeonDecorations(false, '', true)}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textWhite}`, textAlign: 'center', marginBottom: '1.5625cqw' }}>
                    {config?.mainTitle1} <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5625cqw' }}>
                    <div style={{ backgroundColor: `#${theme.cyan}`, padding: '0.78125cqw 2.34375cqw', borderRadius: '0.625cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
                    <div style={{ border: `0.15625cqw solid #${theme.magenta}`, padding: '0.78125cqw 2.34375cqw', borderRadius: '0.625cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.magenta}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '3.125cqw', fontSize: fs(18), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderModernNeonQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const accentColor = isWorkspace ? theme.gold : theme.cyan;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        const qNum = questionData?.badge ? questionData.badge.replace('Q.', 'Q') : 'Q1';

        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 3.82812cqw, #${theme.watermark} 3.82812cqw, #${theme.watermark} 3.90625cqw)` }}></div>;
        } else {
            bodyContent = (
                renderQuestionBody(theme.textWhite)
            );
        }

        return (
            <>
                {renderModernNeonDecorations(isWorkspace, qNum)}
                <div style={{ position: 'absolute', left: x(0.5), top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: w(9.0) }}>
                    {isWorkspace 
                        ? <div style={{ fontSize: fs(14), fontWeight: 'bold', color: `#${theme.gold}`, paddingRight: '1.17188cqw' }}>WORK SPACE</div>
                        : <div style={{ backgroundColor: `#${theme.cyan}`, padding: '0.390625cqw 1.5625cqw', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textBlack}`, borderRadius: '0.625cqw 0 0 0.625cqw' }}>{headerText}</div>
                    }
                    <div style={{ flexGrow: 1, height: '0.15625cqw', backgroundColor: `#${accentColor}` }}></div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '9.375cqw 4.6875cqw 4.6875cqw 4.6875cqw', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderBlueprintDecorations = () => (
        <>
            <div style={{ position: 'absolute', left: '1.25cqw', top: '1.25cqw', right: '1.25cqw', bottom: '1.25cqw', border: `0.15625cqw solid #${theme.cyan}`, zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', left: '0.625cqw', top: '0.625cqw', width: '3.125cqw', height: '3.125cqw', borderTop: `0.3125cqw solid #${theme.orange}`, borderLeft: `0.3125cqw solid #${theme.orange}`, zIndex: 1 }}></div>
            <div style={{ position: 'absolute', right: '0.625cqw', bottom: '0.625cqw', width: '3.125cqw', height: '3.125cqw', borderBottom: `0.3125cqw solid #${theme.orange}`, borderRight: `0.3125cqw solid #${theme.orange}`, zIndex: 1 }}></div>
        </>
    );

    const renderBlueprintTitle = () => (
        <>
            {renderBlueprintDecorations()}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textWhite}`, textAlign: 'center', marginBottom: '1.5625cqw' }}>
                    {config?.mainTitle1} <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5625cqw' }}>
                    <div style={{ backgroundColor: `#${theme.orange}`, padding: '0.78125cqw 2.34375cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
                    <div style={{ border: `0.15625cqw solid #${theme.cyan}`, padding: '0.78125cqw 2.34375cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textWhite}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '3.125cqw', fontSize: fs(18), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderBlueprintQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `linear-gradient(rgba(0, 255, 204, 0.1) 0.078125cqw, transparent 0.078125cqw), linear-gradient(90deg, rgba(0, 255, 204, 0.1) 0.078125cqw, transparent 0.078125cqw)`, backgroundSize: '3.125cqw 3.125cqw' }}></div>;
        } else {
            bodyContent = renderQuestionBody(theme.cyan);
        }
        return (
            <>
                {renderBlueprintDecorations()}
                <div style={{ position: 'absolute', left: x(0.5), top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: w(9.0) }}>
                    <div style={{ backgroundColor: `#${theme.orange}`, padding: '0.390625cqw 1.5625cqw', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{headerText}</div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '9.375cqw 4.6875cqw 4.6875cqw 4.6875cqw', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderAuroraDecorations = () => (
        <>
            <div style={{ position: 'absolute', left: '-7.8125cqw', top: '-7.8125cqw', width: '31.25cqw', height: '31.25cqw', backgroundColor: `#${theme.blueOrb}`, filter: 'blur(6.25cqw)', opacity: 0.3, borderRadius: '50%', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', right: '-7.8125cqw', bottom: '-7.8125cqw', width: '31.25cqw', height: '31.25cqw', backgroundColor: `#${theme.pinkOrb}`, filter: 'blur(6.25cqw)', opacity: 0.3, borderRadius: '50%', zIndex: 0 }}></div>
        </>
    );

    const renderAuroraTitle = () => (
        <>
            {renderAuroraDecorations()}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textWhite}`, textAlign: 'center', marginBottom: '1.5625cqw' }}>
                    {config?.mainTitle1} <span style={{ color: `#${theme.pinkOrb}` }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5625cqw' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(0.9375cqw)', border: '0.078125cqw solid rgba(255,255,255,0.2)', padding: '0.78125cqw 2.34375cqw', borderRadius: '3.90625cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textWhite}` }}>{config?.pill1}</div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(0.9375cqw)', border: '0.078125cqw solid rgba(255,255,255,0.2)', padding: '0.78125cqw 2.34375cqw', borderRadius: '3.90625cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textWhite}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '3.125cqw', fontSize: fs(18), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderAuroraQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `radial-gradient(#${theme.dot} 0.15625cqw, transparent 0.15625cqw)`, backgroundSize: '3.125cqw 3.125cqw' }}></div>;
        } else {
            bodyContent = renderQuestionBody(theme.textWhite);
        }
        return (
            <>
                {renderAuroraDecorations()}
                <div style={{ position: 'absolute', left: x(0.5), top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: w(9.0) }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(0.9375cqw)', border: '0.078125cqw solid rgba(255,255,255,0.2)', padding: '0.390625cqw 1.5625cqw', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textWhite}`, borderRadius: '3.90625cqw' }}>{headerText}</div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '9.375cqw 4.6875cqw 4.6875cqw 4.6875cqw', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderNeoBrutalismDecorations = () => (
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '10%', backgroundColor: `#${theme.pink}`, borderTop: `0.234375cqw solid #${theme.black}`, zIndex: 1 }}></div>
    );
    const shadowStyle = `0.46875cqw 0.46875cqw 0 0 #${theme.black}`;

    const renderNeoBrutalismTitle = () => (
        <>
            {renderNeoBrutalismDecorations()}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textBlack}`, textAlign: 'center', marginBottom: '1.5625cqw', textTransform: 'uppercase' }}>
                    {config?.mainTitle1} <span style={{ backgroundColor: `#${theme.acidGreen}`, padding: '0 0.78125cqw', border: `0.234375cqw solid #${theme.black}`, boxShadow: shadowStyle }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5625cqw' }}>
                    <div style={{ backgroundColor: `#${theme.acidGreen}`, border: `0.234375cqw solid #${theme.black}`, boxShadow: shadowStyle, padding: '0.78125cqw 2.34375cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
                    <div style={{ backgroundColor: `#${theme.bgColor}`, border: `0.234375cqw solid #${theme.black}`, boxShadow: shadowStyle, padding: '0.78125cqw 2.34375cqw', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '3.125cqw', fontSize: fs(18), color: `#${theme.textBlack}`, fontWeight: 'bold' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderNeoBrutalismQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 4.60938cqw, #${theme.black} 4.60938cqw, #${theme.black} 4.6875cqw)` }}></div>;
        } else {
            bodyContent = renderQuestionBody(theme.textBlack, theme.textBlack, true);
        }
        return (
            <>
                {renderNeoBrutalismDecorations()}
                <div style={{ position: 'absolute', left: 0, top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: '100%', padding: '0 4.6875cqw', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: `#${theme.acidGreen}`, border: `0.234375cqw solid #${theme.black}`, boxShadow: shadowStyle, padding: '0.390625cqw 1.5625cqw', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{headerText}</div>
                    <div style={{ flexGrow: 1, height: '0.234375cqw', backgroundColor: `#${theme.black}`, margin: '0 1.5625cqw' }}></div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '9.375cqw 4.6875cqw 10% 4.6875cqw', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
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

    if (theme.name === 'Blueprint Architect') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
                {type === 'title' ? renderBlueprintTitle() : renderBlueprintQuestion()}
            </div>
        );
    }

    if (theme.name === 'Aurora Glassmorphism') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
                {type === 'title' ? renderAuroraTitle() : renderAuroraQuestion()}
            </div>
        );
    }

    if (theme.name === 'Neo-Brutalism') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
                {type === 'title' ? renderNeoBrutalismTitle() : renderNeoBrutalismQuestion()}
            </div>
        );
    }

    if (theme.name === 'Cyberpunk Neon') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
                {type === 'title' ? renderModernNeonTitle() : renderModernNeonQuestion()}
            </div>
        );
    }

    // The original export already has this workspace composition for flexible themes.
    if (type === 'question' && questionData?.isWorkspace) {
        const color = theme.cyan || theme.gold || theme.textWhite;
        return <div style={baseStyle} className="rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
            {renderGlobalDecorations()}
            <div style={{ position: 'absolute', left: '5%', right: '5%', top: '6.2222%', display: 'flex', alignItems: 'center', gap: '1.40625cqw', zIndex: 2 }}>
                <div style={{ padding: '0.625cqw 1.40625cqw', border: `0.15625cqw solid #${color}`, borderRadius: '0.625cqw', color: `#${color}`, fontSize: fs(14), fontWeight: 'bold', letterSpacing: '0.078125cqw' }}>WORK SPACE</div>
                <div style={{ height: '0.15625cqw', flex: 1, background: `#${color}`, opacity: 0.7 }} />
            </div>
            <div style={{ position: 'absolute', left: '5%', right: '5%', top: '18.6667%', bottom: '9.7778%', background: `repeating-linear-gradient(to bottom, transparent 0, transparent 4.296875cqw, #${color} 4.375cqw, transparent 4.453125cqw)`, opacity: 0.38 }} />
        </div>;
    }

    return (
        <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">{watermark}
            {type === 'title' && layoutType === 'modern-sidebar' && renderModernSidebarTitle()}
            {type === 'question' && layoutType === 'modern-sidebar' && renderModernSidebarQuestion()}
            
            {type === 'title' && layoutType === 'classic-header' && renderClassicHeaderTitle()}
            {type === 'question' && layoutType === 'classic-header' && renderClassicHeaderQuestion()}
            
            {type === 'title' && layoutType === 'split-focus' && renderSplitFocusTitle()}
            {type === 'question' && layoutType === 'split-focus' && renderSplitFocusQuestion()}
            
        </div>
    );
}

