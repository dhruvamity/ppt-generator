import React, { useId, useMemo } from 'react';
import { layoutThumbnail, estimateTextWidth } from '../../utils/thumbnailDesign.js';
import { STICKERS, stickerSvg } from '../../utils/thumbnailStickers.js';

let context;
// Measure with the real font so wrapping matches what the browser draws; fall back to the estimate.
const measureText = (value, { size, weight, family, spacing = 0, style }) => {
    if (typeof document === 'undefined') return estimateTextWidth(value, { size, weight, family, spacing });
    context ||= document.createElement('canvas').getContext('2d');
    context.font = `${style || 'normal'} ${weight || 400} ${size}px ${family}`;
    return context.measureText(value).width + Math.max(0, value.length - 1) * spacing;
};

const Shape = ({ node, ...props }) => {
    if (node.type === 'circle') return <circle cx={node.cx} cy={node.cy} r={node.r} {...props} />;
    if (node.type === 'polygon') return <polygon points={node.points} {...props} />;
    return <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={node.rx || 0} {...props} />;
};

const TextNode = ({ node, paint }) => {
    const common = { fontFamily: node.family, fontSize: node.size, fontWeight: node.weight, fontStyle: node.style || 'normal', textAnchor: node.anchor, letterSpacing: node.spacing || undefined };
    const spans = node.lines.map((line, j) => <tspan key={j} x={line.x} y={line.y}>{line.text}</tspan>);
    return <>
        {node.shadow && <text {...common} fill={node.shadow} transform="translate(5 6)" opacity={0.9}>{spans}</text>}
        <text {...common} fill={paint(node.fill)} stroke={node.outline || node.stroke} strokeWidth={node.outline ? node.outlineWidth || 8 : node.sw} strokeLinejoin="round" paintOrder={node.outline ? 'stroke' : undefined} opacity={node.opacity}>{spans}</text>
    </>;
};

export default function ThumbnailSvg({ template, data, svgRef, className, measure = measureText }) {
    const id = useId().replace(/:/g, '');
    const layout = useMemo(() => layoutThumbnail(template, data, measure), [template, data, measure]);
    const paint = value => typeof value === 'string' && value.startsWith('gradient:') ? `url(#${id}-${value.slice(9)})` : value;
    return <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${layout.width} ${layout.height}`} width="100%" className={className} role="img" aria-label={`${template.name} thumbnail preview`}>
        <defs>
            {layout.defs.map(def => def.type === 'radial'
                ? <radialGradient key={def.id} id={`${id}-${def.id}`}><stop offset="0%" stopColor={def.color} stopOpacity="0.55" /><stop offset="100%" stopColor={def.color} stopOpacity="0" /></radialGradient>
                : <linearGradient key={def.id} id={`${id}-${def.id}`} x1={def.x1} y1={def.y1} x2={def.x2} y2={def.y2}>{def.stops.map(([offset, color]) => <stop key={offset} offset={offset} stopColor={color} />)}</linearGradient>)}
            {layout.nodes.map((node, i) => node.type === 'photo' && <clipPath key={i} id={`${id}-clip-${i}`}><Shape node={node.clip} /></clipPath>)}
        </defs>
        {layout.nodes.map((node, i) => {
            if (node.type === 'text') return <TextNode key={i} node={node} paint={paint} />;
            if (node.type === 'line') return <line key={i} x1={node.x1} y1={node.y1} x2={node.x2} y2={node.y2} stroke={node.stroke} strokeWidth={node.sw} strokeDasharray={node.dash} opacity={node.opacity} />;
            if (node.type === 'sticker') {
                const natural = STICKERS[node.kind];
                // Sticker drawings are static SVG strings from our own library, not user content.
                return <g key={i} opacity={node.opacity} transform={`translate(${node.x} ${node.y}) rotate(${node.rotate} ${node.w / 2} ${node.h / 2}) scale(${node.w / natural.w} ${node.h / natural.h})`} dangerouslySetInnerHTML={{ __html: stickerSvg(node.kind, node.color, node.color2, node.text) }} />;
            }
            if (node.type === 'photo') {
                const { slot, image, ring } = node, unit = Math.min(slot.w, slot.h);
                return <g key={i}>
                    {node.href
                        ? <image href={node.href} x={image.x} y={image.y} width={image.w} height={image.h} preserveAspectRatio={image.preserve} clipPath={`url(#${id}-clip-${i})`} />
                        : <g clipPath={`url(#${id}-clip-${i})`}>
                            <rect x={slot.x} y={slot.y} width={slot.w} height={slot.h} fill="#D5DAE2" />
                            <circle cx={slot.x + slot.w / 2} cy={slot.y + slot.h * 0.42} r={unit * 0.15} fill="#9AA5B8" />
                            <ellipse cx={slot.x + slot.w / 2} cy={slot.y + slot.h * 0.92} rx={unit * 0.34} ry={unit * 0.26} fill="#9AA5B8" />
                            <text x={slot.x + slot.w / 2} y={slot.y + slot.h * 0.16} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fill="#5A6578">YOUR PHOTO HERE</text>
                        </g>}
                    {ring && <Shape node={node.clip} fill="none" stroke={ring.color} strokeWidth={ring.width} />}
                </g>;
            }
            return <Shape key={i} node={node} fill={paint(node.fill) ?? 'none'} stroke={node.stroke} strokeWidth={node.sw} opacity={node.opacity} />;
        })}
    </svg>;
}
