import katexCss from 'katex/dist/katex.min.css?raw';

const fonts = import.meta.glob('/node_modules/katex/dist/fonts/*.woff2', { query: '?inline', eager: true, import: 'default' });
const fontByName = Object.fromEntries(Object.entries(fonts).map(([path, uri]) => [path.split('/').pop(), uri]));

export const inlineKatexFonts = (css, lookup) => css
    .replace(/src:url\(fonts\/([\w-]+)\.woff2\) format\("woff2"\),url\(fonts\/[\w-]+\.woff\) format\("woff"\),url\(fonts\/[\w-]+\.ttf\) format\("truetype"\)/g, (match, name) => lookup[`${name}.woff2`] ? `src:url(${lookup[`${name}.woff2`]}) format("woff2")` : match);

export const offlineKatexCss = inlineKatexFonts(katexCss, fontByName);
