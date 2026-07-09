import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathRenderer({ math, displayMode = false, style, className }) {
    try {
        const html = katex.renderToString(math, {
            displayMode: displayMode,
            throwOnError: true,
            strict: false,
            trust: true
        });
        return (
            <span 
                className={className}
                style={style}
                dangerouslySetInnerHTML={{ __html: html }} 
            />
        );
    } catch (error) {
        console.error("KaTeX error:", error);
        // Fallback to raw text if KaTeX fails, highlighted in red so user knows it's broken
        return (
            <span 
                className={`katex-error ${className || ''}`} 
                style={{ ...style, color: '#ff4444', backgroundColor: '#330000', padding: '0 4px', borderRadius: '4px' }}
                title={error.message}
            >
                {math}
            </span>
        );
    }
}
