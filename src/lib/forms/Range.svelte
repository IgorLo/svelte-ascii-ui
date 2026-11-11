<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import type { Mark } from './types';
  import ScaleMarks from './ScaleMarks.svelte';
  import ScaleTrack from './ScaleTrack.svelte';
  import { align, marksFor, ratio } from './scale';
  import { formReset } from './form-reset';
  import { untrack } from 'svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    lower?: number;
    upper?: number;
    min?: number;
    max?: number;
    step?: number | 'any';
    size?: Size;
    marks?: boolean | Mark[];
    name?: string;
    lowerName?: string;
    upperName?: string;
    label?: string;
    lowerLabel?: string;
    upperLabel?: string;
    form?: string;
    disabled?: boolean;
  }

  let { lower = $bindable(20), upper = $bindable(80), size = 'm', min = 0, max = 100, step = 1, marks = false, name, lowerName, upperName, label = 'Range', lowerLabel = 'Lower value', upperLabel = 'Upper value', form, disabled, class: className, 'aria-label': accessibleLabel, 'aria-describedby': describedBy, ...attrs }: Props = $props();
  const end = $derived(Math.max(min, max));
  const left = $derived(align(lower, min, end, step));
  const right = $derived(Math.max(left, align(upper, min, end, step)));
  const leftPosition = $derived(ratio(left, min, end));
  const rightPosition = $derived(ratio(right, min, end));
  function update(input: HTMLInputElement, edge: 'lower' | 'upper') {
    if (edge === 'lower') { lower = Math.min(right, input.valueAsNumber); input.value = String(lower); }
    else { upper = Math.max(left, input.valueAsNumber); input.value = String(upper); }
  }
  function reset(input: HTMLInputElement, edge: 'lower' | 'upper') {
    const initial = untrack(() => edge === 'lower' ? left : right);
    input.defaultValue = String(initial);
    return formReset(input, () => {
      if (edge === 'lower') lower = initial; else upper = initial;
    });
  }
</script>

<div {...attrs} class={['scale', className]} data-size={size} dir="ltr" role="group" aria-label={accessibleLabel ?? label} aria-describedby={describedBy}>
  <div class="track" style:--split={(leftPosition + rightPosition) / 2}>
    <div class="drawing" aria-hidden="true">
      <ScaleTrack start={leftPosition} end={rightPosition} />
      <span class="handle lower-handle" style:left={`calc(26px + (100% - 52px) * ${leftPosition})`}>[‹]</span>
      <span class="handle upper-handle" style:left={`calc(26px + (100% - 52px) * ${rightPosition})`}>[›]</span>
    </div>
    <input class="lower" {@attach (input) => reset(input, 'lower')} type="range" name={lowerName ?? name} {form} {disabled} {min} max={end} {step} value={left}
      aria-label={lowerLabel} aria-describedby={describedBy} aria-valuemax={right} oninput={(event) => update(event.currentTarget, 'lower')} />
    <input class="upper" {@attach (input) => reset(input, 'upper')} type="range" name={upperName ?? name} {form} {disabled} {min} max={end} {step} value={right}
      aria-label={upperLabel} aria-describedby={describedBy} aria-valuemin={left} oninput={(event) => update(event.currentTarget, 'upper')} />
  </div>
  <ScaleMarks marks={marksFor(marks, min, end)} {min} max={end} />
</div>

<style>
  .scale { --scale-height: 27px; min-width: 0; }
  .scale[data-size='s'] { --scale-height: 24px; }
  .scale[data-size='l'] { --scale-height: 30px; }
  .track { position: relative; height: var(--scale-height); margin-block: 6px; }
  .drawing { position: absolute; inset: 0; color: var(--muted); font: 16px/20px var(--art-font); font-variant-east-asian: normal; pointer-events: none; }
  .handle { position: absolute; top: 50%; width: 32px; transform: translate(-50%,-50%); color: var(--accent); font-weight: 700; text-align: center; background: var(--bg); white-space: nowrap; }
  [data-size='s'] .handle { font-size: 14px; }
  input { position: absolute; inset: 0 16px; width: calc(100% - 32px); height: 100%; margin: 0; padding: 0; border: 0; appearance: none; opacity: 0; touch-action: pan-y; cursor: pointer; }
  input::-webkit-slider-runnable-track { height: 100%; background: transparent; }
  input::-webkit-slider-thumb { appearance: none; width: 20px; height: var(--scale-height); }
  input::-moz-range-track { height: 100%; background: transparent; }
  input::-moz-range-thumb { width: 20px; height: var(--scale-height); border: 0; }
  .track:has(input:disabled) { opacity: .55; }
  input:disabled { cursor: not-allowed; }
  .track:has(input:focus-visible) { outline: 2px dashed var(--accent); outline-offset: 2px; }
  @media (pointer: coarse) { .scale, .scale[data-size] { --scale-height: 44px; } }
  @media (forced-colors: active) { .track:has(input:focus-visible) { outline-color: Highlight; } .handle { color: Highlight; } }
  .lower { clip-path: inset(0 calc(100% - (10px + (100% - 20px) * var(--split))) 0 0); }
  .upper { clip-path: inset(0 0 0 calc(10px + (100% - 20px) * var(--split))); }
  .track:has(.lower:focus-visible) .lower-handle, .track:has(.upper:focus-visible) .upper-handle { z-index: 1; color: var(--text); }
</style>
