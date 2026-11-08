// Embedded in downloaded HTML. Keep this function self-contained.
export function installSlidePdfExport() {
    const button = document.getElementById('pdf-btn');
    const loadScript = (src) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => { script.remove(); reject(new Error('Could not load the PDF exporter. Check your connection and try again.')); };
        document.head.appendChild(script);
    });

    button.addEventListener('click', async () => {
        if (button.disabled) return;
        button.disabled = true;
        button.textContent = 'Preparing PDF…';
        let stage;
        try {
            await window.slidesReady;
            await document.fonts.ready;
            if (!window.html2canvas) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

            // Workspace slides are intentional solution pages when enabled in
            // the generator. Keep them alongside question and title slides.
            const slides = [...document.querySelectorAll('.slides .slide-container')];
            if (!slides.length) throw new Error('No slides to export.');
            const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: [960, 540], compress: true });
            // Render outside Reveal so its viewport scaling and hidden slides
            // cannot affect the captured canvas. Only the 1280 x 720 slide is captured.
            stage = document.createElement('div');
            stage.className = 'reveal pdf-capture-stage';
            stage.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:720px;z-index:-9999;pointer-events:none;';
            document.body.appendChild(stage);
            for (let i = 0; i < slides.length; i++) {
                button.textContent = 'Saving slide ' + (i + 1) + ' of ' + slides.length + '…';
                const clone = slides[i].cloneNode(true);
                stage.replaceChildren(clone);
                // MathJax 2's SVG uses `currentColor`; html2canvas serializes
                // cloned SVGs without the inherited slide color, turning math
                // black on dark slides. Inline the effective color before capture.
                clone.querySelectorAll('.MathJax_SVG').forEach(math => {
                    const color = getComputedStyle(math).color;
                    math.style.color = color;
                    math.querySelectorAll('svg g, svg use, svg path, svg rect, svg polygon, svg polyline, svg ellipse').forEach(shape => {
                        if (shape.getAttribute('fill') !== 'none') shape.setAttribute('fill', color);
                        if (shape.getAttribute('stroke') === 'currentColor') shape.setAttribute('stroke', color);
                    });
                });
                const canvas = await window.html2canvas(clone, {
                    width: 1280, height: 720, scale: 2, backgroundColor: null,
                    windowWidth: 1280, windowHeight: 720, scrollX: 0, scrollY: 0,
                    useCORS: true, logging: false,
                });
                if (i) pdf.addPage([960, 540], 'landscape');
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 960, 540, undefined, 'FAST');
                canvas.width = canvas.height = 0;
            }
            pdf.save((document.title || 'Slides').replace(/[\\/:*?"<>|]/g, '_') + '.pdf');
        } catch (error) {
            window.alert(error.message || 'PDF export failed. Please try again.');
        } finally {
            stage?.remove();
            button.disabled = false;
            button.textContent = 'Save as PDF';
        }
    });
}
