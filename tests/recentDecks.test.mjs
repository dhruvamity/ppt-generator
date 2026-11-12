import assert from 'node:assert/strict';
import test from 'node:test';
import { upsertCurrentDeck, DEFAULT_THEME_ID } from '../src/utils/recentDecks.js';
import { THEMES } from '../src/utils/themeConfig.js';

const sample = { rawText: 'Q1. What is 2 + 2?\n(a) 3\n(b) 4', activeSlides: [{ badge: 'Q.1', qText: 'What is 2 + 2?', options: [] }], aiQuestions: null, config: { mainTitle1: 'Number', mainTitle2: 'Systems', pill1: 'MATHS', pill2: 'CAT', footer: '', watermark: '' }, themeId: 'quant-clock', layoutId: 'modern-sidebar', recentDecks: [], currentDeckId: null };

test('a generated deck is saved to recent decks and later edits update the same entry', () => {
    const first = upsertCurrentDeck(sample);
    assert.ok(first.currentDeckId);
    assert.equal(first.recentDecks.length, 1);
    assert.equal(first.recentDecks[0].title, 'Number Systems');
    assert.equal(first.recentDecks[0].slidesCount, 1);
    assert.equal(first.recentDecks[0].themeId, 'quant-clock');
    const edited = upsertCurrentDeck({ ...sample, ...first, config: { ...sample.config, mainTitle2: 'Theory' }, recentDecks: [...first.recentDecks, { id: 'older', title: 'Older' }] });
    assert.equal(edited.currentDeckId, first.currentDeckId);
    assert.deepEqual(edited.recentDecks.map(deck => deck.title), ['Number Theory', 'Older']);
});

test('the untouched sample deck is skipped unless forced, and empty decks are never saved', () => {
    assert.equal(upsertCurrentDeck(sample, { untouched: true }), null);
    assert.equal(upsertCurrentDeck({ ...sample, activeSlides: [] }), null);
    assert.equal(upsertCurrentDeck(sample, { untouched: true, force: true }).recentDecks.length, 1);
    assert.equal(upsertCurrentDeck({ ...sample, currentDeckId: 'open' }, { untouched: true }).currentDeckId, 'open');
});

test('Cyberpunk Neon is the default design and leads the catalogue', () => {
    assert.equal(THEMES[DEFAULT_THEME_ID].name, 'Cyberpunk Neon');
    assert.equal(Object.keys(THEMES)[0], DEFAULT_THEME_ID);
    assert.equal(Object.values(THEMES).filter(theme => theme.isDefault).length, 1);
});

test('recent decks are capped at ten, newest first', () => {
    const recentDecks = Array.from({ length: 10 }, (_, i) => ({ id: `d${i}`, title: `Deck ${i}` }));
    const next = upsertCurrentDeck({ ...sample, recentDecks });
    assert.equal(next.recentDecks.length, 10);
    assert.equal(next.recentDecks[0].id, next.currentDeckId);
    assert.equal(next.recentDecks.at(-1).id, 'd8');
});
