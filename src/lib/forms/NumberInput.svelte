<script lang="ts">
  import type { Size } from '../types';
  import type { HTMLInputAttributes } from 'svelte/elements';
  type Base = Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'children'>;
  import Button from '../Button.svelte';
  interface Props extends Omit<Base, 'min' | 'max' | 'step'> {
    value?: number;
    size?: Size;
    min?: number;
    max?: number;
    step?: number | 'any';
    incrementLabel?: string;
    decrementLabel?: string;
  }
  let { value = $bindable<number | undefined>(), size = 'm', min, max, step = 1, disabled, readonly, incrementLabel = 'Increase value', decrementLabel = 'Decrease value', class: className, ...attrs }: Props = $props();
  let input: HTMLInputElement;
  function adjust(direction: -1 | 1) {
    if (step === 'any') input.value = String(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, (value ?? 0) + direction)));
    else {
      if (direction === 1) input.stepUp();
      else input.stepDown();

    }
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.dispatchEvent(new Event('change', {bubbles:true}));
  }
</script>

<div class="inline" data-size={size}>
  <Button {size} label="−" aria-label={decrementLabel} disabled={disabled || readonly || (min !== undefined && value !== undefined && value <= min)} onclick={() => adjust(-1)} />
  <input {...attrs} type="number" {@attach (element) => { input = element; }} bind:value {min} {max} {step} {disabled} {readonly} class={['aui-control', className]} />
  <Button {size} label="+" aria-label={incrementLabel} disabled={disabled || readonly || (max !== undefined && value !== undefined && value >= max)} onclick={() => adjust(1)} />
</div>

<style>
  .inline { display: flex; align-items: stretch; gap: .5rem; }
  input { min-width: 0; flex: 1 1 0; appearance: textfield; }
  input::-webkit-inner-spin-button, input::-webkit-outer-spin-button { appearance: none; margin: 0; }
</style>
