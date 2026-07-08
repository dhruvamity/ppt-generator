export const exportToRevealJS = (config, activeSlides, theme) => {
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${config.mainTitle1} ${config.mainTitle2}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reset.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/black.min.css">
    
    <style>
        .reveal { background-color: #${theme.bgColor}; font-family: Arial, sans-serif; }
        .reveal h1, .reveal h2 { color: #${theme.cyan}; }
        .reveal h1 span { color: #${theme.gold}; }
        .badge { display: inline-block; background: #${theme.cyan}; color: #${theme.textBlack}; padding: 5px 15px; border-radius: 8px; font-size: 0.5em; margin-bottom: 20px;}
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; margin-top: 40px; font-size: 0.8em; color: #${theme.textWhite}; }
        .options-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
        .q-text { color: #${theme.textWhite}; text-align: left; font-size: 0.9em; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <section>
                <h1>${config.mainTitle1} <span>${config.mainTitle2}</span></h1>
                <p style="color: #${theme.textWhite};">${config.pill1} | ${config.pill2}</p>
                <p style="font-size: 0.5em; color: #${theme.gold};">${config.footer}</p>
            </section>`;

    activeSlides.forEach(slide => {
        let optionsHtml = '';
        if (slide.options && slide.options.length > 0) {
            const totalChars = slide.options.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
            const gridClass = (totalChars < 60 && slide.options.length === 4) ? 'cols-4' : '';
            
            optionsHtml = `<div class="options-grid ${gridClass}">`;
            slide.options.forEach(opt => {
                optionsHtml += `<div><strong>(${opt.label})</strong> ${opt.text}</div>`;
            });
            optionsHtml += '</div>';
        }

        htmlContent += `
            <section>
                <div class="badge">${slide.badge} &mdash; ${slide.tag}</div>
                <div class="q-text">${slide.qText}</div>
                ${optionsHtml}
            </section>`;
    });

    htmlContent += `
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/math/math.min.js"></script>
    <script>
        Reveal.initialize({
            controls: true, progress: true, center: true, hash: true, transition: 'slide',
            math: {
                mathjax: 'https://cdn.jsdelivr.net/gh/mathjax/mathjax@2.7.8/MathJax.js',
                config: 'TeX-AMS_HTML-full',
                tex2jax: {
                    inlineMath: [['$','$'], ['\\\\(','\\\\)']],
                    displayMath: [['$$','$$'], ['\\\\[','\\\\]']],
                    processEscapes: true
                }
            },
            plugins: [ RevealMath ]
        });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.mainTitle1}_${config.mainTitle2}_Presentation.html`.replace(/ /g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
