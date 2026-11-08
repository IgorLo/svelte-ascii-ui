<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import type { Mark } from './types';
  import ScaleMarks from './ScaleMarks.svelte';
  import { align, marksFor, ratio } from './scale';
  import { formReset } from './form-reset';
  import { untrack } from 'svelte';

  interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max' | 'step'> {
    value?: number;
    min?: number;
    max?: number;
    step?: number | 'any';
    size?: Size;
    marks?: boolean | Mark[];
  }

  let { value = $bindable(50), size = 'm', min = 0, max = 100, step = 1, marks = false, class: className, oninput, ...attrs }: Props = $props();
  const end = $derived(Math.max(min, max));
  const current = $derived(align(value, min, end, step));
  const position = $derived(ratio(current, min, end));
  const cells = Array.from({ length: 41 }, (_, i) => i);
  function reset(input: HTMLInputElement) {
    const initial = untrack(() => current);
    input.defaultValue = String(initial);
    return formReset(input, () => { value = initial; });
  }
</script>

<div class={['scale', className]} data-size={size} dir="ltr">
  <div class="track">
    <div class="drawing" aria-hidden="true">
      <span class="start">├</span><span class="end">┤</span>
      <div class="dashes">{#each cells as cell (cell)}<span class={{ chosen: cell / 40 <= position }}>-</span>{/each}</div>
      <span class="handle" style:left={`calc(26px + (100% - 52px) * ${position})`}>[◆]</span>
    </div>
    <input {...attrs} {@attach reset} type="range" {min} max={end} {step} value={current}
      oninput={(event) => { value = event.currentTarget.valueAsNumber; if (typeof oninput === 'function') oninput(event); }} />
  </div>
  <ScaleMarks marks={marksFor(marks, min, end)} {min} max={end} />
</div>

<style>
  .scale { --scale-height: 27px; min-width: 0; }
  .scale[data-size='s'] { --scale-height: 24px; }
  .scale[data-size='l'] { --scale-height: 30px; }
  .track { position: relative; height: var(--scale-height); margin-block: 6px; }
  .drawing { position: absolute; inset: 0; color: var(--muted); font: 16px/20px var(--art-font); font-variant-east-asian: normal; pointer-events: none; }
  .start, .end, .handle { position: absolute; top: 50%; transform: translateY(-50%); }
  .start { left: 10px; } .end { right: 10px; }
  .dashes { position: absolute; inset: 0 26px; display: flex; justify-content: space-between; align-items: center; overflow: hidden; }
  .dashes span { min-width: 0; }
  .dashes .chosen, .handle { color: var(--accent); font-weight: 700; }
  .handle { width: 32px; transform: translate(-50%,-50%); text-align: center; background: var(--bg); white-space: nowrap; }
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
  @media (forced-colors: active) { .track:has(input:focus-visible) { outline-color: Highlight; } .dashes .chosen, .handle { color: Highlight; } }
</style>
