// Vite-only bundle of everything the exported deck needs to run offline: Reveal.js, its CSS and
// KaTeX's CSS with the woff2 fonts inlined. `buildRevealHtml` falls back to CDN links without it.
import revealJs from 'reveal.js/dist/reveal.js?raw';
import revealCss from 'reveal.js/dist/reveal.css?raw';
import resetCss from 'reveal.js/dist/reset.css?raw';
import notesJs from 'reveal.js/plugin/notes/notes.js?raw';

export async function loadExportAssets() {
    const { offlineKatexCss: katexCss } = await import('./exportKatexAssets.js');
    return { revealJs, revealCss, resetCss, notesJs, katexCss };
}
