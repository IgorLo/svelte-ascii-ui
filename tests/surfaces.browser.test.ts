import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './SurfaceFixture.svelte';
afterEach(cleanup);
const color=(el:Element)=>getComputedStyle(el).backgroundColor;
for(const palette of ['phosphor','paper','plum'] as const) for(const size of ['s','m','l'] as const){
 test(`${palette}/${size} surfaces remain distinct and preserve interactive states`,async()=>{
  render(Fixture,{palette,size});
  const background=color(screen.getByLabelText('Page surface'));
  const input=screen.getByRole('textbox',{name:'Editable'});
  await userEvent.hover(screen.getByRole('textbox',{name:'Read only'}));
  for(const el of [input,screen.getByRole('textbox',{name:'Description'}),screen.getByRole('combobox')]){
   expect(color(el)).not.toBe(background);
   expect(getComputedStyle(el).backgroundClip).toBe('padding-box');
  }
  expect(color(input)).toBe(color(screen.getByRole('textbox',{name:'In panel'})));
  for(const track of screen.getAllByRole('progressbar'))expect(color(track)).not.toBe('rgba(0, 0, 0, 0)');
  const primary=screen.getByRole('button',{name:'Apply'});
  expect(color(primary)).not.toBe('rgba(0, 0, 0, 0)');
  expect(color(screen.getByRole('button',{name:'Cancel'}))).toBe('rgba(0, 0, 0, 0)');
  expect(screen.getByRole('button',{name:'Loading'})).toBeDisabled();
  const resting=color(input),bounds=input.getBoundingClientRect();
  await userEvent.hover(input);
  expect(color(input)).not.toBe(resting);
  const hovered=color(input);
  input.focus();
  expect(color(input)).not.toBe(resting);
  expect(color(input)).not.toBe(hovered);
  expect(input.getBoundingClientRect().height).toBe(bounds.height);
  const invalid=screen.getByRole('textbox',{name:'Invalid'}),frame=getComputedStyle(invalid).borderImageSource;
  await userEvent.hover(invalid);expect(getComputedStyle(invalid).borderImageSource).toBe(frame);
  const primaryRest=color(primary),primaryBounds=primary.getBoundingClientRect();
  await userEvent.hover(primary);
  expect(color(primary)).not.toBe(primaryRest);
  const primaryHover=color(primary);
  primary.focus();
  expect(color(primary)).not.toBe(primaryRest);
  expect(color(primary)).not.toBe(primaryHover);
  expect(primary.getBoundingClientRect().height).toBe(primaryBounds.height);
  const loading=screen.getByRole('button',{name:'Loading'}),loadingRest=color(loading);
  await userEvent.hover(loading);
  expect(color(loading)).toBe(loadingRest);
  const readonly=screen.getByRole('textbox',{name:'Read only'}),readonlyRest=color(readonly);
  await userEvent.hover(readonly);
  expect(color(readonly)).toBe(readonlyRest);
 });
}
