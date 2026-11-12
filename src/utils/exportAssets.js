// Vite-only bundle of everything the exported deck needs to run offline: Reveal.js, its CSS and
// KaTeX's CSS with the woff2 fonts inlined. `buildRevealHtml` falls back to CDN links without it.
import revealJs from 'reveal.js/dist/reveal.js?raw';
import revealCss from 'reveal.js/dist/reveal.css?raw';
import resetCss from 'reveal.js/dist/reset.css?raw';
import katexCss from 'katex/dist/katex.min.css?raw';

const fonts = import.meta.glob('/node_modules/katex/dist/fonts/*.woff2', { query: '?inline', eager: true, import: 'default' });
const fontByName = Object.fromEntries(Object.entries(fonts).map(([path, uri]) => [path.split('/').pop(), uri]));

export const inlineKatexFonts = (css, lookup) => css
    // Keep only the woff2 source and point it at the embedded font.
    .replace(/src:url\(fonts\/([\w-]+)\.woff2\) format\("woff2"\),url\(fonts\/[\w-]+\.woff\) format\("woff"\),url\(fonts\/[\w-]+\.ttf\) format\("truetype"\)/g, (match, name) => lookup[`${name}.woff2`] ? `src:url(${lookup[`${name}.woff2`]}) format("woff2")` : match);

export const exportAssets = { revealJs, revealCss, resetCss, katexCss: inlineKatexFonts(katexCss, fontByName) };
