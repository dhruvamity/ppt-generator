// Helper to force \displaystyle on all inline math so fractions are tall
const enforceDisplayMath = (text) => {
    if (!text) return "";
    return text.replace(/\$([^$]+)\$/g, '$\\displaystyle $1$');
};

export const exportToRevealJS = (config, activeSlides, theme) => {
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${config.mainTitle1} ${config.mainTitle2}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reset.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
    
    <style>
        body { background-color: #${theme.bgColor}; }
        .reveal { font-family: 'Segoe UI', Arial, sans-serif; color: #${theme.textWhite}; }
        
        /* Force PPT-Style Top-Left Alignment */
        .reveal .slides section {
            text-align: left;
            height: 100%;
            padding: 60px 80px !important;
            box-sizing: border-box;
        }
        
        .reveal h1 { color: #${theme.cyan}; font-size: 64px; font-weight: bold; margin-top: 15%; text-align: center; }
        .reveal h1 span { color: #${theme.gold}; }
        .subtitle { text-align: center; font-size: 32px; letter-spacing: 2px; color: #${theme.textWhite}; margin-top: 20px;}
        
        .badge { 
            display: inline-block; 
            background: #${theme.cyan}; 
            color: #${theme.textBlack}; 
            padding: 8px 24px; 
            border-radius: 8px; 
            font-size: 24px; 
            font-weight: bold;
            margin-bottom: 40px;
        }
        
        .q-text { 
            font-size: 40px; 
            line-height: 1.5; 
            margin-bottom: 50px; 
        }
        
        .options-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 40px 20px; 
            font-size: 36px; 
        }
        .options-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
        
        .opt-item strong { color: #${theme.cyan}; margin-right: 15px; }
        
        /* MathJax adjustments */
        .MathJax { font-size: 1.1em !important; }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <section style="justify-content: center; align-items: center; display: flex; flex-direction: column;">
                <h1>${config.mainTitle1} <span>${config.mainTitle2}</span></h1>
                <div class="subtitle">${config.pill1} | ${config.pill2}</div>
                <div style="position: absolute; bottom: 40px; width: 100%; text-align: center; color:#${theme.gold}; font-size: 20px;">${config.footer}</div>
            </section>`;

    activeSlides.forEach(slide => {
        let optionsHtml = '';
        if (slide.options && slide.options.length > 0) {
            const totalChars = slide.options.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
            const gridClass = (totalChars < 50 && slide.options.length === 4) ? 'cols-4' : '';
            
            optionsHtml = `<div class="options-grid ${gridClass}">`;
            slide.options.forEach(opt => {
                optionsHtml += `<div class="opt-item"><strong>(${opt.label})</strong> ${enforceDisplayMath(opt.text)}</div>`;
            });
            optionsHtml += '</div>';
        }

        htmlContent += `
            <section>
                <div class="badge">${slide.badge} &mdash; ${slide.tag}</div>
                <div class="q-text">${enforceDisplayMath(slide.qText)}</div>
                ${optionsHtml}
            </section>`;
    });

    htmlContent += `
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
    <script>
        Reveal.initialize({
            width: 1280,
            height: 720,
            margin: 0.04,
            controls: true, progress: true, center: false, hash: true, transition: 'slide',
            math: {
                mathjax: 'https://cdn.jsdelivr.net/gh/mathjax/mathjax@2.7.8/MathJax.js',
                config: 'TeX-AMS_HTML-full',
                tex2jax: { inlineMath: [['$','$']], displayMath: [['$$','$$']], processEscapes: true }
            },
            dependencies: [ { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/math/math.min.js', async: true } ]
        });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.mainTitle1}_${config.mainTitle2}_Slides.html`.replace(/ /g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
