import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Forces full-size math rendering for fractions and limits
const renderTextWithMath = (text) => {
    if (!text) return null;
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
            return <BlockMath key={index} math={`\\displaystyle ${part.slice(2, -2)}`} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
            // The magic fix: forces inline math to render at full vertical size
            return <InlineMath key={index} math={`\\displaystyle ${part.slice(1, -1)}`} />;
        }
        return <span key={index}>{part}</span>;
    });
};

export default function EditableBlock({ value, onChange, className, style, theme }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onChange(tempValue);
        }
    };

    if (isEditing) {
        return (
            <textarea
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                style={{
                    width: '100%',
                    minHeight: '3em',
                    backgroundColor: `rgba(255, 255, 255, 0.1)`,
                    color: `#${theme?.textWhite || 'FFF'}`,
                    border: `1px dashed #${theme?.cyan || 'FFF'}`,
                    borderRadius: '4px',
                    padding: '8px',
                    fontSize: 'inherit',
                    fontFamily: 'monospace',
                    outline: 'none',
                    resize: 'vertical',
                    ...style
                }}
            />
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)} 
            className={`cursor-pointer hover:outline hover:outline-1 hover:outline-dashed hover:outline-white/50 rounded transition-all duration-200 ${className || ''}`}
            title="Click to edit text"
            style={style}
        >
            {renderTextWithMath(value)}
        </div>
    );
}
