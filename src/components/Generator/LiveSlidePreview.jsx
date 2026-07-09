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
    const { updateSlideQuestion, updateSlideOption } = useStore();
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
        if (!options || options.length === 0) return null;
        
        const totalChars = options.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
        const cols = totalChars < 60 && options.length === 4 ? 4 : 2;

        return (
            <div style={{ marginTop: '2em', display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', gap: '1rem' }}>
                {options.map((opt, i) => (
                    <div key={i} style={{ width: cols === 4 ? '23%' : '48%', marginBottom: '0.25rem', color: `#${color}`, fontSize: fs(14), lineHeight: 1.5 }}>
                        <strong>({opt.label})</strong> 
                        <EditableBlock 
                            value={opt.text} 
                            theme={theme}
                            onChange={(newVal) => updateSlideOption(slideIndex, i, newVal)} 
                            style={{ display: 'inline' }}
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
            
            {/* Tag repositioned to bottom right */}
            <div style={{ position: 'absolute', left: x(7.5), top: y(5.1), width: w(2.0), height: h(0.25), backgroundColor: `#${theme.bgCard}`, border: `0.1cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(10), color: `#${theme.purple}`, boxSizing: 'border-box', fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ position: 'absolute', left: x(0.4), top: y(0.6), width: w(9.4), textAlign: 'left' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(14), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
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
            <div style={{ position: 'absolute', left: x(7.5), top: y(5.1), width: w(2.0), height: h(0.25), backgroundColor: `#${theme.bgColor}`, border: `0.1cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(10), color: `#${theme.purple}`, fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ position: 'absolute', left: x(0.4), top: y(0.6), width: w(9.4), textAlign: 'left' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(14), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
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
            <div style={{ position: 'absolute', left: x(7.5), top: y(5.1), width: w(2.0), height: h(0.25), backgroundColor: `#${theme.bgColor}`, border: `0.1cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(10), color: `#${theme.purple}`, fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ position: 'absolute', left: x(0.4), top: y(0.6), width: w(9.4), textAlign: 'left' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(14), lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
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

    return (
        <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
            {type === 'title' && layoutType === 'modern-sidebar' && renderModernSidebarTitle()}
            {type === 'question' && layoutType === 'modern-sidebar' && renderModernSidebarQuestion()}
            
            {type === 'title' && layoutType === 'classic-header' && renderClassicHeaderTitle()}
            {type === 'question' && layoutType === 'classic-header' && renderClassicHeaderQuestion()}
            
            {type === 'title' && layoutType === 'split-focus' && renderSplitFocusTitle()}
            {type === 'question' && layoutType === 'split-focus' && renderSplitFocusQuestion()}
        </div>
    );
}

