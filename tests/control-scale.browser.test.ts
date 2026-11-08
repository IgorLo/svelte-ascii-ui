import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import Fixture from './ControlScaleFixture.svelte';
import { page } from 'vitest/browser';
afterEach(cleanup);

for (const width of [1200,390]) {
for (const [size, height, font] of [['s',32,13],['m',39,13],['l',48,15]] as const) {
  test(`${size} public controls share the approved scale and square icon actions at ${width}px`, async () => {
    await page.viewport(width,900);
    render(Fixture,{size});
    await document.fonts.ready;
    const input = screen.getByRole('textbox',{name:'Title'});
    const select = screen.getByRole('combobox',{name:'Collection'});
    const number = screen.getByRole('spinbutton',{name:'Quantity'});
    const fieldHeight = input.getBoundingClientRect().height;
    expect(fieldHeight).toBeGreaterThanOrEqual(height);
    expect(select.getBoundingClientRect().height).toBeCloseTo(fieldHeight,0);
    expect(number.getBoundingClientRect().height).toBeCloseTo(fieldHeight,0);
    expect(getComputedStyle(input).fontSize).toBe(innerWidth > 760 ? `${font}px` : '16px');
    for (const name of ['Increase value','Decrease value','Close']) {
      const button = screen.getByRole('button',{name});
      const box = button.getBoundingClientRect();
      expect(box.width).toBeCloseTo(box.height,1);
      expect(box.height).toBeGreaterThanOrEqual(height);
      if (name !== 'Close') expect(box.height).toBeCloseTo(fieldHeight,0);
      const icon = button.querySelector('svg');
      expect(icon).not.toBeNull();
      if (icon) {
        const rect=icon.getBoundingClientRect();
        expect(Math.abs(rect.x+rect.width/2-box.x-box.width/2)).toBeLessThan(.6);
        expect(Math.abs(rect.y+rect.height/2-box.y-box.height/2)).toBeLessThan(.6);
      }
    }
    expect(getComputedStyle(input).fontWeight).toBe('300');
    expect(getComputedStyle(screen.getByText('Ready',{exact:false})).fontSize).toBe(`${font}px`);
    expect(getComputedStyle(screen.getByRole('heading',{name:'Control scale'})).fontWeight).toBe('600');
    const loading=screen.getByRole('combobox',{name:'Loading collection'});
    expect(loading).toBeDisabled();
    expect(loading).toHaveAttribute('aria-busy','true');
    const trailing=loading.parentElement!.querySelector('[aria-hidden="true"]')!;
    const box=loading.getBoundingClientRect(), area=trailing.getBoundingClientRect();
    expect(Math.abs(area.y+area.height/2-box.y-box.height/2)).toBeLessThan(.6);
    expect(area.width).toBeCloseTo(box.height,0);
    if (matchMedia('(pointer: coarse)').matches) {
      for(const button of screen.getAllByRole('button'))
        expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
      for(const control of [input,select,number,screen.getByRole('button',{name:'Close'})])
        expect(control.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  });
}
}
