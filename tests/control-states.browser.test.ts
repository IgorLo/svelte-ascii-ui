import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './ControlStatesFixture.svelte';

afterEach(cleanup);
const appearance = (element: Element) => {
  const style = getComputedStyle(element);
  return [style.color, style.backgroundColor, style.borderImageSource];
};

const variants = (['phosphor', 'paper', 'plum'] as const).flatMap(palette => (['s', 'm'] as const).map(size => ({ palette, size })));
test.each(variants)('$palette $size fields respond to hover without masking invalid or keyboard focus', async ({ palette, size }) => {
  render(Fixture, { palette, size });
  for (const name of ['Editable', 'Notes', 'Choice', 'Search', 'Password', 'Amount', 'Search choices', 'Tags']) {
    await userEvent.hover(screen.getByRole('heading'));
    const field = screen.getByLabelText(name);
    const before = appearance(field);
    const rect = field.getBoundingClientRect().toJSON();
    await userEvent.hover(field);
    expect(appearance(field)).not.toEqual(before);
    expect(field.getBoundingClientRect().toJSON()).toEqual(rect);
    await userEvent.unhover(field);
  }
  const invalid = screen.getByLabelText('Invalid');
  const frame = appearance(invalid)[2];
  await userEvent.hover(invalid);
  expect(appearance(invalid)[2]).toBe(frame);
  await userEvent.unhover(invalid);
  await userEvent.tab();
  const focused = document.activeElement!;
  expect(focused).toBe(screen.getByLabelText('Editable'));
  const focus = appearance(focused);
  await userEvent.hover(focused);
  expect(appearance(focused)).toEqual(focus);
});

test('danger hover preserves its semantic color and disabled/read-only controls stay unchanged', async () => {
  render(Fixture);
  const danger = screen.getByRole('button', { name: 'Delete' });
  const before = appearance(danger);
  await userEvent.hover(danger);
  expect(appearance(danger)[0]).toBe(before[0]);
  expect(appearance(danger)[1]).not.toBe(before[1]);
  await userEvent.unhover(danger);
  for (const element of [screen.getByLabelText('Read only'), screen.getByLabelText('Disabled'), screen.getByRole('button', { name: 'Unavailable' })]) {
    const before = appearance(element);
    await userEvent.hover(element);
    expect(appearance(element)).toEqual(before);
    await userEvent.unhover(element);
  }
});

test.each(variants)('$palette $size choice labels preserve selection and disabled states on hover', async ({ palette, size }) => {
  render(Fixture, { palette, size });
  for (const name of ['Checkbox', 'Checked checkbox', 'Partial checkbox', 'Switch', 'Radio', 'Disabled checkbox', 'Disabled radio']) {
    await userEvent.hover(screen.getByRole('heading'));
    const input = screen.getByRole(name.includes('radio') || name === 'Radio' ? 'radio' : name === 'Switch' ? 'switch' : 'checkbox', { name }) as HTMLInputElement;
    const mark = input.nextElementSibling!;
    const before = appearance(mark);
    const selected = { checked: input.checked, indeterminate: input.indeterminate, text: mark.textContent };
    await userEvent.hover(input.closest('label')!);
    if (input.disabled) expect(appearance(mark)).toEqual(before);
    else expect(appearance(mark)).not.toEqual(before);
    expect({ checked: input.checked, indeterminate: input.indeterminate, text: mark.textContent }).toEqual(selected);
    await userEvent.unhover(input.closest('label')!);
  }
});

test('file surface responds to hover and preserves invalid frame', async () => {
  render(Fixture);
  for (const name of ['File', 'Invalid file']) {
    const input = screen.getByLabelText(name);
    const surface = input.nextElementSibling!;
    const before = appearance(surface);
    if (name === 'Invalid file') expect(before[2]).toBe(appearance(screen.getByLabelText('Invalid'))[2]);
    await userEvent.hover(input);
    expect(appearance(surface)[1]).not.toBe(before[1]);
    if (name === 'Invalid file') expect(appearance(surface)[2]).toBe(before[2]);
    await userEvent.unhover(input);
  }
});
