import React from 'react';

// Math helpers to map PPTX inches to CSS percentages
const x = (val) => `${(val / 10) * 100}%`;
const y = (val) => `${(val / 5.625) * 100}%`;
const w = (val) => `${(val / 10) * 100}%`;
const h = (val) => `${(val / 5.625) * 100}%`;
const fs = (pt) => `${pt * 0.1388}cqw`;

export default function LiveSlidePreview({ theme, type = 'title', config, questionData }) {
    if (!theme) return null;

    const baseStyle = {
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: `#${theme.bgColor}`,
        overflow: 'hidden',
        containerType: 'inline-size',
        fontFamily: 'Arial, sans-serif'
    };

    // Shared decorative shapes
    const leftCyanBar = { position: 'absolute', left: x(0), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.cyan}` };
    const leftPurpleBar = { position: 'absolute', left: x(0.1), top: y(0), width: w(0.1), height: h(5.625), backgroundColor: `#${theme.purple}` };
    
    // Transparency 70 = opacity 0.3
    const decorTeal = { position: 'absolute', left: x(-0.5), top: y(4.5), width: w(2.5), height: h(2.5), backgroundColor: `#${theme.tealDecor}`, opacity: 0.3, borderRadius: '50%' };
    // Transparency 75 = opacity 0.25
    const decorPurple = { position: 'absolute', left: x(8.5), top: y(-1), width: w(3), height: h(3), backgroundColor: `#${theme.decorPurple}`, opacity: 0.25, borderRadius: '50%' };
    
    const decorGold = { position: 'absolute', left: x(9), top: y(0.5), width: w(1.5), height: h(1.5), border: `4cqw solid #${theme.gold}`, borderRadius: '50%', boxSizing: 'border-box' };

    return (
        <div style={baseStyle} className="shadow-md rounded-lg border border-outline-variant/30 flex-shrink-0">
            {/* Background Decor */}
            <div style={leftCyanBar}></div>
            <div style={leftPurpleBar}></div>
            <div style={decorTeal}></div>
            <div style={decorPurple}></div>
            <div style={decorGold} style={{...decorGold, borderWidth: '0.4cqw'}}></div> {/* Adjusted border width for cqw */}

            {/* Title Slide */}
            {type === 'title' && config && (
                <>
                    <div style={{ position: 'absolute', left: x(1.2), top: y(1.5), width: w(8), height: h(1.5), fontSize: fs(60), fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: `#${theme.cyan}` }}>{config.mainTitle1}&nbsp;</span>
                        <span style={{ color: `#${theme.gold}` }}>{config.mainTitle2}</span>
                    </div>

                    <div style={{ position: 'absolute', left: x(1.2), top: y(3.0), width: w(6.5), height: h(0.04), backgroundColor: `#${theme.gold}` }}></div>

                    {/* Pill 1 */}
                    <div style={{ position: 'absolute', left: x(1.2), top: y(3.4), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.cyan}`, borderRadius: '1.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>
                        {config.pill1}
                    </div>

                    {/* Pill 2 */}
                    <div style={{ position: 'absolute', left: x(4.4), top: y(3.4), width: w(2.8), height: h(0.5), backgroundColor: `#${theme.bgColor}`, border: `0.25cqw solid #${theme.purple}`, borderRadius: '1.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.purple}`, boxSizing: 'border-box' }}>
                        {config.pill2}
                    </div>

                    {/* Footer */}
                    <div style={{ position: 'absolute', left: x(1.2), top: y(4.2), width: w(8), height: h(0.5), fontSize: fs(16), color: `#${theme.textWhite}`, letterSpacing: '0.3cqw', display: 'flex', alignItems: 'center' }}>
                        {config.footer}
                    </div>
                </>
            )}

            {/* Question Slide */}
            {type === 'question' && questionData && (
                <>
                    {/* Background Badge Watermark */}
                    <div style={{ position: 'absolute', left: x(5.5), top: y(3.5), width: w(4), height: h(2), fontSize: fs(90), fontWeight: 'bold', color: `#${theme.purple}`, opacity: 0.15, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', lineHeight: 1 }}>
                        {questionData.badge}
                    </div>

                    {/* Badge Pill */}
                    <div style={{ position: 'absolute', left: x(1.2), top: y(0.6), width: w(1.2), height: h(0.4), backgroundColor: `#${theme.cyan}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 'bold', color: `#${theme.textBlack}` }}>
                        {questionData.badge}
                    </div>
                    
                    {/* Top Lines */}
                    <div style={{ position: 'absolute', left: x(2.6), top: y(0.785), width: w(2.5), height: h(0.03), backgroundColor: `#${theme.cyan}` }}></div>
                    <div style={{ position: 'absolute', left: x(5.1), top: y(0.785), width: w(1.5), height: h(0.03), backgroundColor: `#${theme.purple}` }}></div>

                    {/* Tag Pill */}
                    <div style={{ position: 'absolute', left: x(6.8), top: y(0.6), width: w(2.8), height: h(0.4), backgroundColor: `#${theme.bgCard}`, border: `0.15cqw solid #${theme.purple}`, borderRadius: '0.5cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(14), color: `#${theme.purple}`, boxSizing: 'border-box' }}>
                        {questionData.tag.toUpperCase()}
                    </div>

                    {/* Text Area */}
                    <div style={{ position: 'absolute', left: x(1.2), top: y(1.4), width: w(8.4), height: h(3.8), textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                        <div style={{ color: `#${theme.textWhite}`, fontSize: fs(24), lineHeight: 1.4 }}>
                            {questionData.qText}
                        </div>
                        {questionData.options && (
                            <div style={{ color: `#${theme.cyan}`, fontSize: fs(18), marginTop: '3cqw', lineHeight: 1.4 }}>
                                {questionData.options}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
