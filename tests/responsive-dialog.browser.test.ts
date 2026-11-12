import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './fixtures/ResponsiveDialogFixture.svelte';

afterEach(async () => { cleanup(); await page.viewport(1280, 900); window.scrollTo(0, 0); });

for (const width of [390, 600]) {
  test(`one Dialog uses a bottom sheet at ${width}px with mobilePlacement=bottom`, async () => {
    await page.viewport(width, 844);
    render(Fixture);
    await userEvent.click(screen.getByRole('button', {name:'Open material'}));
    const dialog = screen.getByRole('dialog', {name:'Material details'});
    await expect.poll(() => dialog.getBoundingClientRect().bottom).toBe(844);
    expect(dialog.getBoundingClientRect().width).toBe(width);
    expect(dialog.getBoundingClientRect().height).toBeLessThan(844);
  });
}

test('resizing the open Dialog preserves its form, focus and native dialog instance', async () => {
  await page.viewport(1200, 900);
  render(Fixture);
  const opener = screen.getByRole('button', {name:'Open material'});
  await userEvent.click(opener);
  const dialog = screen.getByRole('dialog', {name:'Material details'});
  const input = screen.getByRole('textbox', {name:'Material note'});
  await userEvent.fill(input, 'Draft survives viewport changes');
  for (const [width, height] of [[390,844],[601,720],[1200,900]]) {
    await page.viewport(width, height);
    expect(screen.getAllByRole('dialog').length).toBe(1);
    expect(screen.getByRole('dialog')).toBe(dialog);
    expect(screen.getByRole('textbox', {name:'Material note'})).toBe(input);
    expect(input).toHaveValue('Draft survives viewport changes');
    expect(document.activeElement).toBe(input);
    if(width <= 600) await expect.poll(() => dialog.getBoundingClientRect().bottom).toBe(height);
    else {
      await expect.poll(() => dialog.getBoundingClientRect().top + dialog.getBoundingClientRect().height / 2).toBeCloseTo(height / 2, 0);
      expect(dialog.getBoundingClientRect().width).toBeLessThan(width);
    }
  }
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(opener);
});

test('mobile confirmation can keep its centered presentation', async () => {
  await page.viewport(390, 844);
  render(Fixture, {mobilePlacement:'center'});
  await userEvent.click(screen.getByRole('button', {name:'Open material'}));
  const box=screen.getByRole('dialog').getBoundingClientRect();
  expect(box.top).toBeGreaterThan(0);
  expect(box.bottom).toBeLessThan(844);
  expect(box.top + box.height / 2).toBeCloseTo(422,0);
});

test('long responsive Dialog keeps framed fields and actions visible when height shrinks', async () => {
  await page.viewport(390, 844);
  render(Fixture, {long:true});
  await userEvent.click(screen.getByRole('button', {name:'Open material'}));
  for(const height of [844,440]) {
    await page.viewport(390,height);
    const dialog=screen.getByRole('dialog');
    await expect.poll(() => dialog.getBoundingClientRect().bottom).toBe(height);
    await expect.poll(() => dialog.getBoundingClientRect().height).toBeLessThanOrEqual(height);
    const input=screen.getByRole('textbox', {name:'Material note'});
    await userEvent.fill(input,'Still visible');
    const done=screen.getByRole('button', {name:'Done'});
    await expect.poll(() => input.getBoundingClientRect().bottom - done.parentElement!.getBoundingClientRect().top).toBeLessThanOrEqual(0);
    expect(screen.getByRole('button',{name:'Close'}).getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
    expect(done.getBoundingClientRect().bottom).toBeLessThanOrEqual(height);
  }
});

test('mobile sheet keeps modal focus and locks background until dismissal', async () => {
  await page.viewport(390,844);
  render(Fixture);
  await userEvent.click(screen.getByRole('button', {name:'Open material'}));
  const close=screen.getByRole('button',{name:'Close'}), done=screen.getByRole('button',{name:'Done'});
  close.focus();
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}'); expect(document.activeElement).toBe(done);
  await userEvent.keyboard('{Tab}'); expect(document.activeElement).toBe(close);
  window.scrollTo(0,0);
  await userEvent.wheel(close,{delta:{y:300}});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  expect(window.scrollY).toBe(0);
  await userEvent.keyboard('{Escape}');
  await expect.poll(()=>screen.queryByRole('dialog')).toBeNull();
  await userEvent.wheel(screen.getByRole('button',{name:'Open material'}),{delta:{y:300}});
  await expect.poll(()=>window.scrollY).toBeGreaterThan(0);
});

test('long Dialog reveals the focused framed field across both responsive presentations', async () => {
  await page.viewport(390,844);
  render(Fixture,{long:true});
  await userEvent.click(screen.getByRole('button',{name:'Open material'}));
  const input=screen.getByRole('textbox',{name:'Material note'});
  await userEvent.fill(input,'Editing continues through rotation');
  for(const [width,height] of [[601,420],[390,440],[1024,450],[390,844]]) {
    await page.viewport(width,height);
    expect(document.activeElement).toBe(input);
    expect(input).toHaveValue('Editing continues through rotation');
    const footer=screen.getByRole('button',{name:'Done'}).parentElement!;
    // Native scroll offsets can round to a device pixel at fractional layout positions.
    await expect.poll(()=>input.getBoundingClientRect().bottom - footer.getBoundingClientRect().top).toBeLessThanOrEqual(1);
    expect(input.getBoundingClientRect().top).toBeGreaterThan(screen.getByRole('heading',{name:'Material details'}).getBoundingClientRect().bottom);
  }
});
