// Embedded in downloaded HTML via toString(). Keep this function self-contained: no imports and
// no references to module scope. Classroom tools: pen / highlighter ink stored per slide, laser
// pointer, question timer, answer toggle, and auto-fit for long questions and solutions.
export function installPresenterTools(fitSlideBox, storageKey) {
    const deck = window.Reveal;
    const bar = document.getElementById('presenter-bar');
    const chip = document.getElementById('presenter-timer');
    if (!deck || !bar || !chip) return;

    const fitAll = () => {
        const stage = document.createElement('div');
        stage.className = 'reveal';
        stage.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;height:720px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(stage);
        const oversized = [];
        try {
            document.querySelectorAll('.slides .slide-container').forEach((slide, index) => {
                const target = slide.querySelector('.q-fit');
                if (!target) return;
                const clone = slide.cloneNode(true);
                stage.replaceChildren(clone);
                const box = clone.querySelector('.q-fit');
                if (!fitSlideBox(box)) oversized.push(index + 1);
                target.style.cssText = box.style.cssText;
            });
        } finally {
            stage.remove();
        }
        deck.layout();
        return oversized;
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
    let tool = null, colorIndex = 0, stroke = null;
    const ink = new Map();
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        for (const [key, strokes] of saved) {
            if (/^\d+\.\d+$/.test(key) && Array.isArray(strokes)) ink.set(key, strokes);
        }
    } catch { /* Local storage can be unavailable for offline files. */ }
    const saveInk = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify([...ink]));
        } catch { /* Keep annotations for the current session. */ }
    };

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
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.left, rect.top, rect.width, rect.height);
        ctx.clip();
        (ink.get(slideKey()) || []).forEach(item => drawStroke(item, rect));
        if (stroke?.key === slideKey()) drawStroke(stroke, rect);
        ctx.restore();
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
        if (!rect || stroke || event.button !== 0 || (tool !== 'pen' && tool !== 'marker') || deck.isOverview()) return;
        const position = point(event, rect);
        if (position.some(coordinate => coordinate < 0 || coordinate > 1)) return;
        stroke = { key: slideKey(), pointerId: event.pointerId, tool, color: tool === 'marker' ? '#FACC15' : COLORS[colorIndex], width: tool === 'marker' ? 30 : 5, points: [position] };
        canvas.setPointerCapture(event.pointerId);
        redraw();
    });
    canvas.addEventListener('pointermove', event => {
        const rect = slideRect();
        if (!stroke || stroke.pointerId !== event.pointerId || !rect || stroke.key !== slideKey()) return;
        stroke.points.push(point(event, rect));
        redraw();
    });
    const endStroke = event => {
        if (!stroke || stroke.pointerId !== event.pointerId) return;
        const { key, tool, color, width, points } = stroke;
        ink.set(key, [...(ink.get(key) || []), { tool, color, width, points }]);
        stroke = null;
        saveInk();
        redraw();
    };
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    canvas.addEventListener('lostpointercapture', endStroke);
    document.addEventListener('pointermove', event => {
        if (tool !== 'laser') return;
        laser.style.left = event.clientX + 'px';
        laser.style.top = event.clientY + 'px';
    });

    const button = name => bar.querySelector('[data-tool="' + name + '"], [data-action="' + name + '"]');
    const syncTool = () => {
        const active = deck.isOverview() ? null : tool;
        const drawing = active === 'pen' || active === 'marker';
        canvas.style.pointerEvents = drawing ? 'auto' : 'none';
        canvas.style.cursor = drawing ? 'crosshair' : '';
        laser.style.display = active === 'laser' ? 'block' : 'none';
        document.documentElement.classList.toggle('presenter-laser-on', active === 'laser');
        bar.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.tool === tool)));
    };
    const setTool = name => {
        tool = tool === name ? null : name;
        syncTool();
    };
    const cycleColor = () => {
        colorIndex = (colorIndex + 1) % COLORS.length;
        button('color').style.setProperty('--ink', COLORS[colorIndex]);
        if (tool !== 'pen') setTool('pen');
    };
    const undo = () => { const key = slideKey(); ink.set(key, (ink.get(key) || []).slice(0, -1)); saveInk(); redraw(); };
    const erase = () => { ink.delete(slideKey()); saveInk(); redraw(); };
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
    const poll = document.getElementById('presenter-poll');
    const pollRows = [...poll.querySelectorAll('[data-choice]')];
    const votesBySlide = new Map();
    const pollChoices = () => [...(deck.getCurrentSlide()?.querySelectorAll('[data-poll-choice]') || [])].slice(0, pollRows.length).map(option => option.dataset.pollChoice);
    const paintPoll = () => {
        const counts = Object.fromEntries(pollRows.filter(row => !row.hidden).map(row => {
            const votes = Math.min(9999, Math.max(0, Math.trunc(row.querySelector('input').valueAsNumber) || 0));
            return [row.dataset.choice, votes];
        }));
        const total = Object.values(counts).reduce((sum, votes) => sum + votes, 0);
        for (const row of pollRows) {
            const share = total ? (counts[row.dataset.choice] || 0) / total : 0;
            row.querySelector('meter').value = share;
            row.querySelector('output').textContent = Math.round(share * 100) + '%';
        }
        poll.querySelector('[data-poll-total]').textContent = total + (total === 1 ? ' vote' : ' votes');
        votesBySlide.set(slideKey(), counts);
    };
    const openPoll = () => {
        const labels = pollChoices();
        if (!labels.length || deck.isOverview() || poll.open) return;
        const counts = votesBySlide.get(slideKey()) || {};
        for (const [index, row] of pollRows.entries()) {
            row.hidden = !labels[index];
            row.dataset.choice = labels[index] || '';
            row.querySelector('strong').textContent = row.dataset.choice;
            row.querySelector('input').setAttribute('aria-label', 'Votes for ' + row.dataset.choice);
            row.querySelector('meter').setAttribute('aria-label', 'Vote share for ' + row.dataset.choice);
            row.querySelector('input').value = counts[row.dataset.choice] || '';
        }
        paintPoll();
        poll.showModal();
        document.documentElement.classList.remove('presenter-laser-on');
        laser.style.display = 'none';
    };
    poll.addEventListener('input', paintPoll);
    poll.addEventListener('keydown', event => event.stopPropagation());
    poll.addEventListener('close', () => {
        syncTool();
        if (!button('poll').disabled) button('poll').focus({ preventScroll: true });
    });
    poll.querySelector('[data-poll-reset]').addEventListener('click', () => {
        pollRows.forEach(row => { row.querySelector('input').value = ''; });
        paintPoll();
    });
    const onSlide = () => {
        if (poll.open) poll.close();
        button('poll').disabled = !pollChoices().length;
        stopTimer();
        const seconds = Number(deck.getCurrentSlide()?.querySelector('.slide-container')?.dataset.timer || 0);
        timer = { ...timer, total: seconds, left: seconds, up: false };
        paint();
        if (seconds) startTimer();
        redraw();
    };

    const actions = { pen: () => setTool('pen'), marker: () => setTool('marker'), laser: () => setTool('laser'), color: cycleColor, undo, erase, answer: toggleAnswer, timer: toggleTimer, poll: openPoll };
    bar.addEventListener('click', event => {
        const target = event.target.closest('button');
        if (target) actions[target.dataset.tool || target.dataset.action]?.();
    });
    let hideToolbar;
    const showToolbar = () => {
        bar.classList.remove('is-idle');
        clearTimeout(hideToolbar);
        hideToolbar = setTimeout(() => bar.classList.add('is-idle'), 3500);
    };
    document.addEventListener('pointermove', showToolbar, { passive: true });
    document.addEventListener('pointerdown', showToolbar, { passive: true });
    bar.addEventListener('focusin', showToolbar);
    showToolbar();

    let drag = null;
    let suppressTimerClick = false;
    chip.addEventListener('pointerdown', event => {
        if (event.button !== 0 || !event.isPrimary) return;
        const rect = chip.getBoundingClientRect();
        suppressTimerClick = false;
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
        chip.setPointerCapture(event.pointerId);
    });
    const moveTimer = (left, top) => {
        chip.style.right = 'auto';
        chip.style.left = Math.max(0, Math.min(left, innerWidth - chip.offsetWidth)) + 'px';
        chip.style.top = Math.max(0, Math.min(top, innerHeight - chip.offsetHeight)) + 'px';
    };
    chip.addEventListener('pointermove', event => {
        if (drag?.id !== event.pointerId) return;
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) suppressTimerClick = true;
        if (suppressTimerClick) moveTimer(drag.left + dx, drag.top + dy);
    });
    const endDrag = event => { if (drag?.id === event.pointerId) drag = null; };
    chip.addEventListener('pointerup', endDrag);
    chip.addEventListener('pointercancel', endDrag);
    chip.addEventListener('click', event => {
        if (!suppressTimerClick || event.detail === 0) toggleTimer();
        suppressTimerClick = false;
    });
    window.addEventListener('resize', () => {
        if (chip.style.left && !chip.hidden) moveTimer(parseFloat(chip.style.left), parseFloat(chip.style.top));
    });
    [[68, 'D', 'Pen: draw on the slide', 'pen'], [77, 'M', 'Highlighter', 'marker'], [88, 'X', 'Laser pointer', 'laser'], [85, 'U', 'Undo last stroke', 'undo'], [69, 'E', 'Erase ink on this slide', 'erase'], [65, 'A', 'Show / hide the answer', 'answer'], [84, 'T', 'Start / pause the timer', 'timer'], [80, 'P', 'Class poll', 'poll']]
        .forEach(([keyCode, key, description, action]) => deck.addKeyBinding({ keyCode, key, description }, actions[action]));

    deck.on('slidechanged', onSlide);
    deck.on('slidetransitionend', redraw);
    deck.on('resize', resize);
    const onOverview = () => {
        syncTool();
        if (poll.open) poll.close();
        button('poll').disabled = deck.isOverview() || !pollChoices().length;
        redraw();
    };
    deck.on('overviewshown', onOverview);
    deck.on('overviewhidden', onOverview);
    window.addEventListener('resize', resize);
    const pdfButton = document.getElementById('pdf-btn');
    pdfButton.disabled = true;
    window.slidesReady = Promise.resolve(window.slidesReady)
        .then(async () => {
            await Promise.allSettled([...document.fonts]
                .filter(font => font.family.replace(/['"]/g, '').startsWith('KaTeX'))
                .map(font => font.load()));
            await document.fonts.ready;
            await Promise.allSettled([...document.querySelectorAll('.slides img')].map(image => image.decode()));
            const oversized = fitAll();
            const warning = document.getElementById('slide-overflow-warning');
            warning.textContent = oversized.length
                ? 'Slides ' + oversized.join(', ') + ' exceed the available space. Shorten or split their content before exporting to PDF.'
                : '';
            warning.hidden = !oversized.length;
            warning.dataset.ready = 'true';
            pdfButton.disabled = Boolean(oversized.length);
            resize();
            onSlide();
        });
}
