// Embedded in downloaded HTML via toString(). Keep this function self-contained: no imports and
// no references to module scope. Classroom tools: pen / highlighter ink stored per slide, laser
// pointer, question timer, answer toggle, and auto-fit for long questions and solutions.
export function installPresenterTools() {
    const deck = window.Reveal;
    const bar = document.getElementById('presenter-bar');
    const chip = document.getElementById('presenter-timer');
    if (!deck || !bar || !chip) return;

    // Auto-fit: measure each slide off-screen at its real 1280 × 720 size and scale overflowing
    // content down (never below half size) so nothing is clipped when presenting or printing.
    const fitAll = () => {
        const stage = document.createElement('div');
        stage.className = 'reveal';
        stage.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;height:720px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(stage);
        document.querySelectorAll('.slides .slide-container').forEach(slide => {
            const targets = slide.querySelectorAll('.q-fit');
            if (!targets.length) return;
            const clone = slide.cloneNode(true);
            stage.replaceChildren(clone);
            clone.querySelectorAll('.q-fit').forEach((box, i) => {
                let scale = 1;
                const apply = value => {
                    box.style.transformOrigin = '0 0';
                    box.style.transform = 'scale(' + value + ')';
                    box.style.width = box.style.height = (100 / value) + '%';
                    box.style.flex = '0 0 auto';
                };
                for (let step = 0; step < 16 && box.scrollHeight > box.clientHeight + 1 && scale > 0.5; step++) {
                    scale = Math.max(0.5, scale * Math.min(0.97, Math.max(0.8, box.clientHeight / box.scrollHeight)));
                    apply(scale);
                }
                if (scale < 1) targets[i].style.cssText = box.style.cssText;
            });
        });
        stage.remove();
        deck.layout();
    };

    const canvas = document.createElement('canvas');
    canvas.id = 'presenter-ink';
    canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:40;pointer-events:none;touch-action:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const laser = document.createElement('div');
    laser.id = 'presenter-laser';
    document.body.appendChild(laser);

    const COLORS = ['#E11D48', '#2563EB', '#16A34A', '#111827', '#FFFFFF'];
    const ink = new Map();
    let tool = null, colorIndex = 0, stroke = null;

    const slideKey = () => { const i = deck.getIndices(); return i.h + '.' + (i.v || 0); };
    const slideRect = () => { const slide = deck.getCurrentSlide(); return (slide?.querySelector('.slide-container') || slide)?.getBoundingClientRect(); };
    const drawStroke = (item, rect) => {
        if (!item.points.length) return;
        ctx.save();
        ctx.globalAlpha = item.tool === 'marker' ? 0.35 : 1;
        ctx.strokeStyle = item.color;
        ctx.lineWidth = Math.max(1, item.width * rect.width / 1280);
        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.beginPath();
        item.points.forEach(([px, py], i) => { const x = rect.left + px * rect.width, y = rect.top + py * rect.height; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        if (item.points.length === 1) ctx.lineTo(rect.left + item.points[0][0] * rect.width + 0.5, rect.top + item.points[0][1] * rect.height);
        ctx.stroke();
        ctx.restore();
    };
    const redraw = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const rect = slideRect();
        if (!rect || !rect.width || deck.isOverview()) return;
        (ink.get(slideKey()) || []).forEach(item => drawStroke(item, rect));
        if (stroke) drawStroke(stroke, rect);
    };
    const resize = () => {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        redraw();
    };
    const point = (event, rect) => [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];

    canvas.addEventListener('pointerdown', event => {
        const rect = slideRect();
        if (!rect || (tool !== 'pen' && tool !== 'marker')) return;
        stroke = { tool, color: tool === 'marker' ? '#FACC15' : COLORS[colorIndex], width: tool === 'marker' ? 30 : 5, points: [point(event, rect)] };
        canvas.setPointerCapture(event.pointerId);
        redraw();
    });
    canvas.addEventListener('pointermove', event => {
        if (!stroke) return;
        stroke.points.push(point(event, slideRect()));
        redraw();
    });
    const endStroke = () => {
        if (!stroke) return;
        const key = slideKey();
        ink.set(key, [...(ink.get(key) || []), stroke]);
        stroke = null;
        redraw();
    };
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    document.addEventListener('pointermove', event => {
        if (tool !== 'laser') return;
        laser.style.left = event.clientX + 'px';
        laser.style.top = event.clientY + 'px';
    });

    const button = name => bar.querySelector('[data-tool="' + name + '"], [data-action="' + name + '"]');
    const setTool = name => {
        tool = tool === name ? null : name;
        const drawing = tool === 'pen' || tool === 'marker';
        canvas.style.pointerEvents = drawing ? 'auto' : 'none';
        canvas.style.cursor = drawing ? 'crosshair' : '';
        laser.style.display = tool === 'laser' ? 'block' : 'none';
        document.documentElement.classList.toggle('presenter-laser-on', tool === 'laser');
        bar.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.tool === tool)));
    };
    const cycleColor = () => {
        colorIndex = (colorIndex + 1) % COLORS.length;
        button('color').style.setProperty('--ink', COLORS[colorIndex]);
        if (tool !== 'pen') setTool('pen');
    };
    const undo = () => { const key = slideKey(); ink.set(key, (ink.get(key) || []).slice(0, -1)); redraw(); };
    const erase = () => { ink.delete(slideKey()); redraw(); };
    const toggleAnswer = () => {
        const answer = deck.getCurrentSlide()?.querySelector('.answer-opt, .answer-line');
        if (!answer) return;
        if (answer.classList.contains('visible')) deck.prevFragment(); else deck.nextFragment();
    };

    // Countdown on question slides when the teacher set one; otherwise T runs a stopwatch.
    let timer = { total: 0, left: 0, up: false, running: false, last: 0, id: 0 };
    const format = seconds => { const s = Math.max(0, Math.ceil(seconds)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
    const paint = () => {
        const done = !timer.up && timer.total > 0 && timer.left <= 0;
        chip.hidden = !timer.total && !timer.up;
        chip.textContent = done ? "TIME'S UP" : format(timer.left);
        chip.dataset.state = done ? 'done' : !timer.up && timer.total && timer.left <= 10 ? 'low' : timer.running ? 'run' : 'idle';
        button('timer').setAttribute('aria-pressed', String(timer.running));
    };
    const stopTimer = () => { timer.running = false; clearInterval(timer.id); paint(); };
    const startTimer = () => {
        if (timer.running) return;
        if (!timer.up && timer.total && timer.left <= 0) timer.left = timer.total;
        timer.running = true;
        timer.last = performance.now();
        timer.id = setInterval(() => {
            const now = performance.now();
            timer.left += (timer.up ? 1 : -1) * (now - timer.last) / 1000;
            timer.last = now;
            if (!timer.up && timer.left <= 0) { timer.left = 0; stopTimer(); }
            paint();
        }, 200);
        paint();
    };
    const toggleTimer = () => {
        if (!timer.total && !timer.up) timer = { ...timer, up: true, left: 0 };
        if (timer.running) stopTimer(); else startTimer();
    };
    const onSlide = () => {
        stopTimer();
        const seconds = Number(deck.getCurrentSlide()?.querySelector('.slide-container')?.dataset.timer || 0);
        timer = { ...timer, total: seconds, left: seconds, up: false };
        paint();
        if (seconds) startTimer();
        redraw();
    };

    const actions = { pen: () => setTool('pen'), marker: () => setTool('marker'), laser: () => setTool('laser'), color: cycleColor, undo, erase, answer: toggleAnswer, timer: toggleTimer };
    bar.addEventListener('click', event => {
        const target = event.target.closest('button');
        if (target) actions[target.dataset.tool || target.dataset.action]?.();
    });
    chip.addEventListener('click', toggleTimer);
    [[68, 'D', 'Pen: draw on the slide', 'pen'], [77, 'M', 'Highlighter', 'marker'], [88, 'X', 'Laser pointer', 'laser'], [85, 'U', 'Undo last stroke', 'undo'], [69, 'E', 'Erase ink on this slide', 'erase'], [65, 'A', 'Show / hide the answer', 'answer'], [84, 'T', 'Start / pause the timer', 'timer']]
        .forEach(([keyCode, key, description, action]) => deck.addKeyBinding({ keyCode, key, description }, actions[action]));

    deck.on('slidechanged', onSlide);
    deck.on('slidetransitionend', redraw);
    deck.on('resize', resize);
    deck.on('overviewshown', redraw);
    deck.on('overviewhidden', redraw);
    window.addEventListener('resize', resize);
    Promise.resolve(window.slidesReady).then(() => document.fonts.ready).then(() => { fitAll(); resize(); onSlide(); });
}
