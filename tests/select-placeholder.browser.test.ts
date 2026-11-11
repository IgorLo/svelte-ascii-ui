import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { userEvent } from 'vitest/browser';
import { Select } from '../src/lib';
import Fixture from './SelectPlaceholderFixture.svelte';

afterEach(cleanup);
const options = [
  { value: 'author', label: 'By popularity' },
  { value: 'date', label: 'By date' },
];
const select = () => screen.getByRole('combobox') as HTMLSelectElement;

test.each(['s', 'm', 'l'] as const)('%s Select can contain exactly its supplied choices', size => {
  render(Select, { options, size, value: 'author', showPlaceholder: false, 'aria-label': 'Sort order' });
  expect(Array.from(select().options, option => [option.value, option.label])).toEqual([
    ['author', 'By popularity'], ['date', 'By date'],
  ]);
  expect(select().value).toBe('author');
  expect(select().selectedOptions[0].text).toBe('By popularity');
});

test('Select keeps its optional empty choice by default', async () => {
  render(Fixture, { initialValue: '' });
  expect(select().value).toBe('');
  expect(select().options.length).toBe(3);
  expect(select().options[0].label).toBe('Choose an option');
  await userEvent.selectOptions(select(), 'date');
  expect(screen.getByLabelText('Bound sort').textContent).toBe('date');
  await userEvent.selectOptions(select(), '');
  expect(screen.getByLabelText('Bound sort').textContent).toBe('');
  expect(select().checkValidity()).toBe(true);
});

test('required validates the chosen value independently of placeholder visibility', async () => {
  const view = render(Fixture, { showPlaceholder: true, initialValue: '', required: true });
  expect(select().checkValidity()).toBe(false);
  expect(select().validity.valueMissing).toBe(true);
  await userEvent.selectOptions(select(), 'author');
  expect(select().checkValidity()).toBe(true);
  await view.rerender({ showPlaceholder: false });
  expect(select().options.length).toBe(2);
  expect(select().checkValidity()).toBe(true);
});

test.each([true, false])('Select synchronizes bound changes and form reset with showPlaceholder=%s', async showPlaceholder => {
  render(Fixture, { showPlaceholder });
  await userEvent.click(screen.getByRole('button', { name: 'Set date' }));
  expect(select().value).toBe('date');
  expect(select().selectedOptions[0].text).toBe('By date');
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('sort')).toBe('date');
  await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  await expect.poll(() => select().value).toBe('author');
  await expect.poll(() => screen.getByLabelText('Bound sort').textContent).toBe('author');
  select().focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.poll(() => select().value).toBe('date');
  expect(screen.getByLabelText('Bound sort').textContent).toBe('date');
});

test.each(['', 'missing'])('Select without a placeholder leaves unmatched initial value %j unselected', async initialValue => {
  render(Fixture, { initialValue, showPlaceholder: false, required: true });
  expect(select().options.length).toBe(2);
  expect(select().selectedIndex).toBe(-1);
  expect(select().value).toBe('');
  expect(select().checkValidity()).toBe(false);
  expect(screen.getByLabelText('Bound sort').textContent).toBe(initialValue);
  await userEvent.selectOptions(select(), 'date');
  expect(screen.getByLabelText('Bound sort').textContent).toBe('date');
  expect(select().checkValidity()).toBe(true);
});

test('Select without a placeholder preserves disabled options, loading and errors', async () => {
  const view = render(Select, {
    options: [...options, { value: 'blocked', label: 'Unavailable', disabled: true }],
    value: 'author', showPlaceholder: false, loading: true, error: 'Could not load options',
    'aria-label': 'Sort order',
  });
  expect(select().options.length).toBe(3);
  expect(select().options[2].disabled).toBe(true);
  expect(select().disabled).toBe(true);
  expect(select().getAttribute('aria-busy')).toBe('true');
  expect(screen.getByRole('status').textContent).toBe('Loading options…');
  await view.rerender({ loading: false });
  expect(select().disabled).toBe(false);
  expect(select().getAttribute('aria-invalid')).toBe('true');
  expect(document.getElementById(select().getAttribute('aria-describedby')!)?.textContent).toContain('Could not load options');
  await view.rerender({ disabled: true });
  expect(select().disabled).toBe(true);
});

test('native reset selects the first enabled option when the initial value has no match', async () => {
  render(Fixture, { initialValue: 'missing', showPlaceholder: false, required: true });
  expect(select().selectedIndex).toBe(-1);
  await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  await expect.poll(() => select().value).toBe('author');
  await expect.poll(() => screen.getByLabelText('Bound sort').textContent).toBe('author');
  expect(select().checkValidity()).toBe(true);
});
