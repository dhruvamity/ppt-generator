import pptxgen from 'pptxgenjs';

export const THEMES = {
    'dark-neon': {
        name: 'Dark Neon',
        bgColor: '05050F',
        cyan: '00E5FF',
        purple: '7C3AED',
        gold: 'FFD700',
        tealDecor: '008080',
        bgCard: '0A0A1F',
        textWhite: 'FFFFFF',
        textBlack: '000000',
        decorPurple: '7C3AED'
    },
    'clean-light': {
        name: 'Clean Light',
        bgColor: 'F8F9FF',
        cyan: '2563EB',
        purple: '0D9488',
        gold: 'F59E0B',
        tealDecor: '86F2E4',
        bgCard: 'FFFFFF',
        textWhite: '0B1C30',
        textBlack: 'FFFFFF',
        decorPurple: '0D9488'
    },
    'minimalist-blue': {
        name: 'Minimalist Blue',
        bgColor: '0F172A',
        cyan: '38BDF8',
        purple: '818CF8',
        gold: '94A3B8',
        tealDecor: '1E293B',
        bgCard: '1E293B',
        textWhite: 'F8FAFC',
        textBlack: '0F172A',
        decorPurple: '818CF8'
    },
    'retro-terminal': {
        name: 'Retro Terminal',
        bgColor: '001A00',
        cyan: '00FF00',
        purple: '008800',
        gold: '00FF44',
        tealDecor: '003300',
        bgCard: '002200',
        textWhite: '00FF00',
        textBlack: '000000',
        decorPurple: '005500'
    },
    'academic-classic': {
        name: 'Academic Classic',
        bgColor: 'FDFBF7',
        cyan: '800020', // Crimson
        purple: '002147', // Navy
        gold: 'D4AF37', // Gold
        tealDecor: 'E8E3D2',
        bgCard: 'FFFFFF',
        textWhite: '2C2C2C',
        textBlack: 'FFFFFF',
        decorPurple: '002147'
    },
    'sunset-orange': {
        name: 'Sunset Orange',
        bgColor: '1A1A1A',
        cyan: 'FF4500', // Orange Red
        purple: 'FF8C00', // Dark Orange
        gold: 'FFD700', // Gold
        tealDecor: '2D2D2D',
        bgCard: '242424',
        textWhite: 'F5F5F5',
        textBlack: '000000',
        decorPurple: '4A2511'
    }
};

export const generatePPTX = async (config, finalQuestions, themeId, layoutId = 'modern-sidebar') => {
    const theme = THEMES[themeId] || THEMES['dark-neon'];
    const layoutType = layoutId;
    
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    // Helper functions for layouts
    const buildModernSidebarTitle = (slide) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: 5.625, fill: { color: theme.cyan } });
        slide.addShape(pres.ShapeType.rect, { x: 0.1, y: 0, w: 0.1, h: 5.625, fill: { color: theme.purple } });
        slide.addShape(pres.ShapeType.ellipse, { x: -0.5, y: 4.5, w: 2.5, h: 2.5, fill: { color: theme.tealDecor, transparency: 70 } });
        slide.addShape(pres.ShapeType.ellipse, { x: 8.5, y: -1, w: 3, h: 3, fill: { color: theme.decorPurple, transparency: 75 } });
        slide.addShape(pres.ShapeType.ellipse, { x: 9, y: 0.5, w: 1.5, h: 1.5, line: { color: theme.gold, width: 4 }, fill: { transparency: 100 } });

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

    const buildModernSidebarQuestion = (slide, q) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.1, h: 5.625, fill: { color: theme.cyan } });
        slide.addShape(pres.ShapeType.rect, { x: 0.1, y: 0, w: 0.1, h: 5.625, fill: { color: theme.purple } });
        slide.addShape(pres.ShapeType.ellipse, { x: -0.5, y: 4.5, w: 2.5, h: 2.5, fill: { color: theme.tealDecor, transparency: 70 } });
        slide.addShape(pres.ShapeType.ellipse, { x: 8.5, y: -1, w: 3, h: 3, fill: { color: theme.decorPurple, transparency: 75 } });
        slide.addShape(pres.ShapeType.ellipse, { x: 9, y: 0.5, w: 1.5, h: 1.5, line: { color: theme.gold, width: 4 }, fill: { transparency: 100 } });

        slide.addText(q.badge, { x: 5.5, y: 3.5, w: 4, h: 2, fontSize: 90, bold: true, color: theme.purple, transparency: 85, align: 'right' });
        
        slide.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 0.6, w: 1.2, h: 0.4, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(q.badge, { x: 1.2, y: 0.6, w: 1.2, h: 0.4, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });
        
        slide.addShape(pres.ShapeType.rect, { x: 2.6, y: 0.785, w: 2.5, h: 0.03, fill: { color: theme.cyan } });
        slide.addShape(pres.ShapeType.rect, { x: 5.1, y: 0.785, w: 1.5, h: 0.03, fill: { color: theme.purple } });

        slide.addShape(pres.ShapeType.roundRect, { x: 6.8, y: 0.6, w: 2.8, h: 0.4, fill: { color: theme.bgCard }, line: { color: theme.purple, width: 1.5 }, rectRadius: 0.1 });
        slide.addText(q.tag.toUpperCase(), { x: 6.8, y: 0.6, w: 2.8, h: 0.4, fontSize: 14, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle' });

        let textObjects = [{ text: q.qText, options: { color: theme.textWhite, fontSize: 24 } }];
        if (q.options) {
            textObjects.push({ text: '\n', options: { fontSize: 10 } }); // small gap instead of double newline
            textObjects.push({ text: q.options, options: { color: theme.cyan, fontSize: 18 } });
        }
        slide.addText(textObjects, { x: 1.2, y: 1.4, w: 8.4, h: 3.8, align: 'left', valign: 'top', autoFit: true });
    };

    const buildClassicHeaderQuestion = (slide, q) => {
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: theme.purple } });
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 1.0, w: 10, h: 0.05, fill: { color: theme.gold } });

        slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 0.3, w: 1.2, h: 0.4, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(q.badge, { x: 0.5, y: 0.3, w: 1.2, h: 0.4, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });

        slide.addShape(pres.ShapeType.roundRect, { x: 6.7, y: 0.3, w: 2.8, h: 0.4, fill: { color: theme.bgColor }, rectRadius: 0.1 });
        slide.addText(q.tag.toUpperCase(), { x: 6.7, y: 0.3, w: 2.8, h: 0.4, fontSize: 14, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle', bold: true });

        let textObjects = [{ text: q.qText, options: { color: theme.textWhite, fontSize: 24 } }];
        if (q.options) {
            textObjects.push({ text: '\n', options: { fontSize: 10 } });
            textObjects.push({ text: q.options, options: { color: theme.cyan, fontSize: 18 } });
        }
        slide.addText(textObjects, { x: 0.5, y: 1.3, w: 9.0, h: 4.0, align: 'left', valign: 'top', autoFit: true });
    };

    const buildSplitFocusQuestion = (slide, q) => {
        // 30% left panel = 3.0 inches
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 3.0, h: 5.625, fill: { color: theme.purple } });
        
        slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 2.0, w: 2.0, h: 0.6, fill: { color: theme.cyan }, rectRadius: 0.1 });
        slide.addText(q.badge, { x: 0.5, y: 2.0, w: 2.0, h: 0.6, fontSize: 24, bold: true, color: theme.textBlack, align: 'center', margin: [0,0,0,0], valign: 'middle' });

        slide.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 3.0, w: 2.0, h: 0.4, fill: { color: theme.bgColor }, rectRadius: 0.1 });
        slide.addText(q.tag.toUpperCase(), { x: 0.5, y: 3.0, w: 2.0, h: 0.4, fontSize: 12, color: theme.purple, align: 'center', margin: [0,0,0,0], valign: 'middle', bold: true });

        // 70% right panel text area
        let textObjects = [{ text: q.qText, options: { color: theme.textWhite, fontSize: 24 } }];
        if (q.options) {
            textObjects.push({ text: '\n', options: { fontSize: 10 } });
            textObjects.push({ text: q.options, options: { color: theme.gold, fontSize: 18 } });
        }
        slide.addText(textObjects, { x: 3.3, y: 0.5, w: 6.4, h: 4.6, align: 'left', valign: 'top', autoFit: true });
    };

    // 1. Title Slide
    let titleSlide = pres.addSlide();
    titleSlide.background = { color: theme.bgColor };
    if (layoutType === 'classic-header') {
        buildClassicHeaderTitle(titleSlide);
    } else if (layoutType === 'split-focus') {
        buildSplitFocusTitle(titleSlide);
    } else {
        buildModernSidebarTitle(titleSlide);
    }

    // 2. Questions Slides
    finalQuestions.forEach((q) => {
        let qSlide = pres.addSlide();
        qSlide.background = { color: theme.bgColor };
        
        if (layoutType === 'classic-header') {
            buildClassicHeaderQuestion(qSlide, q);
        } else if (layoutType === 'split-focus') {
            buildSplitFocusQuestion(qSlide, q);
        } else {
            buildModernSidebarQuestion(qSlide, q);
        }
    });

    return pres.writeFile({ fileName: `${config.mainTitle1}_${config.mainTitle2}_Presentation.pptx`.replace(/\s+/g, '_') });
};
