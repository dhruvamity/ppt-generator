# Deckful

Deckful helps teachers turn question sets and lesson material into editable presentation decks. Paste or import raw content, review the parsed questions, choose a theme, then export the slides as HTML or PDF.

## What the app includes

- A question parser and editor for multiple choice questions, shared passages, and workspace slides. Write `Answer: (b)` and `Solution:` lines under a question (or use the answer chips in the editor) to get a click-to-reveal answer, a worked-solution slide and an optional answer key.
- Presentation options: reveal answers on click, solution slides, blank work-space slides, answer key, section dividers, slide numbers and a per-question countdown timer.
- The downloaded deck includes presenter tools: pen (D), highlighter (M), laser pointer (X), undo (U), erase (E), show answer (A) and timer (T). Long questions shrink to fit instead of being cut off.
- More than 50 slide designs grouped as Calm, Topic art (coordinate geometry, P&C, progressions, clocks, mixtures, time and work, interest, logs, directions…), Signature, Bold and Classic.
- AI assisted formatting through Gemini, called by the FastAPI backend.
- Theme and layout previews, saved decks, and presentation exports. Decks autosave to the dashboard as you work; the exported HTML embeds Reveal.js and KaTeX (fonts included) so it presents offline, and "Save as PDF" falls back to the browser's print dialog without a connection.
- An optional educator / brand watermark; every design places it where it cannot touch a question or option.
- A Thumbnail studio (`/thumbnails`): pick a pre-designed 1280 × 720 layout, upload a teacher photo, edit the chapter, sub-topic, lecture number and tags, and download a PNG. The photo never leaves the browser.
- A React and Vite frontend with a FastAPI backend. Run `npm test` for the unit tests and `npm run lint` for lint; CI runs both plus the build.
- See `docs/IMPROVEMENTS.md` for the latest improvement pass and the remaining roadmap.

## Local development

1. Install frontend dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set the Clerk publishable key and backend URL.
3. Copy `backend/.env.example` to `backend/.env` and set the Gemini and Clerk server secrets there. Keep the Gemini key server side.
4. Start the frontend with `npm run dev`.
5. Install backend dependencies with `python -m pip install -r backend/requirements.txt`, then run `uvicorn main:app --reload --app-dir backend`.

Use `npm run build` to create the production frontend bundle.
