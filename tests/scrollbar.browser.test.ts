import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './ScrollbarFixture.svelte';

afterEach(cleanup);

const hasParts = CSS.supports('selector(::-webkit-scrollbar)');
const hasColors = CSS.supports('scrollbar-color: auto');
const part = (element: Element, name: string) => getComputedStyle(element, `::-webkit-scrollbar${name}`);

for (const [palette, thumb] of [
  ['phosphor', 'rgb(167, 178, 158)'],
  ['paper', 'rgb(93, 101, 86)'],
  ['plum', 'rgb(185, 167, 189)'],
] as const) {
  test(`${palette}: opted-in native scrollbar follows theme without affecting other areas`, () => {
    render(Fixture, { palette });
    const region = screen.getByRole('region', { name: 'Themed settings' });
    if (hasParts) {
      if (hasColors) expect(getComputedStyle(region).scrollbarColor).toBe('auto');
      expect(part(region, '-thumb').backgroundColor).toBe(thumb);
      expect(part(region, '-track').backgroundColor).toBe('rgba(0, 0, 0, 0.12)');
    } else {
      expect(getComputedStyle(region).scrollbarColor).toBe(`${thumb} rgba(0, 0, 0, 0.12)`);
    }
    if (CSS.supports('scrollbar-width: auto')) expect(getComputedStyle(region).scrollbarWidth).toBe('auto');
    if (hasColors) expect(getComputedStyle(screen.getByRole('region', { name: 'Native settings' })).scrollbarColor).toBe('auto');
    expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
  });
}

test('square thumb fills a 16px gutter without a narrow inset', () => {
  if (!hasParts) return;
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Themed settings' });
  const thumb = part(region, '-thumb');
  expect(part(region, '').width).toBe('16px');
  expect(part(region, '').height).toBe('16px');
  expect(thumb.borderRadius).toBe('0px');
  expect(thumb.borderWidth).toBe('0px');
  expect(thumb.boxShadow).toBe('none');
});

test('a Theme scroll container receives the same opt-in treatment', () => {
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Theme scroll container' });
  expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
  if (hasParts) {
    expect(part(region, '').width).toBe('16px');
    expect(part(region, '-thumb').backgroundColor).toBe('rgb(167, 178, 158)');
  } else expect(getComputedStyle(region).scrollbarColor).toBe('rgb(167, 178, 158) rgba(0, 0, 0, 0.12)');
});

test('horizontal overflow keeps native keyboard scrolling', async () => {
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Wide settings' });
  expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
  region.focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.poll(() => region.scrollLeft).toBeGreaterThan(0);
  expect(getComputedStyle(region).outlineStyle).not.toBe('none');
});

test('themed region scrolls with the keyboard and keeps visible focus', async () => {
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Themed settings' });
  region.focus();
  await userEvent.keyboard('{PageDown}');
  await expect.poll(() => region.scrollTop).toBeGreaterThan(0);
  if (hasParts) expect(part(region, '-thumb').backgroundColor).toBe('rgb(196, 237, 131)');
  else expect(getComputedStyle(region).scrollbarColor).toBe('rgb(196, 237, 131) rgba(0, 0, 0, 0.12)');
  expect(getComputedStyle(region).outlineStyle).not.toBe('none');
});

test('nested containers keep native geometry until explicitly opted in', () => {
  render(Fixture);
  const nested = screen.getByRole('region', { name: 'Nested settings' });
  if (hasParts) {
    expect(part(nested, '').width).toBe('auto');
    expect(part(nested, '-thumb').backgroundColor).toBe('rgba(0, 0, 0, 0)');
  } else expect(getComputedStyle(nested).scrollbarColor).toBe('rgb(167, 178, 158) rgba(0, 0, 0, 0.12)');
  if (hasColors) expect(getComputedStyle(screen.getByRole('region', { name: 'Native settings' })).scrollbarColor).toBe('auto');
});
