// Shared 1280 × 720 geometry keeps the live preview and exported slides aligned.
export const DESIGN_LAYOUTS = [
    { id: 'modern-sidebar', name: 'Side accent' },
    { id: 'classic-header', name: 'Top rule' },
    { id: 'split-focus', name: 'Number rail' },
];
export const hasSignatureLayout = theme => Boolean(theme.design) || ['Cyberpunk Neon', 'Blueprint Architect', 'Aurora Glassmorphism', 'Neo-Brutalism'].includes(theme.name);
export const SAMPLE_CONFIG = { mainTitle1: 'Quadratic', mainTitle2: 'Equations', pill1: 'PRACTICE', pill2: 'CLASS 10', footer: 'Think. Solve. Discuss.' };
export const SAMPLE_QUESTION = { badge: 'Q.1', qText: 'Find the roots of $x^2 - 5x + 6 = 0$.', options: [{ label: 'A', text: '$2, 3$' }, { label: 'B', text: '$-2, -3$' }, { label: 'C', text: '$1, 6$' }, { label: 'D', text: '$-1, -6$' }] };
// Every illustration lives in a 160 × 720 strip on the right edge; `teachingStyles` keeps the
// header and body 176px clear of it, so artwork can never sit behind a question or option.
export const ILLUSTRATION_WIDTH = 160;
const tiles = (y, count, shaded, a, b) => Array.from({ length: count }, (_, i) => `<rect x="${20 + i * (120 / count)}" y="${y}" width="${120 / count}" height="26" fill="${i < shaded ? b : 'none'}" fill-opacity=".55"/>`).join('');
const counters = (a, b) => Array.from({ length: 30 }, (_, i) => `<circle cx="${32 + (i % 5) * 24}" cy="${520 + Math.floor(i / 5) * 32}" r="5" fill="${i % 5 < 2 ? b : 'none'}" fill-opacity=".7"/>`).join('');
const ILLUSTRATIONS = {
    signal: (a) => ({ opacity: '0.28', svg: `<g fill="none" stroke="${a}" stroke-width="2"><path d="M10 155h28l14-27 22 53 18-34 17 16h32"/><path d="M25 245h94M42 272h74M18 299h112" stroke-dasharray="2 9"/><path d="M18 420h28l16-30 17 45 18-24h38"/><circle cx="52" cy="128" r="5" fill="${a}"/><circle cx="74" cy="181" r="5" fill="${a}"/><circle cx="109" cy="163" r="5" fill="${a}"/></g>` }),
    orbit: (a) => ({ opacity: '0.28', svg: `<g fill="none" stroke="${a}" stroke-width="2"><circle cx="98" cy="176" r="43"/><ellipse cx="98" cy="176" rx="78" ry="29" transform="rotate(-34 98 176)"/><ellipse cx="98" cy="176" rx="78" ry="29" transform="rotate(34 98 176)"/><circle cx="98" cy="176" r="7" fill="${a}"/><circle cx="30" cy="131" r="4" fill="${a}"/><circle cx="146" cy="226" r="4" fill="${a}"/><path d="M20 332h30M36 348h48M12 364h64M86 462h36M102 478h29" stroke-dasharray="2 8"/></g>` }),
    prism: (a) => ({ opacity: '1', svg: `<defs><linearGradient id="prism" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}" stop-opacity=".28"/><stop offset="1" stop-color="#B47BEA" stop-opacity=".1"/></linearGradient></defs><path d="M160 0H64L160 158Z" fill="url(#prism)"/><path d="M160 278 44 398l116 98Z" fill="url(#prism)"/><path d="M146 34 77 116m70 207-75 75m70 35-55 56" fill="none" stroke="${a}" stroke-width="2" stroke-opacity=".32"/><circle cx="95" cy="238" r="4" fill="${a}" opacity=".45"/>` }),
    // Squared paper with a plotted parabola and a straight-line graph.
    grid: (a) => ({ opacity: '0.55', svg: `<defs><pattern id="gp" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0v20" fill="none" stroke="${a}" stroke-width=".6" stroke-opacity=".35"/></pattern></defs><rect width="160" height="720" fill="url(#gp)"/><g fill="none" stroke="${a}" stroke-width="2"><path d="M14 300h132M80 120v360"/><path d="M140 295l6 5-6 5M75 126l5-6 5 6"/><path d="M20 160q60 330 120 0"/><path d="M26 660h120M40 520v160"/><path d="M44 628l96-86"/></g><g fill="${a}"><circle cx="80" cy="325" r="4"/><circle cx="70" cy="605" r="4"/><circle cx="110" cy="569" r="4"/></g>` }),
    // Thales circle, protractor and a labelled triangle with its altitude.
    geometry: (a, b) => ({ opacity: '0.5', svg: `<g fill="none" stroke="${a}" stroke-width="2"><circle cx="80" cy="140" r="56"/><path d="M24 140h112L61 87Z"/><path d="M80 140L61 87" stroke-dasharray="3 5"/><path d="M40 140A16 16 0 0 0 33.2 126.9" stroke="${b}"/><path d="M20 330a60 60 0 0 1 120 0M20 330h120M32 330a48 48 0 0 1 96 0"/><path d="M121.6 306L132 300M104 288.4L110 278M80 282V270M56 288.4L50 278M38.4 306L28 300"/><path d="M24 640h112L100 520Z"/><path d="M100 520V640" stroke="${b}" stroke-dasharray="3 5"/><path d="M88 640v-12h12" stroke="${b}"/></g><circle cx="80" cy="330" r="3" fill="${a}"/><g fill="${a}" font-family="Times New Roman,serif" font-style="italic" font-size="15"><text x="124" y="578">a</text><text x="48" y="578">b</text><text x="76" y="662">c</text><text x="104" y="590">h</text></g>` }),
    // Scattered notation symbols on a board.
    formula: (a, b) => ({ opacity: '0.34', svg: `<g fill="${a}" font-family="Times New Roman,serif" font-style="italic"><text x="24" y="120" font-size="64">∑</text><text x="96" y="200" font-size="54">∫</text><text x="30" y="290" font-size="46">π</text><text x="92" y="330" font-size="40">√</text><text x="22" y="420" font-size="50">θ</text><text x="84" y="470" font-size="44">∞</text><text x="36" y="560" font-size="40">Δ</text><text x="98" y="600" font-size="38">∂</text><text x="26" y="660" font-size="36">≈</text><text x="96" y="690" font-size="34">±</text></g><g fill="none" stroke="${b}" stroke-width="1.5" stroke-opacity=".6"><circle cx="120" cy="120" r="30"/><circle cx="44" cy="500" r="22"/><path d="M12 240h40M108 380h40"/></g>` }),
    // Labelled integer line with jump arcs.
    numberline: (a, b) => ({ opacity: '0.5', svg: `<g fill="none" stroke="${a}" stroke-width="2"><path d="M64 90v560M58 96l6-6 6 6M58 644l6 6 6-6"/><path d="M52 130h24M52 210h24M52 290h24M52 370h24M52 450h24M52 530h24M52 610h24"/><path d="M58 170h12M58 250h12M58 330h12M58 410h12M58 490h12M58 570h12"/><path d="M68 370q60-80 0-160M68 210q80 120 0 240" stroke="${b}" stroke-dasharray="4 5"/></g><g fill="${b}"><circle cx="64" cy="370" r="4"/><circle cx="64" cy="210" r="4"/><circle cx="64" cy="450" r="4"/></g><g fill="${a}" font-family="Arial,sans-serif" font-size="15" text-anchor="end"><text x="44" y="135">3</text><text x="44" y="215">2</text><text x="44" y="295">1</text><text x="44" y="375">0</text><text x="44" y="455">-1</text><text x="44" y="535">-2</text><text x="44" y="615">-3</text></g>` }),
    // Equivalent-fraction bars, a quartered circle and an array of counters.
    fractions: (a, b) => ({ opacity: '0.85', svg: `<g stroke="${a}" stroke-width="1.5">${tiles(100, 1, 0, a, b)}${tiles(140, 2, 1, a, b)}${tiles(180, 4, 2, a, b)}${tiles(220, 6, 3, a, b)}${tiles(260, 3, 1, a, a)}</g><text x="80" y="326" text-anchor="middle" font-family="Times New Roman,serif" font-style="italic" font-size="17" fill="${a}">1/2 = 2/4 = 3/6</text><g fill="none" stroke="${a}" stroke-width="1.5"><circle cx="80" cy="410" r="50"/><path d="M30 410h100M80 360v100"/><path d="M80 410V360a50 50 0 0 1 50 50Z" fill="${b}" fill-opacity=".55"/>${counters(a, b)}</g>` }),
    // Unit circle with an angle, above sine and cosine curves.
    wave: (a, b) => ({ opacity: '0.42', svg: `<g fill="none" stroke="${a}" stroke-width="2"><circle cx="80" cy="120" r="50"/><path d="M80 120h50M80 120L118.3 87.9"/><path d="M118.3 87.9V120" stroke-dasharray="3 4"/><path d="M98 120A18 18 0 0 0 93.8 108.4" stroke="${b}"/><path d="M80 200v510" stroke-dasharray="2 8" stroke-opacity=".6"/><path d="M80 220q100 40 0 80q-100 40 0 80q100 40 0 80q-100 40 0 80q100 40 0 80q-100 40 0 80"/><path d="M80 180q100 40 0 80q-100 40 0 80q100 40 0 80q-100 40 0 80q100 40 0 80q-100 40 0 80q100 40 0 80" stroke="${b}" stroke-dasharray="5 5"/></g><circle cx="118.3" cy="87.9" r="4" fill="${a}"/><text x="102" y="116" font-family="Times New Roman,serif" font-style="italic" font-size="13" fill="${b}">θ</text>` }),
};
export function teachingIllustrationStyle(theme) {
    const artwork = theme.illustration && ILLUSTRATIONS[theme.illustration]?.(`#${theme.cyan}`, `#${theme.gold || theme.cyan}`);
    if (!artwork) return null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ILLUSTRATION_WIDTH}" height="720" viewBox="0 0 ${ILLUSTRATION_WIDTH} 720">${artwork.svg}</svg>`;
    // Single quotes: the export embeds this inside a double-quoted style attribute.
    const image = `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}')`;
    return { position: 'absolute', top: '0px', right: '0px', bottom: '0px', width: `${ILLUSTRATION_WIDTH}px`, opacity: artwork.opacity, pointerEvents: 'none', backgroundImage: image, backgroundPosition: 'right center', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' };
}
export function teachingStyles(theme, layout, title, workspace) {
    const rail = layout === 'split-focus' && !title && !workspace;
    const clear = theme.illustration ? `${ILLUSTRATION_WIDTH + 16}px` : '48px';
    return {
        accent: { position: 'absolute', backgroundColor: `#${theme.cyan}`, ...(layout === 'classic-header' ? { left: '48px', right: '48px', top: '0px', height: '4px' } : { left: '0px', top: '0px', bottom: '0px', width: '6px' }) },
        header: { position: 'absolute', left: '48px', right: clear, top: '28px', display: 'flex', alignItems: 'center', gap: '24px', color: `#${theme.cyan}`, fontSize: '22px', fontWeight: '700' },
        rule: { flex: 1, height: '1px', backgroundColor: `#${theme.rule}` },
        rail: { position: 'absolute', left: '132px', top: '80px', bottom: '40px', width: '1px', backgroundColor: `#${theme.rule}` },
        body: { position: 'absolute', left: rail ? '168px' : '48px', right: clear, top: title ? '170px' : '90px', bottom: '40px', color: `#${theme.textWhite}`, textAlign: 'left', overflowWrap: 'anywhere' },
        title: { fontSize: '68px', lineHeight: 1.15, fontWeight: '700', marginBottom: '32px' },
        subtitle: { fontSize: '22px', letterSpacing: '2px', color: `#${theme.cyan}` },
        footer: { fontSize: '24px', marginTop: '48px' },
        workspace: { height: '100%', background: `repeating-linear-gradient(to bottom, transparent, transparent 55px, #${theme.rule} 55px, #${theme.rule} 56px)` },
    };
}
export const previewStyle = style => Object.fromEntries(Object.entries(style).map(([key, value]) => [key, typeof value === 'string' ? value.replace(/(\d+(?:\.\d+)?)px/g, (_, px) => `${Number(px) / 12.8}cqw`) : value]));
export const inlineStyle = style => Object.entries(style).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())}:${value}`).join(';');
