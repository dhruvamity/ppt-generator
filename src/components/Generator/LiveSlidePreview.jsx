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
    const { updateSlideQuestion, updateSlideOption, updateSlideTopic } = useStore();
    if (!theme) return null;

    const layoutType = layoutId || 'modern-sidebar';

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
            
            {/* Logo Placeholder */}
            <div style={{ position: 'absolute', left: x(0.3), top: y(5.2), width: w(3.0), height: h(0.25), fontSize: fs(10), color: `#${theme.textWhite}`, opacity: 0.6, display: 'flex', alignItems: 'center', letterSpacing: '0.1cqw' }}>
                <strong style={{ color: `#${theme.cyan}` }}>SLIDEGEN</strong>&nbsp;PRO
            </div>
        </>
    );

    const renderOptionsGrid = (options, color, slideIndex) => {
        if (!options || !Array.isArray(options) || options.length === 0) return null;
        
        const totalChars = options.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
        const cols = totalChars < 60 && options.length === 4 ? 4 : 2;

        return (
            <div style={{ marginTop: '2em', display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', gap: '1rem' }}>
                {options.map((opt, i) => (
                    <div key={i} style={{ width: cols === 4 ? '23%' : '48%', marginBottom: '0.25rem', color: `#${color}`, fontSize: fs(11), lineHeight: 1.5 }}>
                        <strong>({opt.label})</strong> 
                        <EditableBlock 
                            value={opt.text} 
                            theme={theme}
                            onChange={(newVal) => updateSlideOption(slideIndex, i, newVal)} 
                            style={{ display: 'inline-block', width: '80%', verticalAlign: 'top' }}
                        />
                    </div>
                ))}
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
            
            <div style={{ position: 'absolute', left: x(0.4), top: y(0.2), width: w(0.6), height: h(0.25), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
            
            <div style={{ position: 'absolute', left: x(1.2), top: y(0.7), width: w(8.6), height: h(0.02), backgroundColor: `#${theme.cyan}`, opacity: 0.5 }}></div>

            {/* Tag repositioned to bottom right */}
            <div style={{ position: 'absolute', left: x(7.5), top: y(5.1), width: w(2.0), height: h(0.25), backgroundColor: `#${theme.bgCard}`, border: `0.1cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(10), color: `#${theme.purple}`, boxSizing: 'border-box', fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '40px', paddingTop: '100px', boxSizing: 'border-box' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    <EditableBlock 
                        value={questionData?.qText} 
                        theme={theme}
                        onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} 
                    />
                </div>
                {renderOptionsGrid(questionData?.options, theme.cyan, questionData?.index)}
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

            <div style={{ position: 'absolute', left: x(0.4), top: y(0.2), width: w(0.6), height: h(0.25), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
            
            <div style={{ position: 'absolute', left: x(1.2), top: y(0.7), width: w(8.6), height: h(0.02), backgroundColor: `#${theme.cyan}`, opacity: 0.5 }}></div>

            <div style={{ position: 'absolute', left: x(7.5), top: y(5.1), width: w(2.0), height: h(0.25), backgroundColor: `#${theme.bgColor}`, border: `0.1cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(10), color: `#${theme.purple}`, fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '40px', paddingTop: '100px', boxSizing: 'border-box' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    <EditableBlock 
                        value={questionData?.qText} 
                        theme={theme}
                        onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} 
                    />
                </div>
                {renderOptionsGrid(questionData?.options, theme.cyan, questionData?.index)}
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
            
            <div style={{ position: 'absolute', left: x(0.4), top: y(0.2), width: w(0.6), height: h(0.25), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
            
            <div style={{ position: 'absolute', left: x(1.2), top: y(0.7), width: w(8.6), height: h(0.02), backgroundColor: `#${theme.cyan}`, opacity: 0.5 }}></div>

            <div style={{ position: 'absolute', left: x(7.5), top: y(5.1), width: w(2.0), height: h(0.25), backgroundColor: `#${theme.bgColor}`, border: `0.1cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(10), color: `#${theme.purple}`, fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '40px', paddingTop: '100px', boxSizing: 'border-box' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    <EditableBlock 
                        value={questionData?.qText} 
                        theme={theme}
                        onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} 
                    />
                </div>
                {renderOptionsGrid(questionData?.options, theme.gold, questionData?.index)}
            </div>
        </>
    );

    const renderModernNeonDecorations = (isWorkspace, qNum) => (
        <>
            <div style={{ position: 'absolute', right: x(-1.0), top: y(-1.5), width: w(4.0), height: h(4.0), backgroundColor: `#${theme.purple}`, border: `1.5cqw solid #${theme.gold}`, borderRadius: '50%', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', left: x(-1.5), bottom: y(-2.0), width: w(4.0), height: h(4.0), backgroundColor: `#${theme.cyan}`, borderRadius: '50%', zIndex: 0 }}></div>
            {!isWorkspace && qNum && <div style={{ position: 'absolute', right: x(0.5), bottom: y(0.8), fontSize: fs(150), fontWeight: 'bold', color: `#${theme.watermark}`, opacity: 0.1, zIndex: 0, lineHeight: 1 }}>{qNum}</div>}
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '40%', height: h(0.4), backgroundColor: `#${theme.magenta}`, zIndex: 1 }}></div>
            <div style={{ position: 'absolute', left: '40%', bottom: 0, width: '60%', height: h(0.4), backgroundColor: `#${theme.purple}`, zIndex: 1 }}></div>
        </>
    );

    const renderModernNeonTitle = () => (
        <>
            {renderModernNeonDecorations(false, '')}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textWhite}`, textAlign: 'center', marginBottom: '20px' }}>
                    {config?.mainTitle1} <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ backgroundColor: `#${theme.cyan}`, padding: '10px 30px', borderRadius: '8px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
                    <div style={{ border: `2px solid #${theme.magenta}`, padding: '10px 30px', borderRadius: '8px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.magenta}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '40px', fontSize: fs(18), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw' }}>{config?.footer}</div>
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
            bodyContent = <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 49px, #${theme.watermark} 49px, #${theme.watermark} 50px)` }}></div>;
        } else {
            bodyContent = (
                <>
                    <div style={{ color: `#${theme.textWhite}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        <EditableBlock 
                            value={questionData?.qText} 
                            theme={theme}
                            onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} 
                        />
                    </div>
                    {renderOptionsGrid(questionData?.options, theme.textWhite, questionData?.index)}
                </>
            );
        }

        return (
            <>
                {renderModernNeonDecorations(isWorkspace, qNum)}
                <div style={{ position: 'absolute', left: x(0.5), top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: w(9.0) }}>
                    {isWorkspace 
                        ? <div style={{ fontSize: fs(14), fontWeight: 'bold', color: `#${theme.gold}`, paddingRight: '15px' }}>WORK SPACE</div>
                        : <div style={{ backgroundColor: `#${theme.cyan}`, padding: '5px 20px', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textBlack}`, borderRadius: '8px 0 0 8px' }}>{headerText}</div>
                    }
                    <div style={{ flexGrow: 1, height: '2px', backgroundColor: `#${accentColor}` }}></div>
                    <div style={{ backgroundColor: `#${theme.bgColor}`, border: `1px solid #${theme.cyan}`, padding: '5px 15px', fontSize: fs(10), fontWeight: 'bold', color: `#${theme.textWhite}`, marginLeft: '10px' }}>{(questionData?.tag || '').toUpperCase()}</div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '120px 60px 60px 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderBlueprintDecorations = () => (
        <>
            <div style={{ position: 'absolute', left: '16px', top: '16px', right: '16px', bottom: '16px', border: `2px solid #${theme.cyan}`, zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', left: '8px', top: '8px', width: '40px', height: '40px', borderTop: `4px solid #${theme.orange}`, borderLeft: `4px solid #${theme.orange}`, zIndex: 1 }}></div>
            <div style={{ position: 'absolute', right: '8px', bottom: '8px', width: '40px', height: '40px', borderBottom: `4px solid #${theme.orange}`, borderRight: `4px solid #${theme.orange}`, zIndex: 1 }}></div>
        </>
    );

    const renderBlueprintTitle = () => (
        <>
            {renderBlueprintDecorations()}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textWhite}`, textAlign: 'center', marginBottom: '20px' }}>
                    {config?.mainTitle1} <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ backgroundColor: `#${theme.orange}`, padding: '10px 30px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
                    <div style={{ border: `2px solid #${theme.cyan}`, padding: '10px 30px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textWhite}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '40px', fontSize: fs(18), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderBlueprintQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `linear-gradient(rgba(0, 255, 204, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>;
        } else {
            bodyContent = (
                <>
                    <div style={{ color: `#${theme.textWhite}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        <EditableBlock value={questionData?.qText} theme={theme} onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} />
                    </div>
                    {renderOptionsGrid(questionData?.options, theme.cyan, questionData?.index)}
                </>
            );
        }
        return (
            <>
                {renderBlueprintDecorations()}
                <div style={{ position: 'absolute', left: x(0.5), top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: w(9.0) }}>
                    <div style={{ backgroundColor: `#${theme.orange}`, padding: '5px 20px', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{headerText}</div>
                    <div style={{ backgroundColor: `#${theme.bgColor}`, border: `1px solid #${theme.cyan}`, padding: '5px 15px', fontSize: fs(10), fontWeight: 'bold', color: `#${theme.textWhite}`, marginLeft: '10px' }}>{(questionData?.tag || '').toUpperCase()}</div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '120px 60px 60px 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderAuroraDecorations = () => (
        <>
            <div style={{ position: 'absolute', left: '-100px', top: '-100px', width: '400px', height: '400px', backgroundColor: `#${theme.blueOrb}`, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', right: '-100px', bottom: '-100px', width: '400px', height: '400px', backgroundColor: `#${theme.pinkOrb}`, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%', zIndex: 0 }}></div>
        </>
    );

    const renderAuroraTitle = () => (
        <>
            {renderAuroraDecorations()}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textWhite}`, textAlign: 'center', marginBottom: '20px' }}>
                    {config?.mainTitle1} <span style={{ color: `#${theme.pinkOrb}` }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 30px', borderRadius: '50px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textWhite}` }}>{config?.pill1}</div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 30px', borderRadius: '50px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textWhite}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '40px', fontSize: fs(18), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderAuroraQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `radial-gradient(#${theme.dot} 2px, transparent 2px)`, backgroundSize: '40px 40px' }}></div>;
        } else {
            bodyContent = (
                <>
                    <div style={{ color: `#${theme.textWhite}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        <EditableBlock value={questionData?.qText} theme={theme} onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} />
                    </div>
                    {renderOptionsGrid(questionData?.options, theme.textWhite, questionData?.index)}
                </>
            );
        }
        return (
            <>
                {renderAuroraDecorations()}
                <div style={{ position: 'absolute', left: x(0.5), top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: w(9.0) }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 20px', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textWhite}`, borderRadius: '50px' }}>{headerText}</div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 15px', fontSize: fs(10), fontWeight: 'bold', color: `#${theme.textWhite}`, marginLeft: '10px', borderRadius: '50px' }}>{(questionData?.tag || '').toUpperCase()}</div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '120px 60px 60px 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderNeoBrutalismDecorations = () => (
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '10%', backgroundColor: `#${theme.pink}`, borderTop: `3px solid #${theme.black}`, zIndex: 1 }}></div>
    );
    const shadowStyle = `6px 6px 0 0 #${theme.black}`;

    const renderNeoBrutalismTitle = () => (
        <>
            {renderNeoBrutalismDecorations()}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ fontSize: fs(60), fontWeight: 'bold', color: `#${theme.textBlack}`, textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase' }}>
                    {config?.mainTitle1} <span style={{ backgroundColor: `#${theme.acidGreen}`, padding: '0 10px', border: `3px solid #${theme.black}`, boxShadow: shadowStyle }}>{config?.mainTitle2}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ backgroundColor: `#${theme.acidGreen}`, border: `3px solid #${theme.black}`, boxShadow: shadowStyle, padding: '10px 30px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
                    <div style={{ backgroundColor: `#${theme.bgColor}`, border: `3px solid #${theme.black}`, boxShadow: shadowStyle, padding: '10px 30px', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill2}</div>
                </div>
                <div style={{ marginTop: '40px', fontSize: fs(18), color: `#${theme.textBlack}`, fontWeight: 'bold' }}>{config?.footer}</div>
            </div>
        </>
    );

    const renderNeoBrutalismQuestion = () => {
        const isWorkspace = questionData?.isWorkspace || false;
        const headerText = isWorkspace ? 'WORK SPACE' : questionData?.badge || 'Q';
        let bodyContent;
        if (isWorkspace) {
            bodyContent = <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 59px, #${theme.black} 59px, #${theme.black} 60px)` }}></div>;
        } else {
            bodyContent = (
                <>
                    <div style={{ color: `#${theme.textBlack}`, fontSize: fs(11), lineHeight: 1.5, whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
                        <EditableBlock value={questionData?.qText} theme={theme} onChange={(newVal) => updateSlideQuestion(questionData?.index, newVal)} />
                    </div>
                    {renderOptionsGrid(questionData?.options, theme.textBlack, questionData?.index)}
                </>
            );
        }
        return (
            <>
                {renderNeoBrutalismDecorations()}
                <div style={{ position: 'absolute', left: 0, top: y(0.5), display: 'flex', alignItems: 'center', zIndex: 10, width: '100%', padding: '0 60px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: `#${theme.acidGreen}`, border: `3px solid #${theme.black}`, boxShadow: shadowStyle, padding: '5px 20px', fontSize: fs(14), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{headerText}</div>
                    <div style={{ flexGrow: 1, height: '3px', backgroundColor: `#${theme.black}`, margin: '0 20px' }}></div>
                    <div style={{ backgroundColor: `#${theme.bgColor}`, border: `3px solid #${theme.black}`, boxShadow: shadowStyle, padding: '5px 15px', fontSize: fs(10), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{(questionData?.tag || '').toUpperCase()}</div>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: '120px 60px 10% 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', zIndex: 10 }}>
                    {bodyContent}
                </div>
            </>
        );
    };

    const renderTopicTag = () => {
        if (type === 'title' || questionData?.isWorkspace) return null;
        let color = theme.cyan || theme.gold || theme.blueOrb || theme.acidGreen || theme.textWhite;
        if (theme.name === 'Neo-Brutalism') color = theme.textBlack;
        
        return (
            <div style={{ position: 'absolute', bottom: '15px', right: '30px', zIndex: 20, fontSize: fs(10), fontWeight: 'bold', color: `#${color}`, opacity: 0.8, backgroundColor: 'transparent' }}>
                <EditableBlock 
                    value={questionData?.topic || "General Practice"} 
                    theme={theme}
                    onChange={(newVal) => updateSlideTopic(questionData?.index, newVal)} 
                />
            </div>
        );
    };

    if (theme.name === 'Blueprint Architect') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
                {type === 'title' ? renderBlueprintTitle() : renderBlueprintQuestion()}
                {renderTopicTag()}
            </div>
        );
    }

    if (theme.name === 'Aurora Glassmorphism') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
                {type === 'title' ? renderAuroraTitle() : renderAuroraQuestion()}
                {renderTopicTag()}
            </div>
        );
    }

    if (theme.name === 'Neo-Brutalism') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
                {type === 'title' ? renderNeoBrutalismTitle() : renderNeoBrutalismQuestion()}
                {renderTopicTag()}
            </div>
        );
    }

    if (theme.name === 'Cyberpunk Neon') {
        return (
            <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
                {type === 'title' ? renderModernNeonTitle() : renderModernNeonQuestion()}
                {renderTopicTag()}
            </div>
        );
    }

    return (
        <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
            {type === 'title' && layoutType === 'modern-sidebar' && renderModernSidebarTitle()}
            {type === 'question' && layoutType === 'modern-sidebar' && renderModernSidebarQuestion()}
            
            {type === 'title' && layoutType === 'classic-header' && renderClassicHeaderTitle()}
            {type === 'question' && layoutType === 'classic-header' && renderClassicHeaderQuestion()}
            
            {type === 'title' && layoutType === 'split-focus' && renderSplitFocusTitle()}
            {type === 'question' && layoutType === 'split-focus' && renderSplitFocusQuestion()}
            
            {renderTopicTag()}
        </div>
    );
}

