import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRevealHtml } from '../src/utils/exportRevealJS.js';
import { THEMES } from '../src/utils/themeConfig.js';

const deckConfig = (insertBlankSlides) => ({
    mainTitle1: 'Practice',
    mainTitle2: 'Questions',
    pill1: 'Math',
    pill2: '2026',
    footer: 'Practice set',
    insertBlankSlides,
});

const sampleSlides = [
    { badge: 'Q.1', qText: 'First question?', options: [{ label: 'A', text: 'One' }] },
    { badge: 'Q.2', qText: 'Second question?', options: [{ label: 'A', text: 'Two' }] },
];

test('blank solution slides are added only when the setting is enabled', () => {
    const withoutWorkspaces = buildRevealHtml(deckConfig(false), sampleSlides, THEMES['dark-neon']);
    const withWorkspaces = buildRevealHtml(deckConfig(true), sampleSlides, THEMES['dark-neon']);

    assert.equal((withoutWorkspaces.match(/class="slide-container"/g) || []).length, 3);
    assert.equal((withoutWorkspaces.match(/data-workspace="true"/g) || []).length, 0);
    assert.equal((withWorkspaces.match(/class="slide-container"/g) || []).length, 5);
    assert.equal((withWorkspaces.match(/data-workspace="true"/g) || []).length, 2);
    assert.equal((withWorkspaces.match(/>WORK SPACE</g) || []).length, 2);
});

test('PDF and browser print exports retain enabled workspace slides', () => {
    const html = buildRevealHtml(deckConfig(true), sampleSlides, THEMES['dark-neon']);

    assert.match(html, /const slides = \[\.\.\.document\.querySelectorAll\('\.slides \.slide-container'\)\];/);
    assert.match(html, /document\.querySelectorAll\('\.slides \.slide-container'\)\.forEach\(slide => \{\s*pages\.appendChild\(slide\.cloneNode\(true\)\);/);
    assert.doesNotMatch(html, /dataset\.workspace !== 'true'/);
});

test('workspace slides have a writing area in the default layout', () => {
    const html = buildRevealHtml(deckConfig(true), sampleSlides, THEMES['dark-neon'], 'modern-sidebar');

    assert.match(html, /background: repeating-linear-gradient\(to bottom/);
    assert.match(html, /WORK SPACE/);
});
