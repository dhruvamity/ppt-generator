import React, { useState, useEffect } from 'react';
import MathRenderer from './MathRenderer';

export default function EditableBlock({ value, onChange, className, style, renderTables = false, readOnly = false }) {
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
                    <span key={index} style={{ display: 'inline-block', verticalAlign: 'middle', padding: '0 0.12em' }}>
                        {/* \displaystyle forces fractions to be tall like on real paper */}
                        <MathRenderer math={part.trimStart().startsWith('\\displaystyle') ? part : `\\displaystyle ${part}`} />
                    </span>
                );
            }
            // Even index is standard text
            return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
        });
    };

    const renderContent = (text) => {
        if (!renderTables || !text) return renderTextWithMath(text);
        const lines = text.split('\n');
        const blocks = [];
        const cells = (line) => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(cell => cell.trim());
        let paragraph = [];
        const flushParagraph = () => {
            if (paragraph.length) blocks.push(<div key={`text-${blocks.length}`} style={{ marginBottom: '0.7em' }}>{renderTextWithMath(paragraph.join('\n'))}</div>);
            paragraph = [];
        };
        for (let i = 0; i < lines.length; i++) {
            const isTable = lines[i].trim().startsWith('|') && lines[i + 1]?.includes('|') && cells(lines[i + 1]).every(cell => /^:?-{2,}:?$/.test(cell));
            if (!isTable) {
                paragraph.push(lines[i]);
                continue;
            }
            flushParagraph();
            const headings = cells(lines[i]);
            const rows = [];
            i += 2;
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                rows.push(cells(lines[i]));
                i++;
            }
            i--;
            const cellStyle = { borderBottom: '0.06em solid currentColor', padding: '0.35em 0.45em', textAlign: 'left', overflowWrap: 'anywhere' };
            blocks.push(
                <table key={`table-${blocks.length}`} style={{ width: '100%', borderCollapse: 'collapse', margin: '0.7em 0', whiteSpace: 'normal', fontSize: '0.95em' }}>
                    <thead><tr>{headings.map((heading, j) => <th key={j} style={cellStyle}>{renderTextWithMath(heading)}</th>)}</tr></thead>
                    <tbody>{rows.map((row, j) => <tr key={j}>{headings.map((_, k) => <td key={k} style={/^[−-]?\d[\d.,]*%?$/.test(row[k]) ? { ...cellStyle, whiteSpace: 'nowrap', overflowWrap: 'normal' } : cellStyle}>{renderTextWithMath((row[k] || '').replace(/\\\|/g, '|'))}</td>)}</tr>)}</tbody>
                </table>
            );
        }
        flushParagraph();
        return blocks;
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
            onClick={readOnly ? undefined : () => setIsEditing(true)}
            className={`cursor-pointer hover:outline hover:outline-1 hover:outline-dashed hover:outline-white/50 rounded transition-all duration-200 ${className || ''}`}
            title={readOnly ? undefined : 'Click to edit text'}
            style={{ lineHeight: 'inherit', ...style }}
        >
            {renderContent(value)}
        </div>
    );
}
