<script lang="ts">
  import type { Size } from '../types';
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'children'> {
    size?: Size;
    label?: string;
    children?: Snippet;
  }
  let { size = 'm', label, children, defaultChecked, checked = $bindable(defaultChecked ?? false), indeterminate = $bindable(false), class: className, ...attrs }: Props = $props();
</script>

<label class="choice" data-size={size}>
  <input {...attrs} {defaultChecked} type="checkbox" bind:indeterminate bind:checked class={className} />
  <span class="mark aui-control" aria-hidden="true">{indeterminate ? '−' : checked ? 'x' : ''}</span>
  {#if children}{@render children()}{:else if label}<span>{label}</span>{/if}
</label>

<style>
  .choice { position: relative; display: inline-flex; align-items: center; gap: .65ch; min-height: var(--control-height, 48px); cursor: pointer; }
  input { position: absolute; opacity: 0; inset: 0; width: 100%; height: 100%; margin: 0; cursor: inherit; }
  .mark { display: grid; place-content: center; min-height: var(--choice-box); width: var(--choice-box); height: var(--choice-box); padding: 0; font-family: var(--art-font); font-variant-east-asian: normal; }
  input:checked + .mark, input:indeterminate + .mark { color: var(--accent); }
  input:focus-visible + .mark { outline: 2px dashed var(--accent); outline-offset: 3px; }
  .choice:has(input:disabled) { color: var(--muted); cursor: not-allowed; }
  input:disabled + .mark { opacity: .55; }
  @media (pointer: coarse) { .choice { min-height: max(44px, var(--control-height)); } }
  @media (forced-colors: active) { input:focus-visible + .mark { outline-color: Highlight; } }
</style>
