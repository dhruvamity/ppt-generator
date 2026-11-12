// Shared 1280 × 720 geometry keeps the live preview and exported slides aligned.
export const DESIGN_LAYOUTS = [
    { id: 'modern-sidebar', name: 'Side accent' },
    { id: 'classic-header', name: 'Top rule' },
    { id: 'split-focus', name: 'Number rail' },
];
export const hasSignatureLayout = theme => ['Cyberpunk Neon', 'Blueprint Architect', 'Aurora Glassmorphism', 'Neo-Brutalism'].includes(theme.name);
export const SAMPLE_CONFIG = { mainTitle1: 'Quadratic', mainTitle2: 'Equations', pill1: 'PRACTICE', pill2: 'CLASS 10', footer: 'Think. Solve. Discuss.' };
export const SAMPLE_QUESTION = { badge: 'Q.1', qText: 'Find the roots of $x^2 - 5x + 6 = 0$.', options: [{ label: 'A', text: '$2, 3$' }, { label: 'B', text: '$-2, -3$' }, { label: 'C', text: '$1, 6$' }, { label: 'D', text: '$-1, -6$' }] };
export function teachingIllustrationStyle(theme) {
    if (!theme.illustration) return null;
    const stroke = `#${theme.cyan}`;
    const artwork = {
        signal: `<g fill="none" stroke="${stroke}" stroke-width="2"><path d="M10 155h28l14-27 22 53 18-34 17 16h32"/><path d="M25 245h94M42 272h74M18 299h112" stroke-dasharray="2 9"/><path d="M18 420h28l16-30 17 45 18-24h38"/><circle cx="52" cy="128" r="5" fill="${stroke}"/><circle cx="74" cy="181" r="5" fill="${stroke}"/><circle cx="109" cy="163" r="5" fill="${stroke}"/></g>`,
        orbit: `<g fill="none" stroke="${stroke}" stroke-width="2"><circle cx="98" cy="176" r="43"/><ellipse cx="98" cy="176" rx="78" ry="29" transform="rotate(-34 98 176)"/><ellipse cx="98" cy="176" rx="78" ry="29" transform="rotate(34 98 176)"/><circle cx="98" cy="176" r="7" fill="${stroke}"/><circle cx="30" cy="131" r="4" fill="${stroke}"/><circle cx="146" cy="226" r="4" fill="${stroke}"/><path d="M20 332h30M36 348h48M12 364h64M86 462h36M102 478h29" stroke-dasharray="2 8"/></g>`,
        prism: `<defs><linearGradient id="prism" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${stroke}" stop-opacity=".28"/><stop offset="1" stop-color="#B47BEA" stop-opacity=".1"/></linearGradient></defs><path d="M160 0H64L160 158Z" fill="url(#prism)"/><path d="M160 278 44 398l116 98Z" fill="url(#prism)"/><path d="M146 34 77 116m70 207-75 75m70 35-55 56" fill="none" stroke="${stroke}" stroke-width="2" stroke-opacity=".32"/><circle cx="95" cy="238" r="4" fill="${stroke}" opacity=".45"/>`,
    }[theme.illustration];
    if (!artwork) return null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="720" viewBox="0 0 160 720">${artwork}</svg>`;
    const image = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    return { position: 'absolute', top: '0px', right: '0px', bottom: '0px', width: '160px', opacity: theme.illustration === 'prism' ? '1' : '0.28', pointerEvents: 'none', backgroundImage: image, backgroundPosition: 'right center', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' };
}
export function teachingStyles(theme, layout, title, workspace) {
    const rail = layout === 'split-focus' && !title && !workspace;
    return {
        accent: { position: 'absolute', backgroundColor: `#${theme.cyan}`, ...(layout === 'classic-header' ? { left: '48px', right: '48px', top: '0px', height: '4px' } : { left: '0px', top: '0px', bottom: '0px', width: '6px' }) },
        header: { position: 'absolute', left: '48px', right: theme.illustration ? '176px' : '48px', top: '28px', display: 'flex', alignItems: 'center', gap: '24px', color: `#${theme.cyan}`, fontSize: '22px', fontWeight: '700' },
        rule: { flex: 1, height: '1px', backgroundColor: `#${theme.rule}` },
        rail: { position: 'absolute', left: '132px', top: '80px', bottom: '40px', width: '1px', backgroundColor: `#${theme.rule}` },
        body: { position: 'absolute', left: rail ? '168px' : '48px', right: theme.illustration ? '176px' : '48px', top: title ? '170px' : '90px', bottom: '40px', color: `#${theme.textWhite}`, textAlign: 'left', overflowWrap: 'anywhere' },
        title: { fontSize: '68px', lineHeight: 1.15, fontWeight: '700', marginBottom: '32px' },
        subtitle: { fontSize: '22px', letterSpacing: '2px', color: `#${theme.cyan}` },
        footer: { fontSize: '24px', marginTop: '48px' },
        workspace: { height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 55px, #${theme.rule} 55px, #${theme.rule} 56px)` },
    };
}
export const previewStyle = style => Object.fromEntries(Object.entries(style).map(([key, value]) => [key, typeof value === 'string' ? value.replace(/(\d+(?:\.\d+)?)px/g, (_, px) => `${Number(px) / 12.8}cqw`) : value]));
export const inlineStyle = style => Object.entries(style).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())}:${value}`).join(';');
