<script lang="ts">
  import type { Size } from '../types';
  import type { HTMLInputAttributes } from 'svelte/elements';
  type Base = Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'children' | 'defaultValue'>;
  import Button from '../Button.svelte';
  interface Props extends Base { value?: string; defaultValue?: string; size?: Size; clearLabel?: string; }
  const uid = $props.id();
  let { defaultValue, value = $bindable(defaultValue ?? ''), size = 'm', id = uid, disabled, readonly, class: className, clearLabel = 'Clear search', ...attrs }: Props = $props();
  let input: HTMLInputElement;
</script>

<div class="inline" data-size={size}>
  <input {...attrs} {defaultValue} {id} type="search" {@attach (element) => { input = element; }} bind:value {disabled} {readonly} class={['aui-control', className]} />
  <Button {size} label={clearLabel} aria-controls={id} disabled={disabled || readonly || !value} onclick={() => { input.value = ''; input.dispatchEvent(new Event('input', {bubbles:true})); input.dispatchEvent(new Event('change', {bubbles:true})); input.focus(); }} />
</div>

<style>
  .inline { display: flex; align-items: stretch; gap: .5rem; }
  input { min-width: 0; flex: 1 1 0; }
  input::-webkit-search-cancel-button { appearance: none; }
</style>
