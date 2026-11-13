import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import ThemeSelector from '../../src/components/Generator/ThemeSelector.jsx';
import { useStore, DEFAULT_THEME_ID } from '../../src/store/useStore.js';
import { THEMES } from '../../src/utils/themeConfig.js';

beforeEach(() => useStore.setState({ themeId: DEFAULT_THEME_ID, layoutId: 'modern-sidebar', savedThemes: [] }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('opens a limited page of read-only cards without starting slide fitting', () => {
    const ResizeObserver = vi.fn(class { observe() {} disconnect() {} });
    vi.stubGlobal('ResizeObserver', ResizeObserver);
    render(<ThemeSelector />);
    const browse = screen.getByRole('button', { name: 'Browse designs' });
    fireEvent.click(browse);
    const results = screen.getByLabelText('Design results');

    expect(browse.getAttribute('aria-expanded')).toBe('true');
    expect(within(results).getAllByRole('button')).toHaveLength(12);
    expect(ResizeObserver).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText(/^Page 2 of/)).toBeTruthy();
    expect(within(results).queryByRole('button', { name: 'Cyberpunk Neon' })).toBeNull();
    fireEvent.click(browse);
    expect(screen.queryByLabelText('Design results')).toBeNull();
});

it('searches beyond the current page, includes custom designs and applies a selection', () => {
    useStore.setState({ savedThemes: [{ ...THEMES['exam-paper'], id: 'custom-classroom', name: 'Custom classroom' }] });
    render(<ThemeSelector />);
    fireEvent.click(screen.getByRole('button', { name: 'Browse designs' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    const search = screen.getByRole('searchbox', { name: 'Search designs' });
    fireEvent.change(search, { target: { value: 'Custom classroom' } });
    const results = screen.getByLabelText('Design results');
    fireEvent.click(within(results).getByRole('button', { name: 'Custom classroom' }));
    expect(useStore.getState().themeId).toBe('custom-classroom');
    expect(screen.queryByRole('button', { name: 'Previous page' })).toBeNull();

    fireEvent.change(search, { target: { value: 'matrix brackets' } });
    expect(within(results).getByRole('button', { name: 'Matrix Brackets' })).toBeTruthy();
});
