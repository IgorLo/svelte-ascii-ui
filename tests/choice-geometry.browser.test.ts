import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import Fixture from './ChoiceGeometryFixture.svelte';

afterEach(cleanup);

for (const size of ['s', 'm'] as const) {
  for (const width of [240, 120, 24]) {
    test(`${size} choice marks retain their geometry with long labels in a ${width}px container`, () => {
      expect(matchMedia('(pointer: coarse)').matches).toBe(Boolean(import.meta.env.CHOICE_TOUCH));
      render(Fixture, { size, width });
      for (const role of ['checkbox', 'switch'] as const) {
        for (const input of screen.getAllByRole(role)) {
          const label = input.closest('label')!;
          // Measure the rendered decorative mark, without coupling to its private class name.
          const mark = label.querySelector('[aria-hidden="true"]')!;
          const rect = mark.getBoundingClientRect();
          expect.soft(rect.height).toBe(size === 's' ? 30 : 40);
          expect.soft(rect.width).toBe(role === 'checkbox' ? (size === 's' ? 30 : 40) : (size === 's' ? 54 : 64));
          if (matchMedia('(pointer: coarse)').matches) {
            expect.soft(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  }
}
