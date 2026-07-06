import React from 'react';

// Math helpers to map PPTX inches to CSS percentages
const x = (val) => `${(val / 10) * 100}%`;
const y = (val) => `${(val / 5.625) * 100}%`;
const w = (val) => `${(val / 10) * 100}%`;
const h = (val) => `${(val / 5.625) * 100}%`;
const fs = (pt) => `${pt * 0.1388}cqw`;

export default function LiveSlidePreview({ theme, type = 'title', config, questionData, layoutId }) {
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

    const renderModernSidebarTitle = () => (
        <>
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.cyan}` }}></div>
            <div style={{ position: 'absolute', left: x(0.1), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(-0.5), top: y(4.5), width: w(2.5), height: h(2.5), backgroundColor: `#${theme.tealDecor}`, opacity: 0.3, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', left: x(8.5), top: y(-1), width: w(3), height: h(3), backgroundColor: `#${theme.decorPurple}`, opacity: 0.25, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', left: x(9), top: y(0.5), width: w(1.5), height: h(1.5), border: `0.4cqw solid #${theme.gold}`, borderRadius: '50%', boxSizing: 'border-box' }}></div>

            <div style={{ position: 'absolute', left: x(1.2), top: y(1.5), width: w(8), height: h(1.5), fontSize: fs(60), fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
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
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.cyan}` }}></div>
            <div style={{ position: 'absolute', left: x(0.1), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(-0.5), top: y(4.5), width: w(2.5), height: h(2.5), backgroundColor: `#${theme.tealDecor}`, opacity: 0.3, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', left: x(8.5), top: y(-1), width: w(3), height: h(3), backgroundColor: `#${theme.decorPurple}`, opacity: 0.25, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', left: x(9), top: y(0.5), width: w(1.5), height: h(1.5), border: `0.4cqw solid #${theme.gold}`, borderRadius: '50%', boxSizing: 'border-box' }}></div>

            <div style={{ position: 'absolute', left: x(5.5), top: y(3.5), width: w(4), height: h(2), fontSize: fs(90), fontWeight: 'bold', color: `#${theme.purple}`, opacity: 0.15, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', lineHeight: 1 }}>{questionData?.badge}</div>
            <div style={{ position: 'absolute', left: x(1.2), top: y(0.6), width: w(1.2), height: h(0.4), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
            
            <div style={{ position: 'absolute', left: x(2.6), top: y(0.785), width: w(2.5), height: h(0.03), backgroundColor: `#${theme.cyan}` }}></div>
            <div style={{ position: 'absolute', left: x(5.1), top: y(0.785), width: w(1.5), height: h(0.03), backgroundColor: `#${theme.purple}` }}></div>

            <div style={{ position: 'absolute', left: x(6.8), top: y(0.6), width: w(2.8), height: h(0.4), backgroundColor: `#${theme.bgCard}`, border: `0.15cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(14), color: `#${theme.purple}`, boxSizing: 'border-box' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ position: 'absolute', left: x(1.2), top: y(1.4), width: w(8.4), height: h(3.8), textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(24), lineHeight: 1.4 }}>{questionData?.qText}</div>
                {questionData?.options && (
                    <div style={{ color: `#${theme.cyan}`, fontSize: fs(18), marginTop: '1.5cqw', lineHeight: 1.4 }}>{questionData?.options}</div>
                )}
            </div>
        </>
    );

    const renderClassicHeaderTitle = () => (
        <>
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(10), height: h(2), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(0), top: y(1.9), width: w(10), height: h(0.1), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(0.5), top: y(0.3), width: w(9), height: h(1.2), fontSize: fs(50), fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
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
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(10), height: h(1.0), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(0), top: y(1.0), width: w(10), height: h(0.05), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(0.5), top: y(0.3), width: w(1.2), height: h(0.4), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
            <div style={{ position: 'absolute', left: x(6.7), top: y(0.3), width: w(2.8), height: h(0.4), backgroundColor: `#${theme.bgColor}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(14), color: `#${theme.purple}`, fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            <div style={{ position: 'absolute', left: x(0.5), top: y(1.3), width: w(9), height: h(4.0), textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(24), lineHeight: 1.4 }}>{questionData?.qText}</div>
                {questionData?.options && (
                    <div style={{ color: `#${theme.cyan}`, fontSize: fs(18), marginTop: '1.5cqw', lineHeight: 1.4 }}>{questionData?.options}</div>
                )}
            </div>
        </>
    );

    const renderSplitFocusTitle = () => (
        <>
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(4.5), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            <div style={{ position: 'absolute', left: x(4.5), top: y(0), width: w(0.05), height: h(5.625), backgroundColor: `#${theme.gold}` }}></div>

            <div style={{ position: 'absolute', left: x(0.8), top: y(2.0), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill1}</div>
            <div style={{ position: 'absolute', left: x(0.8), top: y(2.8), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.gold}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{config?.pill2}</div>

            <div style={{ position: 'absolute', left: x(5), top: y(1.5), width: w(4.5), height: h(2), fontSize: fs(54), fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: `#${theme.textWhite}` }}>{config?.mainTitle1}</span>
                <span style={{ color: `#${theme.cyan}` }}>{config?.mainTitle2}</span>
            </div>

            <div style={{ position: 'absolute', left: x(5), top: y(4.5), width: w(4.5), height: h(0.5), fontSize: fs(14), color: `#${theme.textWhite}`, letterSpacing: '0.2cqw', display: 'flex', alignItems: 'center' }}>{config?.footer}</div>
        </>
    );

    const renderSplitFocusQuestion = () => (
        <>
            {/* 30% left panel = 3.0in / 10in = 30% */}
            <div style={{ position: 'absolute', left: x(0), top: y(0), width: w(3.0), height: h(5.625), backgroundColor: `#${theme.purple}` }}></div>
            
            <div style={{ position: 'absolute', left: x(0.5), top: y(2.0), width: w(2.0), height: h(0.6), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(24), fontWeight: 'bold', color: `#${theme.textBlack}` }}>{questionData?.badge}</div>
            <div style={{ position: 'absolute', left: x(0.5), top: y(3.0), width: w(2.0), height: h(0.4), backgroundColor: `#${theme.bgColor}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(12), color: `#${theme.purple}`, fontWeight: 'bold' }}>{questionData?.tag?.toUpperCase()}</div>

            {/* 70% right panel */}
            <div style={{ position: 'absolute', left: x(3.3), top: y(0.5), width: w(6.4), height: h(4.6), textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                <div style={{ color: `#${theme.textWhite}`, fontSize: fs(24), lineHeight: 1.4 }}>{questionData?.qText}</div>
                {questionData?.options && (
                    <div style={{ color: `#${theme.gold}`, fontSize: fs(18), marginTop: '1.5cqw', lineHeight: 1.4 }}>{questionData?.options}</div>
                )}
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
