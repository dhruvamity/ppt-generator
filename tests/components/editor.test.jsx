import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useStore } from '../../src/store/useStore.js';
import { AnswerPicker } from '../../src/components/Generator/SlidePreview.jsx';
import PresentationOptions from '../../src/components/Generator/PresentationOptions.jsx';
import SlideDetails from '../../src/components/Generator/SlideDetails.jsx';

const question = { badge: 'Q.1', qText: 'Which number is prime?', options: [{ label: 'a', text: '4' }, { label: 'b', text: '7' }] };

beforeEach(() => useStore.setState({ activeSlides: [question], config: { insertBlankSlides: false, timerSeconds: 0 } }));
afterEach(cleanup);

function ActiveAnswer() {
    const slide = useStore(state => state.activeSlides[0]);
    return <AnswerPicker slide={slide} index={0} />;
}

describe('teacher controls', () => {
    it('marks and clears an option and writes the selected answer back to the source', () => {
        render(<ActiveAnswer />);
        const choice = screen.getByRole('button', { name: 'B' });
        fireEvent.click(choice);
        expect(choice.getAttribute('aria-pressed')).toBe('true');
        expect(useStore.getState().rawText).toContain('Answer: (b)');
        fireEvent.click(choice);
        expect(choice.getAttribute('aria-pressed')).toBe('false');
        expect(useStore.getState().rawText).not.toContain('Answer:');
    });

    it('updates workspace and timer options', () => {
        render(<PresentationOptions />);
        fireEvent.click(screen.getByRole('checkbox', { name: /blank work-space slides/i }));
        fireEvent.change(screen.getByRole('combobox', { name: /question timer/i }), { target: { value: '90' } });
        expect(useStore.getState().config).toMatchObject({ insertBlankSlides: true, timerSeconds: 90 });
    });

    it('stores speaker notes on the selected question', () => {
        render(<SlideDetails slide={question} index={0} />);
        const notes = screen.getByRole('textbox', { name: /speaker notes/i });
        fireEvent.change(notes, { target: { value: 'Try dividing by smaller primes.' } });
        fireEvent.blur(notes);
        expect(useStore.getState().activeSlides[0].notes).toBe('Try dividing by smaller primes.');
    });
});
