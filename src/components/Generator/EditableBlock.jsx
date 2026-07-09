import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import MathRenderer from './MathRenderer';

export default function EditableBlock({ value, onChange, className, style, theme }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');

    useEffect(() => {
        setTempValue(value || '');
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) onChange(tempValue);
    };

    const renderTextWithMath = (text) => {
        if (!text) return null;
        
        // Safely split the text by $ signs. 
        // Odd indices will be math, even indices will be text.
        const parts = text.split('$');
        
        return parts.map((part, index) => {
            // Keep empty spans for stable React rendering keys
            if (part === '') return <span key={index}></span>; 
            
            // If it's an odd index, it was wrapped in $, so it's math
            if (index % 2 !== 0) {
                return (
                    <span key={index} className="inline-flex items-center px-1" style={{ verticalAlign: 'middle' }}>
                        {/* \displaystyle forces fractions to be tall like on real paper */}
                        <MathRenderer math={`\\displaystyle ${part}`} />
                    </span>
                );
            }
            // Even index is standard text
            return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
        });
    };

    if (isEditing) {
        return (
            <textarea
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                className="w-full min-h-[4em] bg-black/40 border-2 border-dashed border-blue-400 rounded p-3 text-inherit font-mono outline-none resize-y"
                style={{ ...style, fontSize: '0.85em' }}
            />
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)} 
            className={`cursor-pointer hover:outline hover:outline-1 hover:outline-dashed hover:outline-white/50 rounded transition-all duration-200 ${className || ''}`}
            title="Click to edit text"
            style={{ ...style, lineHeight: '1.8' }}
        >
            {renderTextWithMath(value)}
        </div>
    );
}
