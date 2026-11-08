import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
import Example from '../stories/overlays/PopoverCompactExample.svelte';
import '../src/lib/theme.css';

afterEach(cleanup);

for (const size of ['s', 'm', 'l'] as const) {
  test(`compact help preserves native keyboard and overlay behavior at ${size}`, async () => {
    render(Example, { size });
    const trigger = screen.getByRole('button', { name: 'About retention' });
    expect(trigger.textContent?.trim()).toBe('[?]');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.focus();
    expect(getComputedStyle(trigger).outlineStyle).toBe('solid');
    expect(getComputedStyle(trigger).outlineWidth).toBe('2px');
    await userEvent.keyboard('{Enter}');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'Retention help' }).id).toBe(trigger.getAttribute('aria-controls'));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Got it' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    await userEvent.keyboard(' ');
    await userEvent.click(screen.getByRole('button', { name: 'Got it' }));
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  test(`compact targets retain space without overlaps at ${size}`, async () => {
    render(Example, { size });
    const trigger = screen.getByRole('button', { name: 'About retention' });
    const neighbor = screen.getByRole('button', { name: 'About backups' });
    const regular = screen.getByRole('button', { name: 'Display options' });
    const minimum = matchMedia('(pointer: coarse)').matches ? 44 : 24;
    for (const button of [trigger, neighbor]) {
      const rect = button.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(minimum);
      expect(rect.height).toBeGreaterThanOrEqual(minimum);
      expect(getComputedStyle(button).borderTopWidth).toBe('0px');
    }
    const a = trigger.getBoundingClientRect();
    const b = neighbor.getBoundingClientRect();
    expect(a.right <= b.left || a.bottom <= b.top).toBe(true);
    expect(regular.getBoundingClientRect().height).toBeGreaterThanOrEqual(matchMedia('(pointer: coarse)').matches ? 44 : { s: 32, m: 39, l: 48 }[size]);
    await userEvent.click(neighbor);
    expect(screen.getByRole('dialog', { name: 'About backups' })).toBeTruthy();
    expect(neighbor.textContent?.trim()).toBe('[i]');
    await userEvent.keyboard('{Escape}');
    expect(document.activeElement).toBe(neighbor);
  });
}

for (const size of ['s', 'm', 'l'] as const) {
  for (const width of [320, 390]) {
    for (const edge of [false, true]) {
      test(`long Cyrillic help fits ${width}px at ${edge ? 'bottom right' : 'top left'} (${size})`, async () => {
        await page.viewport(width, 640);
        render(Example, { size, edge });
        await userEvent.click(screen.getByRole('button', { name: 'About retention' }));
        const dialog = screen.getByRole('dialog', { name: 'Retention help' });
        expect(dialog.textContent).toContain('случайно удалённые материалы');
        const rect = dialog.getBoundingClientRect();
        expect(rect.left).toBeGreaterThanOrEqual(0);
        expect(rect.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
        expect(rect.top).toBeGreaterThanOrEqual(0);
        expect(rect.bottom).toBeLessThanOrEqual(document.documentElement.clientHeight);
        expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
        expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
        await userEvent.keyboard('{Escape}');
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'About retention' }));
      });
    }
  }
}
