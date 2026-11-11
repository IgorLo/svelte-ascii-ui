import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './ControlArtFixture.svelte';

afterEach(cleanup);

// Check rendered strokes, not a stored screenshot of the evolving style.
async function pixels(element: Element) {
  const capture: string | { base64: string } = await page.elementLocator(element).screenshot({ base64: true, save: false });
  const base64 = typeof capture === 'string' ? capture : capture.base64;
  const image = new Image();
  image.src = `data:image/png;base64,${base64}`;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d')!;
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, image.width, image.height);
  return {
    width: image.width, height: image.height,
    ink(x: number, y: number) { return data[(y * image.width + x) * 4] > 32; },
  };
}

for (const size of ['s', 'm', 'l'] as const) {
  for (const zoom of [1, 1.25, 2]) {
    for (const state of ['empty', 'checked', 'indeterminate', 'disabled'] as const) {
      test(`${size} ${state} checkbox keeps four middle strokes at CSS zoom ${zoom}`, async () => {
        render(Fixture, { size, zoom, state });
        const mark = screen.getByRole('checkbox').closest('label')!.querySelector('[aria-hidden="true"]')!;
        const markSize = { s: 26, m: 30, l: 40 }[size];
        expect(mark.getBoundingClientRect().width).toBeCloseTo(markSize * zoom, 1);
        const raster = await pixels(mark);
        const middleX = Math.floor(raster.width / 2);
        const middleY = Math.floor(raster.height / 2);
        const edge = Math.floor(raster.width * .3);
        const hasInk = (x0: number, y0: number, x1: number, y1: number) => {
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (raster.ink(x, y)) return true;
          return false;
        };
        expect.soft(hasInk(middleX - 1, 0, middleX + 2, edge), 'top middle stroke').toBe(true);
        expect.soft(hasInk(middleX - 1, raster.height - edge, middleX + 2, raster.height), 'bottom middle stroke').toBe(true);
        expect.soft(hasInk(0, middleY - 1, edge, middleY + 2), 'left middle stroke').toBe(true);
        expect.soft(hasInk(raster.width - edge, middleY - 1, raster.width, middleY + 2), 'right middle stroke').toBe(true);
      });
    }
    for (const width of [144, 280, 640]) {
      test(`${size} scales join both endcaps at ${width}px and CSS zoom ${zoom}`, async () => {
        render(Fixture, { size, width, zoom, lower: 50, upper: 50 });
        for (const name of ['Weight', 'Lower value']) {
          const input = screen.getByRole('slider', { name });
          const track = input.parentElement!;
          const raster = await pixels(track);
          const factor = raster.width / (track.getBoundingClientRect().width / zoom);
          for (const mirrored of [false, true]) {
            const ink = (x: number, y: number) => raster.ink(mirrored ? raster.width - 1 - x : x, y);
            const cap = Array.from({ length: Math.ceil(20 * factor) }, (_, x) => ({
              x, count: Array.from({ length: raster.height }, (_, y) => ink(x, y)).filter(Boolean).length,
            })).sort((a, b) => b.count - a.count)[0].x;
            const rows = Array.from({ length: raster.height }, (_, y) => y).filter(y => ink(cap + Math.ceil(2 * factor), y));
            expect(rows.length, `${name} endcap arm`).toBeGreaterThan(0);
            expect(rows.some(y => {
              let gap = 0;
              for (let x = cap + Math.ceil(2 * factor); x < Math.floor(36 * factor); x++) {
                gap = ink(x, y) ? 0 : gap + 1;
                if (gap > Math.ceil(4 * factor)) return false;
              }
              return true;
            }), `${name} ${mirrored ? 'right' : 'left'} joined rail`).toBe(true);
          }
        }
      });
    }
  }
  test(`${size} keeps native keyboard values, focus and corresponding thumb positions`, async () => {
    render(Fixture, { size, width: 280 });
    const slider = screen.getByRole('slider', { name: 'Weight' }) as HTMLInputElement;
    slider.focus();
    await userEvent.keyboard('{Home}');
    expect(slider.value).toBe('0');
    const track = slider.parentElement!;
    expect(getComputedStyle(track).outlineStyle).toBe('dashed');
    const handle = Array.from(track.querySelectorAll('span')).find(span => span.textContent === '[◆]')!;
    const inputRect = slider.getBoundingClientRect();
    const center = () => handle.getBoundingClientRect().left + handle.getBoundingClientRect().width / 2;
    expect(center()).toBeCloseTo(inputRect.left + 10, 1);
    await userEvent.keyboard('{End}');
    expect(slider.value).toBe('100');
    expect(center()).toBeCloseTo(inputRect.right - 10, 1);
    await userEvent.keyboard('{ArrowLeft}');
    expect(slider.value).toBe('99');
    const lower = screen.getByRole('slider', { name: 'Lower value' }) as HTMLInputElement;
    const upper = screen.getByRole('slider', { name: 'Upper value' }) as HTMLInputElement;
    lower.focus();
    await userEvent.keyboard('{End}');
    expect(lower.value).toBe('70');
    upper.focus();
    await userEvent.keyboard('{Home}');
    expect(upper.value).toBe('70');
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    checkbox.focus();
    await userEvent.keyboard(' ');
    expect(checkbox.checked).toBe(true);
    expect(getComputedStyle(checkbox.nextElementSibling!).outlineStyle).toBe('dashed');
  });
}
