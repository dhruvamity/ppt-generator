import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { buildRevealHtml } from './exportRevealJS.js';
import { deckSequence } from './deckSequence.js';
import { fileStem } from './download.js';

export async function exportPowerPoint(config, slides, theme, layout, assets, onProgress = () => {}) {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'DECKFUL', width: 10, height: 5.625 });
    pptx.layout = 'DECKFUL';
    pptx.title = [config.mainTitle1, config.mainTitle2].filter(Boolean).join(' ');
    const frame = document.createElement('iframe');
    frame.title = 'PowerPoint slide rendering';
    frame.style.cssText = 'position:fixed;left:-1300px;top:0;width:1280px;height:720px;border:0;pointer-events:none';
    let deadline;
    const ready = new Promise((_, reject) => {
        deadline = setTimeout(() => reject(new Error('The presentation renderer did not start. Try again.')), 20_000);
    });
    try {
        await Promise.race([ready, new Promise((resolve, reject) => {
            frame.onload = resolve;
            frame.onerror = () => reject(new Error('Could not load the presentation.'));
            frame.srcdoc = buildRevealHtml(config, slides, theme, layout, assets, { embedded: true });
            document.body.appendChild(frame);
        })]);
        if (!frame.contentWindow.slidesReady) throw new Error('Could not render the presentation.');
        await Promise.race([ready, frame.contentWindow.slidesReady]);
        clearTimeout(deadline);
        const doc = frame.contentDocument;
        const warning = doc.getElementById('slide-overflow-warning');
        if (!warning.hidden) throw new Error(warning.textContent.replace('PDF', 'PowerPoint'));
        const items = [...doc.querySelectorAll('.slides .slide-container')];
        const sequence = deckSequence(config, slides);
        const stage = doc.createElement('div');
        stage.className = 'reveal';
        stage.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:720px;z-index:10000';
        doc.body.appendChild(stage);
        for (const [index, item] of items.entries()) {
            onProgress(index + 1, items.length);
            const clone = item.cloneNode(true);
            clone.querySelectorAll('.answer-opt').forEach(node => node.classList.remove('visible'));
            clone.querySelectorAll('.answer-line').forEach(node => node.remove());
            stage.replaceChildren(clone);
            const canvas = await html2canvas(clone, {
                width: 1280, height: 720, windowWidth: 1280, windowHeight: 720,
                scale: 1.5, backgroundColor: null, logging: false,
            });
            const page = pptx.addSlide();
            page.addImage({ data: canvas.toDataURL('image/png'), x: 0, y: 0, w: 10, h: 5.625,
                altText: clone.textContent.trim().replace(/\s+/g, ' ').slice(0, 1000) });
            const entry = sequence[index];
            if (['question', 'concept', 'formula'].includes(entry?.kind) && entry.slide.notes) page.addNotes(entry.slide.notes);
            canvas.width = canvas.height = 0;
        }
        await pptx.writeFile({ fileName: fileStem(pptx.title) + '.pptx', compression: true });
    } finally {
        clearTimeout(deadline);
        frame.remove();
    }
}
