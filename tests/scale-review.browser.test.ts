import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './ScaleReviewFixture.svelte';

afterEach(cleanup);

for (const size of ['s', 'm', 'l'] as const) {
  for (const width of [144, 280, 640]) {
    test(`${size} numeric ticks stay on one line in a ${width}px anywhere-wrapping host`, () => {
      render(Fixture, { size, width });
      for (const label of screen.getAllByText(/^(0|50|100)$/)) {
        expect.soft(label.getBoundingClientRect().height).toBeLessThanOrEqual(parseFloat(getComputedStyle(label).lineHeight) + 1);
      }
      for (const input of [screen.getByRole('slider', { name: 'Weight' }), screen.getByRole('slider', { name: 'Lower value' })]) {
        const bounds = input.getBoundingClientRect();
        const root = input.parentElement!.parentElement!;
        for (const label of root.querySelectorAll('span')) {
          if (label.textContent !== '0' && label.textContent !== '100') continue;
          const rect = label.getBoundingClientRect();
          expect(rect.left + rect.width / 2).toBeCloseTo(label.textContent === '0' ? bounds.left + 10 : bounds.right - 10, 1);
        }
      }
    });
  }
  test(`${size} custom tick labels remain complete readable units`, () => {
    render(Fixture, { size, width: 280, marks: [{ value: 0, label: 'Low cost' }, { value: 100, label: 'High cost' }] });
    for (const label of screen.getAllByText(/^(Low cost|High cost)$/)) {
      expect(label.getBoundingClientRect().height).toBeLessThanOrEqual(parseFloat(getComputedStyle(label).lineHeight) + 1);
      expect(label.getBoundingClientRect().width).toBeGreaterThan(30);
    }
  });
}

async function raster(element: Element) {
  const capture: string | { base64: string } = await page.elementLocator(element).screenshot({ base64: true, save: false });
  const image = new Image();
  image.src = `data:image/png;base64,${typeof capture === 'string' ? capture : capture.base64}`;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d')!;
  context.drawImage(image, 0, 0);
  return { width: image.width, height: image.height, data: context.getImageData(0, 0, image.width, image.height).data };
}

// At a native thumb endpoint the handle covers the cap. Check its actual
// computed paint as well as the visible Slider pixels above, without hiding handles.
function capColors(input: Element) {
  const candidates = Array.from(input.parentElement!.querySelectorAll('*'));
  const rail = candidates.find(element => getComputedStyle(element, '::before').borderLeftWidth === '1px' && getComputedStyle(element, '::after').borderRightWidth === '1px')!;
  return [getComputedStyle(rail, '::before').borderLeftColor, getComputedStyle(rail, '::after').borderRightColor];
}

for (const size of ['s', 'm', 'l'] as const) {
  test(`${size} selected Slider includes the visible left tail and endcap`, async () => {
    render(Fixture, { size, value: 60 });
    const input = screen.getByRole('slider', { name: 'Weight' });
    const image = await raster(input.parentElement!);
    const factor = image.width / input.parentElement!.getBoundingClientRect().width;
    let selected = 0;
    let muted = 0;
    for (let y = Math.ceil(4 * factor); y < image.height - 4 * factor; y++) for (let x = Math.ceil(10 * factor); x < 26 * factor; x++) {
      const offset = (y * image.width + x) * 4;
      const [red, green] = image.data.slice(offset, offset + 2);
      if (green > 32) { if (green > red * 2) selected++; else muted++; }
    }
    expect(selected).toBeGreaterThan(10);
    expect(muted).toBe(0);
  });


  test(`${size} Slider endpoint colors follow native Home and End values`, async () => {
    render(Fixture, { size });
    const input = screen.getByRole('slider', { name: 'Weight' }) as HTMLInputElement;
    expect(capColors(input)).toEqual(['rgb(0, 255, 0)', 'rgb(136, 136, 136)']);
    input.focus();
    await userEvent.keyboard('{End}');
    expect(input.value).toBe('100');
    expect(capColors(input)).toEqual(['rgb(0, 255, 0)', 'rgb(0, 255, 0)']);
    await userEvent.keyboard('{Home}');
    expect(input.value).toBe('0');
    expect(capColors(input)).toEqual(['rgb(0, 255, 0)', 'rgb(136, 136, 136)']);
  });

  for (const [lower, upper, expected] of [
    [20, 70, ['rgb(136, 136, 136)', 'rgb(136, 136, 136)']],
    [0, 70, ['rgb(0, 255, 0)', 'rgb(136, 136, 136)']],
    [20, 100, ['rgb(136, 136, 136)', 'rgb(0, 255, 0)']],
    [0, 100, ['rgb(0, 255, 0)', 'rgb(0, 255, 0)']],
  ] as const) {
    test(`${size} Range ${lower}–${upper} colors only the endpoints reached by its selected interval`, () => {
      render(Fixture, { size, lower, upper });
      expect(capColors(screen.getByRole('slider', { name: 'Lower value' }))).toEqual(expected);
    });
  }

}

test.skipIf(!matchMedia('(forced-colors: active)').matches)('forced colors preserve selected caps and the masked dashed rail', async () => {
  render(Fixture, { size: 'm', width: 280 });
  const input = screen.getByRole('slider', { name: 'Weight' });
  const colors = ['Highlight', 'CanvasText'].map(color => {
    const probe = document.createElement('span');
    probe.style.color = color;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  });
  expect(capColors(input)).toEqual(colors);
  const track = input.parentElement!;
  const image = await raster(track);
  const factor = image.width / track.getBoundingClientRect().width;
  const background = image.data.slice(0, 3);
  const painted = (x: number) => {
    const column = Math.floor(x * factor);
    for (let y = 0; y < image.height; y++) {
      const offset = (y * image.width + column) * 4;
      if (background.some((channel, index) => Math.abs(image.data[offset + index] - channel) > 32)) return true;
    }
    return false;
  };
  expect(painted(20), 'selected dash is painted').toBe(true);
  expect(painted(16), 'gap remains unpainted').toBe(false);
  expect(painted(10), 'selected endcap is painted').toBe(true);
});

for (const size of ['s', 'm', 'l'] as const) {
  test(`${size} long custom endpoint labels fit a padded 320px viewport and reserve their height`, async () => {
    const previousMargin = document.body.style.margin;
    document.body.style.margin = '0';
    await page.viewport(320, 700);
    try {
      render(Fixture, { size, width: 280, padded: true, marks: [
        { value: 0, label: 'Minimum' }, { value: 100, label: 'Maximum safe temperature' },
      ] });
      expect.soft(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);
      for (const label of screen.getAllByText('Maximum safe temperature')) {
        const scale = label.closest('[data-size]')!;
        const bounds = scale.getBoundingClientRect();
        const rect = label.getBoundingClientRect();
        expect.soft(rect.left).toBeGreaterThanOrEqual(bounds.left);
        expect.soft(rect.right).toBeLessThanOrEqual(bounds.right);
        expect.soft(rect.bottom).toBeLessThanOrEqual(bounds.bottom + 1);
        expect.soft(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
      }
      const slider = screen.getByRole('slider', { name: 'Weight' });
      const range = screen.getByRole('slider', { name: 'Lower value' });
      const lastSliderLabel = slider.parentElement!.parentElement!.querySelectorAll('span');
      const labelBottom = Math.max(...Array.from(lastSliderLabel).filter(element => element.textContent === 'Maximum safe temperature').map(element => element.getBoundingClientRect().bottom));
      expect(range.parentElement!.parentElement!.getBoundingClientRect().top).toBeGreaterThanOrEqual(labelBottom);
    } finally {
      document.body.style.margin = previousMargin;
      await page.viewport(1280, 720);
    }
  });
}

for (const size of ['s', 'm', 'l'] as const) {
  for (const width of [80, 144]) {
    test(`${size} explicit numeric ticks remain whole and centered at ${width}px`, () => {
      render(Fixture, { size, width, marks: [{ value: 0, label: '0' }, { value: 50, label: '50' }, { value: 100, label: '100' }] });
      for (const input of [screen.getByRole('slider', { name: 'Weight' }), screen.getByRole('slider', { name: 'Lower value' })]) {
        const scale = input.parentElement!.parentElement!;
        const bounds = scale.getBoundingClientRect();
        for (const label of scale.querySelectorAll('span')) {
          if (!['0', '50', '100'].includes(label.textContent ?? '')) continue;
          const rect = label.getBoundingClientRect();
          expect.soft(rect.height).toBeLessThanOrEqual(parseFloat(getComputedStyle(label).lineHeight) + 1);
          expect.soft(rect.left + rect.width / 2).toBeCloseTo(bounds.left + 26 + (bounds.width - 52) * Number(label.textContent) / 100, 1);
        }
      }
    });
  }
}
