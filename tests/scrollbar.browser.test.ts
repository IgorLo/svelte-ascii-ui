import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './ScrollbarFixture.svelte';

afterEach(cleanup);

for (const [palette, expected] of [
  ['phosphor', 'rgb(167, 178, 158) rgb(24, 28, 25)'],
  ['paper', 'rgb(93, 101, 86) rgb(238, 233, 220)'],
  ['plum', 'rgb(185, 167, 189) rgb(37, 30, 44)'],
] as const) {
  test(`${palette}: opted-in native scrollbar follows theme without affecting other areas`, () => {
    render(Fixture, { palette });
    const region = screen.getByRole('region', { name: 'Themed settings' });
    expect(getComputedStyle(region).scrollbarColor).toBe(expected);
    expect(getComputedStyle(region).scrollbarWidth).toBe('auto');
    expect(getComputedStyle(screen.getByRole('region', { name: 'Native settings' })).scrollbarColor).toBe('auto');
    expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
  });
}

test('themed region scrolls with the keyboard and keeps visible focus', async () => {
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Themed settings' });
  region.focus();
  await userEvent.keyboard('{PageDown}');
  await expect.poll(() => region.scrollTop).toBeGreaterThan(0);
  expect(getComputedStyle(region).scrollbarColor).toBe('rgb(196, 237, 131) rgb(24, 28, 25)');
  expect(getComputedStyle(region).outlineStyle).not.toBe('none');
});

test('native scrollbar colors inherit within the opted-in subtree', () => {
  render(Fixture);
  expect(getComputedStyle(screen.getByRole('region', { name: 'Nested settings' })).scrollbarColor).toBe('rgb(167, 178, 158) rgb(24, 28, 25)');
  expect(getComputedStyle(screen.getByRole('region', { name: 'Native settings' })).scrollbarColor).toBe('auto');
});
