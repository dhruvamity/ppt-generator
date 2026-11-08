# Deckful

Deckful helps teachers turn question sets and lesson material into editable presentation decks. Paste or import raw content, review the parsed questions, choose a theme, then export the slides as HTML or PDF.

## What the app includes

- A question parser and editor for multiple choice questions, shared passages, and workspace slides.
- AI assisted formatting through Gemini, called by the FastAPI backend.
- Theme and layout previews, saved decks, and presentation exports.
- A React and Vite frontend with a FastAPI backend.

## Local development

1. Install frontend dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set the Clerk publishable key and backend URL.
3. Copy `backend/.env.example` to `backend/.env` and set the Gemini and Clerk server secrets there. Keep the Gemini key server side.
4. Start the frontend with `npm run dev`.
5. Install backend dependencies with `python -m pip install -r backend/requirements.txt`, then run `uvicorn main:app --reload --app-dir backend`.

Use `npm run build` to create the production frontend bundle.
