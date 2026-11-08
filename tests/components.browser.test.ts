import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { userEvent } from 'vitest/browser';
import { Button, Combobox, Range, Tabs, Dialog, Tooltip, FileInput } from '../src/lib';
import Editor from '../stories/EditorExample.svelte';
import FormContracts from '../stories/FormContracts.svelte';
import FormSubmission from '../stories/forms/FormSubmissionStory.svelte';
import '../src/lib/theme.css';

afterEach(cleanup);

test('loading and disabled buttons cannot invoke their action', async () => {
  const onclick = vi.fn();
  const view = render(Button, { label: 'Save', loading: true, onclick });
  const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  expect(button.getAttribute('aria-busy')).toBe('true');
  button.click();
  expect(onclick).not.toHaveBeenCalled();
  await view.rerender({ loading: false, disabled: true });
  button.click();
  expect(onclick).not.toHaveBeenCalled();
  await view.rerender({ disabled: false });
  await userEvent.click(button);
  expect(onclick).toHaveBeenCalledTimes(1);
  expect(button.type).toBe('button');
});

test('form defaults, clear and step actions preserve native input events and reset', async () => {
  render(FormContracts);
  expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
  expect((screen.getByLabelText('Password') as HTMLInputElement).value).toBe('secret');
  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
  expect(screen.getByLabelText('Input events').textContent).toBe('1');
  await userEvent.click(screen.getByRole('button', { name: 'Increase value' }));
  expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('3');
  expect(screen.getByLabelText('Input events').textContent).toBe('2');
  expect((screen.getByRole('button', { name: 'Remove Alpha' }) as HTMLButtonElement).disabled).toBe(true);
  await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  await expect.poll(() => (screen.getByRole('searchbox') as HTMLInputElement).value).toBe('ASCII');
  // value is current state; without defaultValue, native reset clears the number.
  expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('');
  await userEvent.click(screen.getByRole('button', { name: 'Increase value' }));
  expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('1');
});

test('composed controls submit named values through native FormData', async () => {
  render(FormSubmission);
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  const entries = JSON.parse(screen.getByRole('status').textContent!);
  expect(entries).toEqual([
    ['title', 'Example article'], ['native', 'draft'], ['radio', 'draft'],
    ['toggle', 'draft'], ['state', 'draft'], ['allowed', 'draft'], ['tag', 'ASCII'],
    ['from', '20'], ['to', '80'],
  ]);
});

test('combobox keyboard selection skips disabled options and Escape dismisses', async () => {
  render(Combobox, { 'aria-label': 'State', options: [
    { value: 'a', label: 'Alpha' }, { value: 'b', label: 'Blocked', disabled: true },
    { value: 'c', label: 'Charlie' },
  ] });
  const input = screen.getByRole('combobox');
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
  expect((input as HTMLInputElement).value).toBe('Charlie');
  expect(input.getAttribute('aria-expanded')).toBe('false');
  await userEvent.click(input);
  await userEvent.keyboard('{Escape}');
  expect(input.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(input);
});

test('range handles cannot cross when operated with the keyboard', async () => {
  render(Range, { lower: 20, upper: 80 });
  const lower = screen.getByRole('slider', { name: 'Lower value' }) as HTMLInputElement;
  const upper = screen.getByRole('slider', { name: 'Upper value' }) as HTMLInputElement;
  lower.focus();
  await userEvent.keyboard('{End}');
  expect(lower.value).toBe('80');
  upper.focus();
  await userEvent.keyboard('{Home}');
  expect(upper.value).toBe('80');
});

test('tabs skip disabled items, wrap and report selection', async () => {
  const onchange = vi.fn();
  render(Tabs, { items: [
    { id: 'one', label: 'One' }, { id: 'two', label: 'Two', disabled: true },
    { id: 'three', label: 'Three' },
  ], onchange });
  screen.getByRole('tab', { name: 'One' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Three' }));
  expect(onchange).toHaveBeenLastCalledWith('three');
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
});

test('modal dialog contains focus and restores its opener after Escape', async () => {
  const opener = document.createElement('button');
  document.body.append(opener);
  opener.focus();
  try {
    render(Dialog, { open: true, title: 'Confirm' });
    const dialog = screen.getByRole('dialog', { name: 'Confirm' }) as HTMLDialogElement;
    expect(dialog.matches(':modal')).toBe(true);
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(close);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => dialog.open).toBe(false);
    expect(document.activeElement).toBe(opener);
  } finally { opener.remove(); }
});

test('dialog can require explicit dismissal instead of Escape', async () => {
  render(Dialog, { open: true, title: 'Confirm', closeOnEscape: false });
  const dialog = screen.getByRole('dialog') as HTMLDialogElement;
  await userEvent.keyboard('{Escape}');
  expect(dialog.open).toBe(true);
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await expect.poll(() => dialog.open).toBe(false);
});

test('tooltip is available on keyboard focus and dismissed with Escape', async () => {
  render(Tooltip, { label: 'Help', text: 'Useful explanation' });
  const trigger = screen.getByRole('button', { name: 'Help' });
  trigger.focus();
  const tooltip = await screen.findByRole('tooltip');
  expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(tooltip.id);
  expect(tooltip.textContent).toBe('Useful explanation');
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test('file selection and clearing update the native input and return focus', async () => {
  render(FileInput, { 'aria-label': 'Attachment' });
  const input = screen.getByLabelText('Attachment') as HTMLInputElement;
  await userEvent.upload(input, new File(['hello'], 'notes.txt', { type: 'text/plain' }));
  expect(input.files?.[0]?.name).toBe('notes.txt');
  expect(screen.getByText('notes.txt')).toBeTruthy();
  await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(input.files?.length).toBe(0);
  expect(document.activeElement).toBe(input);
  await expect.poll(() => screen.queryByRole('button', { name: 'Clear selection' })).toBeNull();
});

test('combobox exposes loading and supports retry after a fetch error', async () => {
  const onRetry = vi.fn();
  const view = render(Combobox, { 'aria-label': 'State', options: [], loading: true });
  await userEvent.click(screen.getByRole('combobox'));
  expect(screen.queryByRole('option')).toBeNull();
  await view.rerender({ loading: false, error: 'Connection lost', onRetry, retryLabel: 'Try again' });
  expect(screen.getByRole('status').textContent).toContain('Connection lost');
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test('composed editor recovers from a failed save', async () => {
  render(Editor, { size: 's' });
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect((await screen.findByRole('alert')).textContent).toContain('Не удалось сохранить');
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(await screen.findByText('Сохранено')).toBeTruthy();
});
