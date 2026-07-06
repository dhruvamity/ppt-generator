import pptxgen from 'pptxgenjs';

async function test() {
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    const bgColor = '05050F';
    const leftCyanBar = { x: 0, y: 0, w: 0.1, h: 5.625, fill: { color: '00E5FF' } };
    const leftPurpleBar = { x: 0.1, y: 0, w: 0.1, h: 5.625, fill: { color: '7C3AED' } };
    const decorTeal = { x: -1, y: 5.5, w: 3, h: 3, fill: { color: '008080', transparency: 70 }, shape: pres.ShapeType.ellipse };
    const decorPurple = { x: 11, y: -1, w: 4, h: 4, fill: { color: '7C3AED', transparency: 75 }, shape: pres.ShapeType.ellipse };
    const decorGold = { x: 12, y: -0.5, w: 2, h: 2, line: { color: 'FFD700', width: 4 }, shape: pres.ShapeType.ellipse, fill: { transparency: 100 } };

    let slide = pres.addSlide();
    slide.background = { color: bgColor };
    slide.addShape(pres.ShapeType.rect, leftCyanBar);
    slide.addShape(pres.ShapeType.rect, leftPurpleBar);
    slide.addShape(pres.ShapeType.ellipse, decorTeal);
    slide.addShape(pres.ShapeType.ellipse, decorPurple);
    slide.addShape(pres.ShapeType.ellipse, decorGold);

    slide.addText([
        { text: 'HCF &' + ' ', options: { color: '00E5FF' } },
        { text: 'LCM', options: { color: 'FFD700' } }
    ], { x: 1.5, y: 2.5, fontSize: 80, bold: true, fontFace: 'Arial' });

    slide.addShape(pres.ShapeType.rect, { x: 1.5, y: 3.8, w: 7, h: 0.04, fill: { color: 'FFD700' } });

    slide.addShape(pres.ShapeType.roundRect, { x: 1.5, y: 4.2, w: 3.2, h: 0.6, fill: { color: '00E5FF' }, rectRadius: 0.3 });
    slide.addText('MATHEMATICS', { x: 1.5, y: 4.2, w: 3.2, h: 0.6, fontSize: 18, bold: true, color: '000000', align: 'center', fontFace: 'Arial' });

    slide.addShape(pres.ShapeType.roundRect, { x: 5, y: 4.2, w: 3.2, h: 0.6, line: { color: '7C3AED', width: 2.5 }, fill: { color: '05050F' }, rectRadius: 0.3 });
    slide.addText('2026 EDITION', { x: 5, y: 4.2, w: 3.2, h: 0.6, fontSize: 18, bold: true, color: 'A855F7', align: 'center', fontFace: 'Arial' });

    slide.addText('JEE | CAT', { x: 1.5, y: 5.0, fontSize: 18, color: 'FFFFFF', letterSpacing: 3, fontFace: 'Arial' });

    // Workspace Slide
    let wSlide = pres.addSlide();
    wSlide.background = { color: bgColor };
    wSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: 'FFD700' } });
    wSlide.addShape(pres.ShapeType.rect, { x: 0, y: 7.4, w: 10, h: 0.1, fill: { color: '7C3AED' } });
    wSlide.addText("WORK SPACE", { x: 1, y: 0.5, w: 4, h: 0.5, fontSize: 24, bold: true, color: 'FFD700' });
    
    for (let i = 0; i < 9; i++) {
        wSlide.addShape(pres.ShapeType.line, { x: 1, y: 1.5 + i * 0.65, w: 11.3, h: 0, line: { color: '7C3AED', width: 1, dashType: 'dash', transparency: 65 } });
    }
    
    wSlide.addText("Q1", { x: 7, y: 5, w: 6, h: 2, fontSize: 140, bold: true, color: '7C3AED', transparency: 85, align: 'right' });

    try {
        await pres.writeFile({ fileName: `test.pptx` });
        console.log("Success!");
    } catch(e) {
        console.error("Failed:", e);
    }
}

test();
