# Deckful improvement pass: what changed and what remains

This pass is for maths, CAT and aptitude teachers. Most of the new slide designs stay out of the way of the question; a few bold ones are labelled as bold so teachers can save them for intros and speed rounds.

## Checklist results

| Item | Implemented and checked |
| --- | --- |
| 1. Editor controls | Checked question editing, lesson details, figure upload, options and downloads in Chrome, including a 390 px viewport. Component tests cover the answer picker, options and notes. The browser harness used a simulated Clerk provider. |
| 2, 4, 8. Presenter and ink | Tested keyboard shortcuts, mouse, emulated touch and pen, fullscreen, overview, resizing, erasing and restoring ink after reload. The toolbar hides when idle, the timer can be dragged or paused, and CAT Mock uses the actual timer. Physical pen and smartboard hardware still need an on-device check. |
| 3. Gemini formatting | The live API check confirmed that unanswered source items return empty answers and solutions, and that supplied answers and solutions survive. Structured pastes preserve their wording, options and shared context. |
| 5–6. Dense content and sections | Long passages split before the dependent questions, repeating table headers. Answer keys split every 24 entries. Preview and export share auto-fit, and explicit source headings drive section dividers. The original 45-question paper fit in 34 theme/layout combinations. |
| 7, 18–19. Classic layouts | One layout definition feeds preview and export. Explicit theme flags drive the Classic composition and watermark placement. The browser check included all 30 original-theme/layout combinations. |
| 9–12. Thumbnails | Home-feed and sidebar previews include duration placement. Download a JPG under 2 MB or a ZIP for up to 30 lectures. Set a brand accent, choose the title font, or underline a word with asterisks. Chrome produced a JPG and a three-lecture ZIP. |
| 13–15. PowerPoint and lesson material | Upload or paste a question figure, add concept slides and formula sheets, and export PowerPoint. Checked the 16:9 PowerPoint package, slide images, formula and notes. Slide artwork and maths are rendered as images in the PowerPoint file. |
| 16. Notes and handouts | Speaker notes work offline in Reveal and are included in PowerPoint. Printable handouts group 2, 4 or 6 questions, with an optional teacher answer key. Student and teacher versions were printed to PDF in Chrome. Dense questions may flow onto a second sheet. |
| 17. Classroom poll | Press **P** on a multiple-choice slide to enter a show-of-hands count and see the percentage for each choice before revealing the answer. Chrome verified counting and reopening the poll. |
| 20–22. Build and maintenance | Routes and download dependencies load on demand. Production chunks stay below 500 kB each. The unused Beamer route is removed, new dashboards start with maths/CAT/aptitude folders, and component tests run with the existing CI command. |

The existing slide-to-PDF renderer is outside this pass. The handout has its own print layout.

The sections below preserve the original audit and proposed work for context.

## 1. What the repo scan found

| Area | Finding | Status |
| --- | --- | --- |
| Teaching flow | Decks had questions only. There was no answer, no solution and no reveal, which is the core of a solving class. | **Done**: answers, solutions, reveal on click, answer key |
| Presenting | The exported deck was a plain Reveal deck with no pen, pointer or timer, so teachers had to switch to another app to annotate. | **Done**: presenter toolbar |
| Long content | Long questions, passages and tables were clipped by `overflow: hidden`. | **Done**: auto-fit (scales down to 50% at most) |
| Design choice | 35 designs sat in one long single-column list with no hint of how busy each one is. | **Done**: Calm / Topic art / Signature / Bold / Classic filters, search, 2-column grid |
| Topic coverage | No artwork for coordinate geometry, progressions, P&C, clocks and calendars, mixtures, time and work, interest, logs, or direction sense. | **Done**: 9 new topic-art designs |
| Thumbnails | 10 templates, with no "one shot", "PYQ", "mock analysis" or calm/minimal options. | **Done**: 6 new templates, 4 new stickers |
| Settings | "Insert blank solution slides" was buried in the title-slide panel. | **Done**: new "Presentation options" panel |

## 2. What was implemented

### Presentation and teaching features
- **Answers and solutions** (`src/utils/questionParser.js`)
  - Raw text now understands `Answer:` / `Ans:` (as `(b)`, `B.`, `(2)`, or free text such as `42`) and `Solution:` / `Sol:` / `Explanation:` blocks, which can run over several lines.
  - Both survive editing because the raw text is re-serialised with them.
- **AI formatting** (`backend/main.py`)
  - The schema and prompt now carry `answer` and `solution`, and the model is told never to invent them.
  - When the counts match, answers and solutions the teacher typed take priority over the model's.
- **One deck sequence** (`src/utils/deckSequence.js`)
  - The export and the editor preview build the same ordered list: title, section dividers, question, work space, solution, answer key.
- **Export** (`src/utils/exportRevealJS.js`)
  - The correct option is a Reveal fragment. The question appears first; the next click (or **A**) rings it in green with a tick. Free-text answers fade in below the question.
  - Solution slides are labelled `SOL.n` and show the answer and the worked steps (tables supported).
  - Optional answer-key slide, optional section dividers, optional slide numbers.
  - Printed and PDF handouts strip revealed answers. Use the answer-key slide when answers should print.
- **Presenter toolbar** (`src/utils/presenterRuntime.js`, embedded in the downloaded HTML; works offline)
  - Pen **D** (5 colours), highlighter **M**, laser pointer **X**, undo **U**, erase slide **E**, show/hide answer **A**, timer **T**.
  - Ink is stored per slide and redrawn when the window resizes.
  - Countdown per question (30 s to 5 min, set in the editor). It turns amber in the last 10 s and pulses red at "TIME'S UP". With no countdown set, **T** runs a stopwatch.
  - Shortcuts are registered with Reveal, so they appear in Reveal's built-in **?** help.
  - Auto-fit measures every slide off-screen at 1280 × 720 and scales overflowing content down.
- **Editor** (`SlidePreview.jsx`, `LiveSlidePreview.jsx`, `PresentationOptions.jsx`)
  - Per-question answer chips (A/B/C/D, or a text box for non-MCQ) and an "answers set" counter.
  - A "Solution" button adds an editable solution slide.
  - The preview shows every exported slide, numbered as presented. The correct option is outlined in green.
  - The same auto-fit runs in the preview.
  - The sidebar scrolls on its own so the download button stays reachable.

### Slide designs (all keep the existing rule that artwork never overlaps the header, body or watermark; the tests enforce it)
- **Calm (3):** Projector White, Slate & Amber, Exam Paper.
- **Topic art (9):** Coordinate Plane, Series & Progressions, Permutations & Combinations, Clocks & Calendars, Mixtures & Alligation, Time & Work, Interest & Growth, Logs & Exponents, Directions & Seating. Each is a 160 px margin strip with formulas checked to fit the strip.
- **Signature (3):** Matrix Brackets, Theorem Box (serif, Q.E.D. square), Whiteboard (frame, marker tray, sticky note).
- **Bold, the deliberately over-designed ones (3 new, plus 4 existing re-labelled):** CAT Mock Interface (section bar, timer, question palette, Save & Next), Golden Spiral, Retro Calculator. Quant Clock, Ticket Stub, Night Drill and Tangram Corner are now tagged Bold.
- The theme browser groups designs by how much they compete with the maths. The Templates page uses the same groups.

### Thumbnails
- **New templates:** Clean Lecture (calm), One Shot, PYQ Marathon, Mock Analysis, 10-Second Trick, Paper & Red Pen.
- **New stickers:** stamp, bolt, trophy, play button.
- All templates pass the existing no-overlap layout test with long and empty field values.

### Verification done
- `npm test`: 28 tests pass, including the new `tests/presentationFeatures.test.mjs`. `npm run lint`: 0 errors (the same 4 warnings as before). `npm run build` passes. `backend/main.py` compiles.
- Exported decks were rendered in headless Chrome for Lecture Paper, CAT Mock, Golden Spiral, Retro Calculator, Whiteboard, Theorem Box, Coordinate Plane, Permutations & Combinations and Time & Work.
  - Confirmed: answer reveal ring, running countdown, toolbar, solution slide, answer key and margin artwork.
  - Two bugs found this way are fixed: formulas overflowing the art strip, and the solution slide showing "c" instead of "(C)".

## 3. Original follow-up checklist

### Not verified (needs a person or credentials)
1. **Editor UI in the running app.** Every editor route is behind a Clerk sign-in, and this sandbox has no Clerk key, so none of the following was clicked:
   - the answer chips, the Solution button and inline solution editing;
   - the Presentation options toggles and timer select;
   - the theme filters, search and 2-column grid inside the 320 px sidebar;
   - preview auto-fit while editing.

   Build and lint pass, but the layout at real sidebar width (especially the answer chips row on narrow screens) still needs a visual check.
2. **Presenter tools by hand.** The screenshots prove rendering, not interaction. Still to try:
   - drawing with mouse, pen and touch (smartboards), undo, erase and colour cycling;
   - laser cursor hiding and every keyboard shortcut, including whether they show in **?**;
   - ink position after fullscreen (**F**), resize and overview (**Esc**);
   - timer pause by click.
3. **AI path.** The prompt and schema changes were not run against Gemini (no key here). Check that the model leaves `answer` / `solution` empty when the source has none, and that it does not "solve" questions.

### Known limitations and follow-ups in shipped work
4. **Overlays cover slide corners.** The toolbar (bottom-left, 35% opacity when idle) and timer (top-right) sit over the slide. On CAT Mock the timer covers the fake "Time Left" label, and the toolbar sits over bottom-left watermarks. Options:
   - auto-hide after a few seconds without mouse movement;
   - a draggable timer;
   - per-design overlay positions;
   - on CAT Mock, drive the "Time Left" label from the real timer.
5. **Auto-fit floor.** Content that needs more than a 50% shrink still clips. Very long passages or 30+ entry answer keys should split across slides. The key slide is a single slide today.
6. **Section dividers** use each question's `topic`. AI topics can change on nearly every question and create many dividers. Use parser section headings only, or merge near-identical topics.
7. **Answers on Classic themes.** Solution, key and reveal slides on the seven Classic flexible layouts are covered by tests but were not looked at visually.
8. **Ink is not saved.** Annotations vanish on reload. Saving them in `localStorage` keyed by deck title is a small change, and so would be adding them to the PDF export.

### Thumbnail studio features proposed but not built
9. **YouTube preview strip.** Show the thumbnail at home-feed and sidebar sizes with a fake "12:34" duration badge, plus a safe-zone overlay. YouTube's duration badge covers the bottom-right corner, so templates should keep text out of roughly x > 1130, y > 640.
10. **JPG export under 2 MB.** YouTube rejects custom thumbnails over 2 MB, and a PNG with a photo can exceed that. Extend `renderThumbnailPng` to `canvas.toBlob('image/jpeg', q)`, stepping quality down until the file is under 2 MB.
11. **Series export.** Download lectures N to M in one go (only the lecture number changes): render a hidden `ThumbnailSvg` per number and rasterise each.
12. **Brand colour and fonts.** Let a teacher re-colour a template's accent and keep a consistent channel look. Embed web fonts for export (system fonts differ between machines today). Highlight one word of the title with `*word*`.

### Bigger product gaps found in the scan
13. **PPTX export.** Many teachers present from PowerPoint or Google Slides. A `pptxgenjs` export would need KaTeX rendered to SVG/PNG images for maths and would map the 1280 × 720 layouts to 10 × 5.625 in. Signature designs could export decorations as images.
14. **Figures in questions.** Geometry and DI questions need diagrams, but slides support text, maths and tables only. Add image upload or paste per question (data URLs, so exports stay offline) with a figure/text split layout.
15. **Concept and theory slides.** Decks are question-only. Add "concept" slides (heading, bullets, formula box) and a formula-sheet slide type so a whole lecture can live in one deck.
16. **Speaker notes and handouts.** Reveal's notes plugin could carry per-question teacher notes, such as the shortcut to mention. Add handout PDFs with 2/4/6 questions per page plus answer key, and a student version without answers.
17. **Classroom polling.** Count A/B/C/D answers (hands or a phone link) and show a bar chart before the reveal.

### Engineering hygiene
18. The four Classic named themes and three flexible layouts are hand-written twice, once in `LiveSlidePreview.jsx` and once in `exportRevealJS.js`. Port them to the declarative spec used by `signatureDesigns.js` so the preview and export cannot drift.
19. `hasSignatureLayout` and the watermark code switch on theme names. Use explicit flags instead.
20. The bundle is over 500 kB. Lazy-load `ThumbnailStudio`, `Templates` and KaTeX CSS with dynamic imports.
21. Dashboard sample folders ("Biology 101", "World History") do not fit the maths/CAT audience. The Beamer export endpoint is still a placeholder.
22. There are no component tests. A small Vitest + Testing Library setup would cover the answer picker and options panel.
