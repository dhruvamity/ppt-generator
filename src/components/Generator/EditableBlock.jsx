import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function EditableBlock({ value, onChange, className, style, theme }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');

    useEffect(() => {
        setTempValue(value || '');
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onChange(tempValue);
        }
    };

    const renderTextWithMath = (text) => {
        if (!text) return null;
        // Split by $$block$$ or $ inline $
        const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                return <BlockMath key={index} math={`\\displaystyle ${part.slice(2, -2)}`} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                // The magic fix: \\displaystyle forces inline math to render at full vertical size
                return (
                    <span key={index} className="math-inline-display" style={{ padding: '0 4px' }}>
                        <InlineMath math={`\\displaystyle ${part.slice(1, -1)}`} />
                    </span>
                );
            }
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
                className="w-full min-h-[3em] bg-white/10 border border-dashed border-white/50 rounded p-2 text-inherit font-mono outline-none resize-y"
                style={style}
            />
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)} 
            className={`cursor-pointer hover:outline hover:outline-1 hover:outline-dashed hover:outline-white/50 rounded transition-all duration-200 ${className || ''}`}
            title="Click to edit text"
            style={{ ...style, lineHeight: '2' }} // Expanded line height so tall fractions don't clip
        >
            {renderTextWithMath(value)}
        </div>
    );
}
