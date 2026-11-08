<script lang="ts">
  import { untrack } from 'svelte';
  import { formReset } from './form-reset';
  import type { HTMLFieldsetAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import type { Option } from './types';
  interface Props extends HTMLFieldsetAttributes { options: Option[]; label: string; size?: Size; value?: string; required?: boolean; }
  const uid = $props.id();
  let { options, label, size = 'm', value = $bindable(''), required, id = uid, name, form, class: className, ...attrs }: Props = $props();
  function reset(input: HTMLInputElement, option: string) {
    const initial = untrack(() => value);
    input.defaultChecked = option === initial;
    return formReset(input, () => { value = initial; });
  }
</script>

<fieldset {...attrs} {form} data-size={size} class={['group', className]}>
  <legend>{label}</legend>
  {#each options as option, i (option.value)}
    <label class="choice">
      <input {@attach (input) => reset(input, option.value)} id={i === 0 ? id : uid + '-' + i} {form} type="radio" name={name ?? uid} value={option.value} disabled={option.disabled} {required} bind:group={value} />
      <span class="mark" aria-hidden="true">{value === option.value ? '[x]' : '[ ]'}</span>
      <span>{option.label}</span>
    </label>
  {/each}
</fieldset>

<style>
  .group { border: 0; padding: 0; margin: 0; min-inline-size: 0; }
  legend { padding: 0; margin-block-end: .5rem; }
  .choice { position: relative; display: flex; align-items: center; gap: .65ch; min-height: var(--control-height, 48px); cursor: pointer; }
  input { position: absolute; opacity: 0; inset: 0; width: 100%; height: 100%; margin: 0; cursor: inherit; }
  .mark { font-family: var(--art-font); font-variant-east-asian: normal; white-space: pre; }
  input:checked + .mark { color: var(--accent); }
  input:focus-visible + .mark { outline: 2px dashed var(--accent); outline-offset: 3px; }
  .choice:has(input:disabled), fieldset:disabled .choice { color: var(--muted); cursor: not-allowed; }
  @media (pointer: coarse) { .choice { min-height: max(44px, var(--control-height)); } }
  @media (forced-colors: active) { input:focus-visible + .mark { outline-color: Highlight; } }
</style>
