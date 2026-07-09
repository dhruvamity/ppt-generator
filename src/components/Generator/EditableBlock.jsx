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
        const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                return <BlockMath key={index} math={`\\displaystyle ${part.slice(2, -2)}`} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                return (
                    <span key={index} className="inline-flex items-center px-1">
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
                className="w-full min-h-[4em] bg-black/40 border-2 border-dashed border-blue-400 rounded p-3 text-inherit font-mono outline-none resize-y"
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
