
const enforceDisplayMath = (text) => {
    if (!text) return "";
    const parts = text.split('$');
    return parts.map((part, index) => {
        if (part === '') return '';
        if (index % 2 !== 0) {
            return `$\\displaystyle ${part}$`;
        }
        return part;
    }).join('');
};

const x = (val) => (val * 128) + 'px';
const y = (val) => (val * 128) + 'px';
const w = (val) => (val * 128) + 'px';
const h = (val) => (val * 128) + 'px';
const fs = (pt) => (pt * 1.77664) + 'px';

export const exportToRevealJS = (config, activeSlides, theme, layoutId = 'modern-sidebar') => {
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${config.mainTitle1} ${config.mainTitle2}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reset.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
    
    <style>
        html, body, .reveal { background-color: #${theme.bgColor} !important; margin: 0; padding: 0; width: 100%; height: 100%; }
        .reveal { font-family: 'Segoe UI', Arial, sans-serif; color: #${theme.textWhite}; }
        .reveal .slides section {
            text-align: left;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box;
            position: relative;
        }
        .MathJax { font-size: 1.1em !important; }
        
        .slide-container {
            position: relative;
            width: 1280px;
            height: 720px;
            background-color: #${theme.bgColor};
            overflow: hidden;
            box-sizing: border-box;
        }

        @media print {
            @page {
                size: 1280px 720px;
                margin: 0;
            }
            body {
                background-color: #${theme.bgColor} !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0 !important;
                padding: 0 !important;
            }
            .reveal, .reveal .slides {
                width: 1280px !important;
                height: 720px !important;
                transform: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
            }
            .reveal .slides section {
                display: block !important;
                opacity: 1 !important;
                position: relative !important;
                width: 1280px !important;
                height: 720px !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                transform: none !important;
                visibility: visible !important;
                top: 0 !important;
                left: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            #pdf-btn { display: none !important; }
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
`;

    const renderGlobalDecorations = () => `
        <div style="position: absolute; left: ${x(-0.5)}; top: ${y(-0.5)}; width: ${w(2.0)}; height: ${h(2.0)}; background-color: #${theme.tealDecor}; opacity: 0.2; border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: ${x(8.5)}; top: ${y(4.125)}; width: ${w(2.0)}; height: ${h(2.0)}; background-color: #${theme.decorPurple}; opacity: 0.2; border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: ${x(0)}; top: ${y(5.5)}; width: ${w(10)}; height: ${h(0.125)}; background-color: #${theme.gold}; opacity: 0.8;"></div>
        <div style="position: absolute; left: ${x(0.3)}; top: ${y(5.2)}; width: ${w(3.0)}; height: ${h(0.25)}; font-size: ${fs(10)}; color: #${theme.textWhite}; opacity: 0.6; display: flex; align-items: center; letter-spacing: 1.5px;">
            <strong style="color: #${theme.cyan}">SLIDEGEN</strong>&nbsp;PRO
        </div>
    `;

    const renderOptionsGrid = (options, color) => {
        const optionsArray = Array.isArray(options) ? options : [];
        if (optionsArray.length === 0) return '';
        
        const totalChars = optionsArray.reduce((sum, opt) => sum + (opt.text ? opt.text.length : 0), 0);
        const cols = totalChars < 60 && optionsArray.length === 4 ? 4 : 2;
        const width = cols === 4 ? '23%' : '48%';

        let optsHtml = `<div style="margin-top: 2em; display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between; gap: 1rem;">`;
        optionsArray.forEach(opt => {
            optsHtml += `
                <div style="width: ${width}; margin-bottom: 0.25rem; color: #${color}; font-size: ${fs(11)}; line-height: 1.5;">
                    <strong>(${opt.label})</strong> <span style="display: inline-block; width: 80%; vertical-align: top;">${enforceDisplayMath(opt.text)}</span>
                </div>
            `;
        });
        optsHtml += '</div>';
        return optsHtml;
    };

    const generateSlideHtml = (isTitle, slide, layoutType) => {
        let slideHtml = '';

        if (theme.name === 'Cyberpunk Neon') {
            const isWorkspace = slide?.isWorkspace || false;
            const accentColor = isWorkspace ? theme.gold : theme.cyan;
            const headerText = isWorkspace ? 'WORK SPACE' : slide?.badge || 'Q';
            const qNum = slide?.badge ? slide.badge.replace('Q.', 'Q') : 'Q1';

            const renderModernNeonDecorations = () => `
                <div style="position: absolute; right: ${x(-1.0)}; top: ${y(-1.5)}; width: ${w(4.0)}; height: ${h(4.0)}; background-color: #${theme.purple}; border: 24px solid #${theme.gold}; border-radius: 50%; z-index: 0;"></div>
                <div style="position: absolute; left: ${x(-1.5)}; bottom: ${y(-2.0)}; width: ${w(4.0)}; height: ${h(4.0)}; background-color: #${theme.cyan}; border-radius: 50%; z-index: 0;"></div>
                ${!isTitle ? `<div style="position: absolute; right: ${x(0.5)}; bottom: ${y(0.8)}; font-size: ${fs(150)}; font-weight: bold; color: #${theme.watermark}; z-index: 0; line-height: 1;">${qNum}</div>` : ''}
                <div style="position: absolute; left: 0; bottom: 0; width: 40%; height: ${h(0.4)}; background-color: #${theme.magenta}; z-index: 1;"></div>
                <div style="position: absolute; left: 40%; bottom: 0; width: 60%; height: ${h(0.4)}; background-color: #${theme.purple}; z-index: 1;"></div>
            `;

            if (isTitle) {
                slideHtml = `
                    ${renderModernNeonDecorations()}
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                        <div style="font-size: ${fs(60)}; font-weight: bold; color: #${theme.textWhite}; text-align: center; margin-bottom: 20px;">
                            ${config?.mainTitle1} <span style="color: #${theme.cyan}">${config?.mainTitle2}</span>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div style="background-color: #${theme.cyan}; padding: 10px 30px; border-radius: 8px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${config?.pill1}</div>
                            <div style="border: 2px solid #${theme.magenta}; padding: 10px 30px; border-radius: 8px; font-size: ${fs(16)}; font-weight: bold; color: #${theme.magenta}">${config?.pill2}</div>
                        </div>
                        <div style="margin-top: 40px; font-size: ${fs(18)}; color: #${theme.textWhite}; letter-spacing: 4px;">${config?.footer}</div>
                    </div>
                `;
            } else {
                let bodyContent = '';
                if (isWorkspace) {
                    bodyContent = `
                        <div style="width: 100%; height: 100%; background: repeating-linear-gradient(to bottom, transparent, transparent 49px, #${theme.watermark} 49px, #${theme.watermark} 50px);"></div>
                    `;
                } else {
                    bodyContent = `
                        <div style="color: #${theme.textWhite}; font-size: ${fs(11)}; line-height: 1.5; white-space: pre-wrap;">${enforceDisplayMath(slide.qText)}</div>
                        ${renderOptionsGrid(slide.options, theme.cyan)}
                    `;
                }

                slideHtml = `
                    ${renderModernNeonDecorations()}
                    
                    <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.5)}; display: flex; align-items: center; z-index: 10; width: ${w(9.0)};">
                        ${isWorkspace 
                            ? `<div style="font-size: ${fs(14)}; font-weight: bold; color: #${theme.gold}; padding-right: 15px;">WORK SPACE</div>` 
                            : `<div style="background-color: #${theme.cyan}; padding: 5px 20px; font-size: ${fs(14)}; font-weight: bold; color: #${theme.textBlack}; border-radius: 8px 0 0 8px;">${headerText}</div>`
                        }
                        <div style="flex-grow: 1; height: 2px; background-color: #${accentColor};"></div>
                        <div style="background-color: #${theme.bgColor}; border: 1px solid #${theme.cyan}; padding: 5px 15px; font-size: ${fs(10)}; font-weight: bold; color: #${theme.textWhite}; margin-left: 10px;">${(slide?.tag || '').toUpperCase()}</div>
                    </div>

                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 120px 60px 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10;">
                        ${bodyContent}
                    </div>
                `;
            }
            
            return `
                <section>
                    <div class="slide-container">
                        ${slideHtml}
                    </div>
                </section>`;
        }

        if (isTitle && layoutType === 'modern-sidebar') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.cyan}"></div>
                <div style="position: absolute; left: ${x(0.05)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(1.5)}; width: ${w(8)}; height: ${h(1.5)}; font-size: ${fs(54)}; font-weight: bold; display: flex; align-items: center;">
                    <span style="color: #${theme.cyan}">${config?.mainTitle1}&nbsp;</span>
                    <span style="color: #${theme.gold}">${config?.mainTitle2}</span>
                </div>

                <div style="position: absolute; left: ${x(1.2)}; top: ${y(3.0)}; width: ${w(6.5)}; height: ${h(0.04)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(1.2)}; top: ${y(3.4)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${config?.pill1}</div>
                <div style="position: absolute; left: ${x(4.4)}; top: ${y(3.4)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.bgColor}; border: 3px solid #${theme.purple}; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.purple}; box-sizing: border-box;">${config?.pill2}</div>
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(4.2)}; width: ${w(8)}; height: ${h(0.5)}; font-size: ${fs(16)}; color: #${theme.textWhite}; letter-spacing: 4px; display: flex; align-items: center;">${config?.footer}</div>
            `;
        } else if (!isTitle && layoutType === 'modern-sidebar') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.cyan}"></div>
                <div style="position: absolute; left: ${x(0.05)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                
                <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; width: ${w(0.6)}; height: ${h(0.25)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${slide.badge}</div>
                
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(0.7)}; width: ${w(8.6)}; height: ${h(0.02)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>

                <div style="position: absolute; left: ${x(7.5)}; top: ${y(5.1)}; width: ${w(2.0)}; height: ${h(0.25)}; background-color: #${theme.bgCard}; border: 1.5px solid #${theme.purple}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(10)}; color: #${theme.purple}; box-sizing: border-box; font-weight: bold;">${(slide.tag || '').toUpperCase()}</div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 100px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                    <div style="color: #${theme.textWhite}; font-size: ${fs(11)}; line-height: 1.5; white-space: pre-wrap;">${enforceDisplayMath(slide.qText)}</div>
                    ${renderOptionsGrid(slide.options, theme.cyan)}
                </div>
            `;
        } else if (isTitle && layoutType === 'classic-header') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(10)}; height: ${h(2)}; background-color: #${theme.purple}"></div>
                <div style="position: absolute; left: ${x(0)}; top: ${y(1.9)}; width: ${w(10)}; height: ${h(0.1)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(0.5)}; top: ${y(0.3)}; width: ${w(9)}; height: ${h(1.2)}; font-size: ${fs(45)}; font-weight: bold; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <span style="color: #${theme.textBlack}">${config?.mainTitle1}&nbsp;</span>
                    <span style="color: #${theme.cyan}">${config?.mainTitle2}</span>
                </div>

                <div style="position: absolute; left: ${x(2)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${config?.pill1}</div>
                <div style="position: absolute; left: ${x(5.2)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.purple}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${config?.pill2}</div>
                <div style="position: absolute; left: ${x(0.5)}; top: ${y(4.5)}; width: ${w(9)}; height: ${h(0.5)}; font-size: ${fs(16)}; color: #${theme.textWhite}; letter-spacing: 2px; display: flex; align-items: center; justify-content: center;">${config?.footer}</div>
            `;
        } else if (!isTitle && layoutType === 'classic-header') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(10)}; height: ${h(0.05)}; background-color: #${theme.purple}"></div>
                <div style="position: absolute; left: ${x(0)}; top: ${y(0.05)}; width: ${w(10)}; height: ${h(0.02)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; width: ${w(0.6)}; height: ${h(0.25)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${slide.badge}</div>
                
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(0.7)}; width: ${w(8.6)}; height: ${h(0.02)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>

                <div style="position: absolute; left: ${x(7.5)}; top: ${y(5.1)}; width: ${w(2.0)}; height: ${h(0.25)}; background-color: #${theme.bgColor}; border: 1.5px solid #${theme.purple}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(10)}; color: #${theme.purple}; font-weight: bold;">${(slide.tag || '').toUpperCase()}</div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 100px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                    <div style="color: #${theme.textWhite}; font-size: ${fs(11)}; line-height: 1.5; white-space: pre-wrap;">${enforceDisplayMath(slide.qText)}</div>
                    ${renderOptionsGrid(slide.options, theme.cyan)}
                </div>
            `;
        } else if (isTitle && layoutType === 'split-focus') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(4.5)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                <div style="position: absolute; left: ${x(4.5)}; top: ${y(0)}; width: ${w(0.05)}; height: ${h(5.625)}; background-color: #${theme.gold}"></div>

                <div style="position: absolute; left: ${x(0.8)}; top: ${y(2.0)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${config?.pill1}</div>
                <div style="position: absolute; left: ${x(0.8)}; top: ${y(2.8)}; width: ${w(2.8)}; height: ${h(0.5)}; background-color: #${theme.gold}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(16)}; font-weight: bold; color: #${theme.textBlack}">${config?.pill2}</div>

                <div style="position: absolute; left: ${x(5)}; top: ${y(1.5)}; width: ${w(4.5)}; height: ${h(2)}; font-size: ${fs(49)}; font-weight: bold; display: flex; flex-direction: column; justify-content: center;">
                    <span style="color: #${theme.textWhite}">${config?.mainTitle1}</span>
                    <span style="color: #${theme.cyan}">${config?.mainTitle2}</span>
                </div>

                <div style="position: absolute; left: ${x(5)}; top: ${y(4.5)}; width: ${w(4.5)}; height: ${h(0.5)}; font-size: ${fs(14)}; color: #${theme.textWhite}; letter-spacing: 2px; display: flex; align-items: center;">${config?.footer}</div>
            `;
        } else if (!isTitle && layoutType === 'split-focus') {
            slideHtml = `
                ${renderGlobalDecorations()}
                <div style="position: absolute; left: ${x(0)}; top: ${y(0)}; width: ${w(0.1)}; height: ${h(5.625)}; background-color: #${theme.purple}"></div>
                
                <div style="position: absolute; left: ${x(0.4)}; top: ${y(0.2)}; width: ${w(0.6)}; height: ${h(0.25)}; background-color: #${theme.cyan}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(12)}; font-weight: bold; color: #${theme.textBlack}">${slide.badge}</div>
                
                <div style="position: absolute; left: ${x(1.2)}; top: ${y(0.7)}; width: ${w(8.6)}; height: ${h(0.02)}; background-color: #${theme.cyan}; opacity: 0.5;"></div>

                <div style="position: absolute; left: ${x(7.5)}; top: ${y(5.1)}; width: ${w(2.0)}; height: ${h(0.25)}; background-color: #${theme.bgColor}; border: 1.5px solid #${theme.purple}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: ${fs(10)}; color: #${theme.purple}; font-weight: bold;">${(slide.tag || '').toUpperCase()}</div>

                <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 100px 40px 40px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
                    <div style="color: #${theme.textWhite}; font-size: ${fs(11)}; line-height: 1.5; white-space: pre-wrap;">${enforceDisplayMath(slide.qText)}</div>
                    ${renderOptionsGrid(slide.options, theme.gold)}
                </div>
            `;
        }
        
        return `
            <section>
                <div class="slide-container">
                    ${slideHtml}
                </div>
            </section>`;
    };

    // Wrap all slides in a single section for vertical (up-down) navigation
    htmlContent += `<section>\n`;

    // GENERATE TITLE SLIDE FIRST
    htmlContent += generateSlideHtml(true, null, layoutId);

    // GENERATE QUESTION SLIDES
    activeSlides.forEach(slide => {
        htmlContent += generateSlideHtml(false, slide, layoutId);
        
        if (config.insertBlankSlides) {
            // Generate identical slide but without qText or options
            const blankSlide = { ...slide, qText: '', options: [] };
            htmlContent += generateSlideHtml(false, blankSlide, layoutId);
        }
    });

    // Close the vertical stack
    htmlContent += `</section>\n`;

    htmlContent += `
        </div>
    </div>

    <!-- Floating PDF Export Button -->
    <div id="pdf-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #${theme.cyan}; color: black; padding: 10px 20px; border-radius: 8px; font-family: sans-serif; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); opacity: 0.8; transition: opacity 0.2s;">
        📥 Save as PDF
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/math/math.min.js"></script>
    <script>
        Reveal.initialize({
            width: 1280,
            height: 720,
            margin: 0,
            minScale: 0.1,
            maxScale: 3.0,
            controls: true, progress: true, center: true, hash: true, transition: 'slide',
            pdfSeparateFragments: false,
            math: {
                mathjax: 'https://cdn.jsdelivr.net/gh/mathjax/mathjax@2.7.8/MathJax.js',
                config: 'TeX-AMS_HTML-full',
                tex2jax: { inlineMath: [['$','$']], displayMath: [['$$','$$']], processEscapes: true }
            },
            plugins: [ RevealMath.MathJax2 ]
        });

        // PDF Print Logic
        document.getElementById('pdf-btn').addEventListener('click', () => {
            if (!window.location.search.match(/print-pdf/gi)) {
                window.location.search = '?print-pdf';
            } else {
                window.print();
            }
        });

        // Auto-print if URL contains ?print-pdf
        if (window.location.search.match(/print-pdf/gi)) {
            document.getElementById('pdf-btn').innerText = "🖨️ Click to Print";
            setTimeout(() => {
                window.print();
            }, 2000); // Wait for MathJax to render
        }
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
