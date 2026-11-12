// Shared 1280 × 720 geometry keeps the live preview and exported slides aligned.
export const DESIGN_LAYOUTS = [
    { id: 'modern-sidebar', name: 'Side accent' },
    { id: 'classic-header', name: 'Top rule' },
    { id: 'split-focus', name: 'Number rail' },
];
export const hasSignatureLayout = theme => ['Cyberpunk Neon', 'Blueprint Architect', 'Aurora Glassmorphism', 'Neo-Brutalism'].includes(theme.name);
export const SAMPLE_CONFIG = { mainTitle1: 'Quadratic', mainTitle2: 'Equations', pill1: 'PRACTICE', pill2: 'CLASS 10', footer: 'Think. Solve. Discuss.' };
export const SAMPLE_QUESTION = { badge: 'Q.1', qText: 'Find the roots of $x^2 - 5x + 6 = 0$.', options: [{ label: 'A', text: '$2, 3$' }, { label: 'B', text: '$-2, -3$' }, { label: 'C', text: '$1, 6$' }, { label: 'D', text: '$-1, -6$' }] };
export function teachingStyles(theme, layout, title, workspace) {
    const rail = layout === 'split-focus' && !title && !workspace;
    return {
        accent: { position: 'absolute', backgroundColor: `#${theme.cyan}`, ...(layout === 'classic-header' ? { left: '48px', right: '48px', top: '0px', height: '4px' } : { left: '0px', top: '0px', bottom: '0px', width: '6px' }) },
        header: { position: 'absolute', left: '48px', right: '48px', top: '28px', display: 'flex', alignItems: 'center', gap: '24px', color: `#${theme.cyan}`, fontSize: '22px', fontWeight: '700' },
        rule: { flex: 1, height: '1px', backgroundColor: `#${theme.rule}` },
        rail: { position: 'absolute', left: '132px', top: '80px', bottom: '40px', width: '1px', backgroundColor: `#${theme.rule}` },
        body: { position: 'absolute', left: rail ? '168px' : '48px', right: '48px', top: title ? '170px' : '90px', bottom: '40px', color: `#${theme.textWhite}`, textAlign: 'left', overflowWrap: 'anywhere' },
        title: { fontSize: '68px', lineHeight: 1.15, fontWeight: '700', marginBottom: '32px' },
        subtitle: { fontSize: '22px', letterSpacing: '2px', color: `#${theme.cyan}` },
        footer: { fontSize: '24px', marginTop: '48px' },
        workspace: { height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 55px, #${theme.rule} 55px, #${theme.rule} 56px)` },
    };
}
export const previewStyle = style => Object.fromEntries(Object.entries(style).map(([key, value]) => [key, typeof value === 'string' ? value.replace(/(\d+(?:\.\d+)?)px/g, (_, px) => `${Number(px) / 12.8}cqw`) : value]));
export const inlineStyle = style => Object.entries(style).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())}:${value}`).join(';');
