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

export const generatePPTX = async (config, finalQuestions, themeId) => {
    const theme = THEMES[themeId] || THEMES['dark-neon'];
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    const leftCyanBar = { x: 0, y: 0, w: 0.1, h: 5.625, fill: { color: theme.cyan } };
    const leftPurpleBar = { x: 0.1, y: 0, w: 0.1, h: 5.625, fill: { color: theme.purple } };
    const decorTeal = { x: -0.5, y: 4.5, w: 2.5, h: 2.5, fill: { color: theme.tealDecor, transparency: 70 }, shape: pres.ShapeType.ellipse };
    const decorPurple = { x: 8.5, y: -1, w: 3, h: 3, fill: { color: theme.decorPurple, transparency: 75 }, shape: pres.ShapeType.ellipse };
    const decorGold = { x: 9, y: 0.5, w: 1.5, h: 1.5, line: { color: theme.gold, width: 4 }, shape: pres.ShapeType.ellipse, fill: { transparency: 100 } };

    // 1. Title Slide
    let slide = pres.addSlide();
    slide.background = { color: theme.bgColor };
    slide.addShape(pres.ShapeType.rect, leftCyanBar);
    slide.addShape(pres.ShapeType.rect, leftPurpleBar);
    slide.addShape(pres.ShapeType.ellipse, decorTeal);
    slide.addShape(pres.ShapeType.ellipse, decorPurple);
    slide.addShape(pres.ShapeType.ellipse, decorGold);

    slide.addText([
        { text: config.mainTitle1 + ' ', options: { color: theme.cyan } },
        { text: config.mainTitle2, options: { color: theme.gold } }
    ], { x: 1.2, y: 1.5, w: 8, h: 1.5, fontSize: 60, bold: true, fontFace: 'Arial' });

    slide.addShape(pres.ShapeType.rect, { x: 1.2, y: 3.0, w: 6.5, h: 0.04, fill: { color: theme.gold } });

    slide.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 3.4, w: 2.8, h: 0.5, fill: { color: theme.cyan }, rectRadius: 0.3 });
    slide.addText(config.pill1, { x: 1.2, y: 3.4, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', fontFace: 'Arial', margin: [0, 0, 0, 0], valign: 'middle' });

    slide.addShape(pres.ShapeType.roundRect, { x: 4.4, y: 3.4, w: 2.8, h: 0.5, line: { color: theme.purple, width: 2.5 }, fill: { color: theme.bgColor }, rectRadius: 0.3 });
    slide.addText(config.pill2, { x: 4.4, y: 3.4, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: theme.purple, align: 'center', fontFace: 'Arial', margin: [0, 0, 0, 0], valign: 'middle' });

    slide.addText(config.footer, { x: 1.2, y: 4.2, w: 8, h: 0.5, fontSize: 16, color: theme.textWhite, letterSpacing: 3, fontFace: 'Arial' });

    // 2. Questions Slides
    finalQuestions.forEach((q) => {
        // Question Slide
        let qSlide = pres.addSlide();
        qSlide.background = { color: theme.bgColor };
        qSlide.addShape(pres.ShapeType.rect, leftCyanBar);
        qSlide.addShape(pres.ShapeType.rect, leftPurpleBar);
        qSlide.addShape(pres.ShapeType.ellipse, decorTeal);
        qSlide.addShape(pres.ShapeType.ellipse, decorPurple);
        qSlide.addShape(pres.ShapeType.ellipse, decorGold);

        qSlide.addText(q.badge, { x: 5.5, y: 3.5, w: 4, h: 2, fontSize: 90, bold: true, color: theme.purple, transparency: 85, align: 'right' });

        qSlide.addShape(pres.ShapeType.roundRect, { x: 1.2, y: 0.6, w: 1.2, h: 0.4, fill: { color: theme.cyan }, rectRadius: 0.1 });
        qSlide.addText(q.badge, { x: 1.2, y: 0.6, w: 1.2, h: 0.4, fontSize: 16, bold: true, color: theme.textBlack, align: 'center', margin: [0, 0, 0, 0], valign: 'middle' });
        
        qSlide.addShape(pres.ShapeType.rect, { x: 2.6, y: 0.785, w: 2.5, h: 0.03, fill: { color: theme.cyan } });
        qSlide.addShape(pres.ShapeType.rect, { x: 5.1, y: 0.785, w: 1.5, h: 0.03, fill: { color: theme.purple } });

        qSlide.addShape(pres.ShapeType.roundRect, { x: 6.8, y: 0.6, w: 2.8, h: 0.4, fill: { color: theme.bgCard }, line: { color: theme.purple, width: 1.5 }, rectRadius: 0.1 });
        qSlide.addText(q.tag.toUpperCase(), { x: 6.8, y: 0.6, w: 2.8, h: 0.4, fontSize: 14, color: theme.purple, align: 'center', margin: [0, 0, 0, 0], valign: 'middle' });

        let textObjects = [
            { text: q.qText, options: { color: theme.textWhite, fontSize: 24 } }
        ];
        if (q.options) {
            textObjects.push({ text: '\n\n', options: { fontSize: 24 } });
            textObjects.push({ text: q.options, options: { color: theme.cyan, fontSize: 18 } });
        }
        qSlide.addText(textObjects, { x: 1.2, y: 1.4, w: 8.4, h: 3.8, align: 'left', valign: 'top', autoFit: true });

        // Workspace Slide
        let wSlide = pres.addSlide();
        wSlide.background = { color: theme.bgColor };
        wSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: theme.gold } });
        wSlide.addShape(pres.ShapeType.rect, { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: theme.purple } });
        
        // Add watermark BEFORE foreground text/lines
        wSlide.addText(q.badge, { x: 5.5, y: 3.5, w: 4, h: 2, fontSize: 90, bold: true, color: theme.purple, transparency: 85, align: 'right' });
        
        wSlide.addText("WORK SPACE", { x: 1.0, y: 0.4, w: 4, h: 0.5, fontSize: 24, bold: true, color: theme.gold });
        
        for (let i = 0; i < 7; i++) {
            wSlide.addShape(pres.ShapeType.line, { x: 1.0, y: 1.2 + i * 0.6, w: 8.5, h: 0, line: { color: theme.purple, width: 1, dashType: 'dash' } });
        }
    });

    return pres.writeFile({ fileName: `${config.mainTitle1}_${config.mainTitle2}_Presentation.pptx`.replace(/\s+/g, '_') });
};
