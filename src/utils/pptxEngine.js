import pptxgen from 'pptxgenjs';
import katex from 'katex';
import html2canvas from 'html2canvas';

export const THEMES = {
    'dark-neon': {
        name: 'Dark Neon', bgColor: '05050F', cyan: '00E5FF', purple: '7C3AED',
        gold: 'FFD700', tealDecor: '008080', bgCard: '0A0A1F', textWhite: 'FFFFFF',
        textBlack: '000000', decorPurple: '7C3AED'
    },
    'clean-light': {
        name: 'Clean Light', bgColor: 'F8F9FF', cyan: '2563EB', purple: '0D9488',
        gold: 'F59E0B', tealDecor: '86F2E4', bgCard: 'FFFFFF', textWhite: '0B1C30',
        textBlack: 'FFFFFF', decorPurple: '0D9488'
    },
    'minimalist-blue': {
        name: 'Minimalist Blue', bgColor: '0F172A', cyan: '38BDF8', purple: '818CF8',
        gold: '94A3B8', tealDecor: '1E293B', bgCard: '1E293B', textWhite: 'F8FAFC',
        textBlack: '0F172A', decorPurple: '818CF8'
    },
    'retro-terminal': {
        name: 'Retro Terminal', bgColor: '001A00', cyan: '00FF00', purple: '008800',
        gold: '00FF44', tealDecor: '003300', bgCard: '002200', textWhite: '00FF00',
        textBlack: '000000', decorPurple: '005500'
    },
    'academic-classic': {
        name: 'Academic Classic', bgColor: 'FDFBF7', cyan: '800020', purple: '002147',
        gold: 'D4AF37', tealDecor: 'E8E3D2', bgCard: 'FFFFFF', textWhite: '2C2C2C',
        textBlack: 'FFFFFF', decorPurple: '002147'
    },
    'sunset-orange': {
        name: 'Sunset Orange', bgColor: '1A1A1A', cyan: 'FF4500', purple: 'FF8C00',
        gold: 'FFD700', tealDecor: '2D2D2D', bgCard: '242424', textWhite: 'F5F5F5',
        textBlack: '000000', decorPurple: '4A2511'
    }
};

const renderMathToBase64 = async (mathString, isBlock, colorHex) => {
    return new Promise(async (resolve) => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = '-9999px';
        div.style.left = '-9999px';
        div.style.color = `#${colorHex}`;
        document.body.appendChild(div);
        try {
            katex.render(mathString, div, { displayMode: isBlock });
            const canvas = await html2canvas(div, { backgroundColor: null, scale: 2, logging: false });
            document.body.removeChild(div);
            resolve({ data: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height });
        } catch (e) {
            if(document.body.contains(div)) document.body.removeChild(div);
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = 10; fallbackCanvas.height = 10;
            resolve({ data: fallbackCanvas.toDataURL(), width: 10, height: 10 });
        }
    });
};

const addMixedContent = async (slide, text, startX, startY, width, themeColor, fontSize = 14) => {
    if (!text) return startY;
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    let currentY = startY;
    
    for (let part of parts) {
        if (!part) continue;
        
        if (part.startsWith('$$') && part.endsWith('$$')) {
            let mathStr = part.slice(2, -2);
            let imgInfo = await renderMathToBase64(mathStr, true, themeColor);
            let imgW = imgInfo.width / 96 / 2.5; 
            let imgH = imgInfo.height / 96 / 2.5;
            slide.addImage({ data: imgInfo.data, x: startX, y: currentY, w: imgW, h: imgH });
            currentY += imgH + 0.05;
        } else if (part.startsWith('$') && part.endsWith('$')) {
            let mathStr = part.slice(1, -1);
            let imgInfo = await renderMathToBase64(mathStr, false, themeColor);
            let imgW = imgInfo.width / 96 / 2.5;
            let imgH = imgInfo.height / 96 / 2.5;
            slide.addImage({ data: imgInfo.data, x: startX, y: currentY, w: imgW, h: imgH });
            currentY += imgH + 0.05;
        } else {
            let trimmed = part.replace(/^\n+|\n+$/g, '');
            if (!trimmed) continue;
            
            const charsPerLine = Math.floor(width / 0.09);
            const lines = trimmed.split('\n').reduce((acc, line) => acc + Math.ceil((line.length || 1) / charsPerLine), 0);
            const textHeight = Math.max(0.2, lines * (fontSize * 0.018));
            
            slide.addText(trimmed, { x: startX, y: currentY, w: width, h: textHeight, color: themeColor, fontSize: fontSize, fontFace: 'Arial', valign: 'top', margin: [0,0,0,0] });
            currentY += textHeight + 0.05;
        }
    }
    return currentY;
};

export const generatePPTX = async (config, finalQuestions, themeId, layoutId = 'modern-sidebar') => {
    const theme = THEMES[themeId] || THEMES['dark-neon'];
    const layoutType = layoutId;
    
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    const buildModernSidebarTitle = (slide) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.05, h: 5.625, fill: { color: theme.cyan } });
        slide.addShape(pres.ShapeType.rect, { x: 0.05, y: 0, w: 0.05, h: 5.625, fill: { color: theme.purple } });
        
        slide.addShape(pres.ShapeType.ellipse, { x: 0, y: 4.125, w: 1.5, h: 1.5, fill: { color: theme.tealDecor, transparency: 70 } });
        slide.addShape(pres.ShapeType.ellipse, { x: 8.5, y: 0, w: 1.5, h: 1.5, fill: { color: theme.decorPurple, transparency: 75 } });

        slide.addText([
            { text: config.mainTitle1 + ' ', options: { color: theme.cyan } },
            { text: config.mainTitle2, options: { color: theme.gold } }
        ], { x: 1.2, y: 1.5, w: 8, h: 1.5, fontSize: 60, bold: true, fontFace: 'Arial' });

        slide.addShape(pres.ShapeType.rect, { x: 1.2, y: 3.0, w: 6.5, h: 0.04, fill: { color: theme.gold } });
        slide.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 3.4, w: 2.8, h: 0.5, fill: { color: theme.cyan }, rectRadius: 0.3 });
        slide.addText(config.pill1, { x: 1.2, y: 3.4, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });
        slide.addShape(pres.ShapeType.roundRect, { x: 4.4, y: 3.4, w: 2.8, h: 0.5, line: { color: theme.purple, width: 2.5 }, fill: { color: theme.bgColor }, rectRadius: 0.3 });
        slide.addText(config.pill2, { x: 4.4, y: 3.4, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle' });
        slide.addText(config.footer, { x: 1.2, y: 4.2, w: 8, h: 0.5, fontSize: 16, color: theme.textWhite, letterSpacing: 3 });
    };

    const buildClassicHeaderTitle = (slide) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 2, fill: { color: theme.purple } });
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 1.9, w: 10, h: 0.1, fill: { color: theme.gold } });
        
        slide.addText([
            { text: config.mainTitle1 + ' ', options: { color: theme.textBlack } },
            { text: config.mainTitle2, options: { color: theme.cyan } }
        ], { x: 0.5, y: 0.3, w: 9, h: 1.2, fontSize: 50, bold: true, fontFace: 'Arial', align: 'center' });

        slide.addShape(pres.ShapeType.roundRect, { x: 2, y: 2.8, w: 2.8, h: 0.5, fill: { color: theme.cyan }, rectRadius: 0.2 });
        slide.addText(config.pill1, { x: 2, y: 2.8, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });

        slide.addShape(pres.ShapeType.roundRect, { x: 5.2, y: 2.8, w: 2.8, h: 0.5, fill: { color: theme.purple }, rectRadius: 0.2 });
        slide.addText(config.pill2, { x: 5.2, y: 2.8, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });

        slide.addText(config.footer, { x: 0.5, y: 4.5, w: 9, h: 0.5, fontSize: 16, color: theme.textWhite, letterSpacing: 2, align: 'center' });
    };

    const buildSplitFocusTitle = (slide) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.5, h: 5.625, fill: { color: theme.purple } });
        slide.addShape(pres.ShapeType.rect, { x: 4.5, y: 0, w: 0.05, h: 5.625, fill: { color: theme.gold } });

        slide.addShape(pres.ShapeType.roundRect, { x: 0.8, y: 2.0, w: 2.8, h: 0.5, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(config.pill1, { x: 0.8, y: 2.0, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });
        
        slide.addShape(pres.ShapeType.roundRect, { x: 0.8, y: 2.8, w: 2.8, h: 0.5, fill: { color: theme.gold }, rectRadius: 0.1 });
        slide.addText(config.pill2, { x: 0.8, y: 2.8, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });

        slide.addText([
            { text: config.mainTitle1 + '\n', options: { color: theme.textWhite } },
            { text: config.mainTitle2, options: { color: theme.cyan } }
        ], { x: 5, y: 1.5, w: 4.5, h: 2, fontSize: 54, bold: true, fontFace: 'Arial' });

        slide.addText(config.footer, { x: 5, y: 4.5, w: 4.5, h: 0.5, fontSize: 14, color: theme.textWhite, letterSpacing: 2 });
    };

    const renderOptionsGrid = async (slide, q, optionsColor, qEndY, startX, contentWidth) => {
        if (q.options && q.options.length > 0) {
            let optionsY = qEndY + (14 * 0.018 * 1.5);
            let colWidth = contentWidth / 4;
            for (let i = 0; i < q.options.length; i++) {
                let opt = q.options[i];
                let optX = startX + (i % 4) * colWidth;
                let optY = optionsY + Math.floor(i / 4) * 0.6;
                slide.addText(`(${opt.label})`, { x: optX, y: optY, w: 0.35, h: 0.25, color: optionsColor, bold: true, fontSize: 14, fontFace: 'Arial' });
                await addMixedContent(slide, opt.text, optX + 0.35, optY, colWidth - 0.4, optionsColor, 14);
            }
        }
    };

    const buildModernSidebarQuestion = async (slide, q) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.05, h: 5.625, fill: { color: theme.cyan } });
        slide.addShape(pres.ShapeType.rect, { x: 0.05, y: 0, w: 0.05, h: 5.625, fill: { color: theme.purple } });
        
        slide.addShape(pres.ShapeType.roundRect, { x: 0.15, y: 0.1, w: 0.6, h: 0.25, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(q.badge, { x: 0.15, y: 0.1, w: 0.6, h: 0.25, fontSize: 12, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle', fontFace: 'Arial' });
        
        slide.addShape(pres.ShapeType.roundRect, { x: 9.0, y: 0.1, w: 0.8, h: 0.25, fill: { color: theme.bgCard }, line: { color: theme.purple, width: 1 }, rectRadius: 0.1 });
        slide.addText(q.tag.toUpperCase(), { x: 9.0, y: 0.1, w: 0.8, h: 0.25, fontSize: 10, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle', fontFace: 'Arial' });

        let startX = 0.8, startY = 0.1, contentWidth = 9.2;
        let qEndY = await addMixedContent(slide, q.qText, startX, startY, contentWidth, theme.textWhite, 14);
        await renderOptionsGrid(slide, q, theme.cyan, qEndY, startX, contentWidth);
    };

    const buildClassicHeaderQuestion = async (slide, q) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.05, fill: { color: theme.purple } });
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0.05, w: 10, h: 0.02, fill: { color: theme.gold } });

        slide.addShape(pres.ShapeType.roundRect, { x: 0.1, y: 0.1, w: 0.6, h: 0.25, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(q.badge, { x: 0.1, y: 0.1, w: 0.6, h: 0.25, fontSize: 12, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle', fontFace: 'Arial' });

        slide.addShape(pres.ShapeType.roundRect, { x: 9.0, y: 0.1, w: 0.8, h: 0.25, fill: { color: theme.bgColor }, rectRadius: 0.1 });
        slide.addText(q.tag.toUpperCase(), { x: 9.0, y: 0.1, w: 0.8, h: 0.25, fontSize: 10, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle', bold: true, fontFace: 'Arial' });

        let startX = 0.8, startY = 0.1, contentWidth = 9.2;
        let qEndY = await addMixedContent(slide, q.qText, startX, startY, contentWidth, theme.textWhite, 14);
        await renderOptionsGrid(slide, q, theme.cyan, qEndY, startX, contentWidth);
    };

    const buildSplitFocusQuestion = async (slide, q) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: 5.625, fill: { color: theme.purple } });
        
        slide.addShape(pres.ShapeType.roundRect, { x: 0.15, y: 0.1, w: 0.6, h: 0.25, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(q.badge, { x: 0.15, y: 0.1, w: 0.6, h: 0.25, fontSize: 12, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle', fontFace: 'Arial' });

        slide.addShape(pres.ShapeType.roundRect, { x: 9.0, y: 0.1, w: 0.8, h: 0.25, fill: { color: theme.bgColor }, rectRadius: 0.1 });
        slide.addText(q.tag.toUpperCase(), { x: 9.0, y: 0.1, w: 0.8, h: 0.25, fontSize: 10, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle', bold: true, fontFace: 'Arial' });

        let startX = 0.8, startY = 0.1, contentWidth = 9.2;
        let qEndY = await addMixedContent(slide, q.qText, startX, startY, contentWidth, theme.textWhite, 14);
        await renderOptionsGrid(slide, q, theme.gold, qEndY, startX, contentWidth);
    };

    let titleSlide = pres.addSlide();
    titleSlide.background = { color: theme.bgColor };
    if (layoutType === 'classic-header') {
        buildClassicHeaderTitle(titleSlide);
    } else if (layoutType === 'split-focus') {
        buildSplitFocusTitle(titleSlide);
    } else {
        buildModernSidebarTitle(titleSlide);
    }

    for (const q of finalQuestions) {
        let qSlide = pres.addSlide();
        qSlide.background = { color: theme.bgColor };
        
        if (layoutType === 'classic-header') {
            await buildClassicHeaderQuestion(qSlide, q);
        } else if (layoutType === 'split-focus') {
            await buildSplitFocusQuestion(qSlide, q);
        } else {
            await buildModernSidebarQuestion(qSlide, q);
        }
    }

    return pres.writeFile({ fileName: `${config.mainTitle1}_${config.mainTitle2}_Presentation.pptx`.replace(/\s+/g, '_') });
};
