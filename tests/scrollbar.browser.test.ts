import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
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

test('square thumb fills a 6px gutter without a narrow inset', () => {
  if (!hasParts) return;
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Themed settings' });
  const thumb = part(region, '-thumb');
  expect(part(region, '').width).toBe('6px');
  expect(part(region, '').height).toBe('6px');
  expect(thumb.borderRadius).toBe('0px');
  expect(thumb.borderWidth).toBe('0px');
  expect(thumb.boxShadow).toBe('none');
});

test('a Theme scroll container receives the same opt-in treatment', () => {
  render(Fixture);
  const region = screen.getByRole('region', { name: 'Theme scroll container' });
  expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
  if (hasParts) {
    expect(part(region, '').width).toBe('6px');
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

for (const orientation of ['vertical', 'horizontal']) {
  test(orientation + ': native scrollbar has one visible arrow at each end', async ({ onTestFinished }) => {
    if (!hasParts) return;
    // Exercise platforms that expose both native buttons at each end.
    const nativeButtons = document.createElement('style');
    nativeButtons.textContent = ':where(.aui-scrollbar)::-webkit-scrollbar-button { display: block; }';
    document.head.append(nativeButtons);
    onTestFinished(() => nativeButtons.remove());
    render(Fixture);
    const vertical = orientation === 'vertical';
    const name = vertical ? 'Themed settings' : 'Wide settings';
    const region = screen.getByRole('region', { name });
    region.scrollTo({ top: (region.scrollHeight - region.clientHeight) / 2, left: (region.scrollWidth - region.clientWidth) / 2 });
    const base64 = await page.screenshot({ element: page.getByRole('region', { name, exact: true }), save: false });
    const image = new Image();
    image.src = 'data:image/png;base64,' + base64;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const ratio = image.width / region.offsetWidth;
    const gutter = Math.round((vertical ? region.offsetWidth - region.clientWidth : region.offsetHeight - region.clientHeight) * ratio);
    const length = Math.round((vertical ? region.clientHeight : region.clientWidth) * ratio);
    function arrowGroups(from: number, to: number) {
      let groups = 0, previous = false;
      for (let offset = from; offset < to; offset++) {
        const pixels = vertical
          ? context.getImageData(image.width - gutter, offset, gutter, 1).data
          : context.getImageData(offset, image.height - gutter, 1, gutter).data;
        let visible = false;
        for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 100 && pixels[i + 1] > 100 && pixels[i + 2] > 70) visible = true;
        if (visible && !previous) groups++;
        previous = visible;
      }
      return groups;
    }
    expect(arrowGroups(0, gutter * 2)).toBe(1);
    expect(arrowGroups(length - gutter * 2, length)).toBe(1);
  });
}

test('site scope themes the viewport and unmarked nested scrollers', ({ onTestFinished }) => {
  const root = document.documentElement;
  root.classList.add('aui-scrollbars');
  onTestFinished(() => root.classList.remove('aui-scrollbars'));
  render(Fixture, { palette: 'plum' });
  const nested = screen.getByRole('region', { name: 'Nested settings' });
  if (hasParts) {
    expect(part(root, '').width).toBe('6px');
    expect(part(nested, '').width).toBe('6px');
    expect(part(nested, '-thumb').backgroundColor).toBe('rgb(185, 167, 189)');
  } else if (hasColors) expect(getComputedStyle(nested).scrollbarColor).toBe('rgb(185, 167, 189) rgba(0, 0, 0, 0.12)');
});

test('a standalone Drawer exposes a themed scrollbar on its scrollable content', () => {
  render(Fixture, { drawerOpen: true });
  const dialog = screen.getByRole('dialog', { name: 'Preferences' });
  const scroller = Array.from(dialog.querySelectorAll('div')).find(element =>
    getComputedStyle(element).overflowY === 'auto' && element.scrollHeight > element.clientHeight
  );
  expect(scroller).toBeDefined();
  scroller!.scrollTop = 64;
  expect(scroller!.scrollTop).toBe(64);
  if (hasParts) expect(part(scroller!, '').width).toBe('6px');
  else if (hasColors) expect(getComputedStyle(scroller!).scrollbarColor).toContain('rgba(0, 0, 0, 0.12)');
});
