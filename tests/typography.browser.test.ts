import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page } from 'vitest/browser';
import Fixture from './TypographyFixture.svelte';

afterEach(() => { cleanup(); document.documentElement.style.fontSize = ''; });

test('reading tokens resize content independently of compact controls and preserve default text', () => {
  render(Fixture);
  const body = getComputedStyle(screen.getByText('Readable body'));
  expect(body.fontSize).toBe('18px');
  expect(body.fontWeight).toBe('400');
  const date = getComputedStyle(screen.getByText('Дата источника'));
  expect(date.fontSize).toBe('17.5px');
  expect(date.fontWeight).toBe('400');
  const link = getComputedStyle(screen.getByRole('link', { name: 'Источник данных' }));
  expect(link.fontSize).toBe(date.fontSize);
  expect(link.fontWeight).toBe(date.fontWeight);
  expect(getComputedStyle(screen.getByText('Данные проверены', { exact: false })).fontSize).toBe(date.fontSize);
  expect(getComputedStyle(screen.getByRole('link', { name: 'Compact source' })).fontSize).toBe('13px');
  expect(getComputedStyle(screen.getByText('Default body')).fontSize).toBe('16px');
  expect(getComputedStyle(screen.getByText('Default article')).fontSize).toBe('14px');
  expect(getComputedStyle(screen.getByRole('link', { name: 'Default source' })).fontSize).toBe('13px');
});

for (const width of [360, 1280]) {
  test(`reading text reflows and inherited links retain visible keyboard focus at ${width}px`, async () => {
    await page.viewport(width, 900);
    render(Fixture);
    const card = screen.getByRole('region', { name: 'Reading card' });
    expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    const link = screen.getByRole('link', { name: 'Источник данных' });
    link.focus();
    expect(getComputedStyle(link).outlineStyle).not.toBe('none');
    expect(getComputedStyle(link).fontSize).toBe('17.5px');
    const input = getComputedStyle(screen.getByRole('textbox', { name: 'Compact control' }));
    expect(input.fontSize).toBe(width <= 760 ? '16px' : '13px');
  });
}

test('relative reading tokens respond to the browser root font size', () => {
  document.documentElement.style.fontSize = '20px';
  render(Fixture);
  expect(getComputedStyle(screen.getByRole('link', { name: 'Источник данных' })).fontSize).toBe('21.875px');
});

test('nested Theme applies its own body size and resets Article defaults independently', () => {
  render(Fixture);
  expect(getComputedStyle(screen.getByText('Nested body')).fontSize).toBe('18px');
  expect(getComputedStyle(screen.getByText('Nested body')).fontWeight).toBe('400');
  expect(getComputedStyle(screen.getByText('Nested article')).fontSize).toBe('14px');
});
