import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './fixtures/BottomDrawerFixture.svelte';
import { Dialog, Drawer } from '../src/lib';

afterEach(async () => { cleanup(); await page.viewport(1280, 720); });

for (const [width, height] of [[390, 844], [844, 390], [320, 568]]) {
  test(`bottom drawer meets the viewport edge at ${width} by ${height}`, async () => {
    await page.viewport(width, height);
    render(Fixture);
    await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
    const dialog = screen.getByRole('dialog', { name: 'City details' });
    const rect = dialog.getBoundingClientRect();
    expect(rect.left).toBe(0);
    expect(rect.right).toBe(window.innerWidth);
    expect(rect.bottom).toBe(window.innerHeight);
    expect(rect.height).toBeLessThan(height);
    expect(rect.top).toBeGreaterThan(0);
  });
}

test('long bottom drawer content scrolls with header and footer available after viewport resize', async () => {
  await page.viewport(390, 844);
  render(Fixture, { long: true });
  await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
  for (const [width, height] of [[390, 844], [844, 390], [390, 440]]) {
    await page.viewport(width, height);
    const dialog = screen.getByRole('dialog', { name: 'City details' });
    expect(dialog.getBoundingClientRect().bottom).toBe(height);
    await expect.poll(() => dialog.getBoundingClientRect().height).toBe(height);
    const notes = screen.getByRole('textbox', { name: 'Notes' });
    notes.focus();
    await expect.poll(() => notes.getBoundingClientRect().bottom).toBeLessThanOrEqual(height);
    const heading = screen.getByRole('heading', { name: 'City details' });
    const close = screen.getByRole('button', { name: 'Close' });
    const done = screen.getByRole('button', { name: 'Done' });
    expect(heading.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
    expect(close.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
    expect(done.getBoundingClientRect().bottom).toBeLessThanOrEqual(height);
    expect(notes.getBoundingClientRect().top).toBeGreaterThan(heading.getBoundingClientRect().bottom);
  }
});

test('bottom drawer keeps focus inside and restores the opener after Escape', async () => {
  render(Fixture);
  const opener = screen.getByRole('button', { name: 'Open details' });
  await userEvent.click(opener);
  const close = screen.getByRole('button', { name: 'Close' });
  const done = screen.getByRole('button', { name: 'Done' });
  expect(document.activeElement).toBe(close);
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
  expect(document.activeElement).toBe(done);
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(close);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(opener);
});

test('bottom drawer supports backdrop dismissal and explicit-dismissal options', async () => {
  await page.viewport(390, 844);
  const view = render(Fixture, { closeOnEscape: false, closeOnBackdrop: false });
  const opener = screen.getByRole('button', { name: 'Open details' });
  await userEvent.click(opener);
  await userEvent.keyboard('{Escape}');
  await userEvent.pointer({ coords: { x: 10, y: 10 }, keys: '[MouseLeft]' });
  expect(screen.getByRole('dialog', { name: 'City details' })).toBeTruthy();
  await view.rerender({ closeOnEscape: true, closeOnBackdrop: true });
  await userEvent.pointer({ coords: { x: 10, y: 10 }, keys: '[MouseLeft]' });
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(opener);
});

test('background remains locked until the last bottom drawer closes', async () => {
  render(Fixture);
  const opener = screen.getByRole('button', { name: 'Open details' });
  await userEvent.wheel(opener, { delta: { y: 300 } });
  await expect.poll(() => window.scrollY).toBeGreaterThan(0);
  window.scrollTo(0, 0);
  await expect.poll(() => window.scrollY).toBe(0);
  await userEvent.click(opener);
  await userEvent.wheel(screen.getByRole('button', { name: 'Close' }), { delta: { y: 300 } });
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  expect(window.scrollY).toBe(0);
  await userEvent.click(screen.getByRole('button', { name: 'Open nested details' }));
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => screen.queryByRole('dialog', { name: 'Nested details' })).toBeNull();
  await userEvent.wheel(screen.getByRole('button', { name: 'Close' }), { delta: { y: 300 } });
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  expect(window.scrollY).toBe(0);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  await userEvent.wheel(opener, { delta: { y: 300 } });
  await expect.poll(() => window.scrollY).toBeGreaterThan(0);
});

for (const side of ['left', 'right'] as const) {
  test(`${side} drawer keeps its desktop edge and width`, async () => {
    await page.viewport(1200, 720);
    render(Fixture, { side });
    await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
    const rect = screen.getByRole('dialog').getBoundingClientRect();
    expect(rect.width).toBe(396);
    expect(rect.height).toBe(720);
    expect(rect.top).toBe(0);
    expect(side === 'left' ? rect.left : rect.right).toBe(side === 'left' ? 0 : document.documentElement.clientWidth);
  });
}

test('long bottom drawer without a footer keeps its close control available', async () => {
  await page.viewport(320, 568);
  render(Fixture, { long: true, withFooter: false });
  await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
  screen.getByRole('textbox', { name: 'Notes' }).focus();
  expect(screen.getByRole('button', { name: 'Close' }).getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
  expect(screen.getByRole('textbox', { name: 'Notes' }).getBoundingClientRect().bottom).toBeLessThanOrEqual(568);
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
});

test('default drawer stays on the right and ordinary dialog stays centered', async () => {
  await page.viewport(1200, 720);
  const drawer = render(Drawer, { open: true, title: 'Default drawer', class: 'ascii-theme' });
  expect(screen.getByRole('dialog').getBoundingClientRect().right).toBe(1200);
  drawer.unmount();
  render(Dialog, { open: true, title: 'Confirmation', class: 'ascii-theme' });
  const rect = screen.getByRole('dialog').getBoundingClientRect();
  expect(rect.left + rect.width / 2).toBe(600);
  expect(rect.top + rect.height / 2).toBe(360);
});

test('focusing a framed input keeps the whole control above the bottom drawer footer', async () => {
  await page.viewport(390, 844);
  render(Fixture, { long: true });
  await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
  const input = screen.getByRole('textbox', { name: 'Notes' });
  await userEvent.fill(input, 'A note about this material');
  expect(document.activeElement).toBe(input);
  const footerAction = screen.getByRole('button', { name: 'Done' });
  // The footer is separate from the scroller; the entire input, including its
  // decorative frame, must remain in the visible content above it.
  await expect.poll(() => input.getBoundingClientRect().bottom).toBeLessThanOrEqual(footerAction.parentElement!.getBoundingClientRect().top);
});
