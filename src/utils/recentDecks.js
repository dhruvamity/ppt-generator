// Pure helpers for the recent-decks list so the store logic can be unit tested without the browser.
export const DEFAULT_THEME_ID = 'modern-neon';
export const DECK_TEXT_FIELDS = ['mainTitle1', 'mainTitle2', 'pill1', 'pill2', 'footer', 'watermark'];

export const deckFromState = (state, id) => ({
    id,
    title: `${state.config?.mainTitle1 ?? ''} ${state.config?.mainTitle2 ?? ''}`.trim() || 'Untitled Deck',
    date: new Date().toISOString(),
    slidesCount: state.activeSlides.length,
    themeId: state.themeId,
    layoutId: state.layoutId,
    config: state.config,
    rawText: state.rawText,
    aiQuestions: state.aiQuestions,
});

// Upsert the working deck into recent decks. `untouched` skips the pristine sample deck unless forced.
export const upsertCurrentDeck = (state, { force = false, untouched = false } = {}) => {
    if (!state.activeSlides?.length) return null;
    if (!force && !state.currentDeckId && untouched) return null;
    const id = state.currentDeckId || `${Date.now()}`;
    return { currentDeckId: id, recentDecks: [deckFromState(state, id), ...(state.recentDecks || []).filter(deck => deck.id !== id)].slice(0, 10) };
};
