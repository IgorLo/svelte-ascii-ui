<script lang="ts">
  import { untrack } from 'svelte';
  import type { HTMLFieldsetAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import type { Option } from './types';
  import { formReset } from './form-reset';
  interface Props extends HTMLFieldsetAttributes { options: Option[]; label: string; size?: Size; value?: string | string[]; multiple?: boolean; required?: boolean; }
  const uid = $props.id();
  let { options, label, size = 'm', value = $bindable<string | string[]>(''), multiple = false, required, name, form, class: className, ...attrs }: Props = $props();
  const selected = $derived(Array.isArray(value) ? value : value ? [value] : []);
  function change(option: string, checked: boolean) {
    if (!multiple) value = option;
    else value = checked ? [...selected, option] : selected.filter(item => item !== option);
  }
  function reset(input: HTMLInputElement, option: string) {
    const initial = untrack(() => Array.isArray(value) ? [...value] : value);
    input.defaultChecked = Array.isArray(initial) ? initial.includes(option) : initial === option;
    return formReset(input, () => { value = initial; });
  }
</script>

<fieldset {...attrs} {form} data-size={size} class={['group', className]}>
  <legend>{label}</legend>
  <div class="toggles">
    {#each options as option (option.value)}
      <label class="aui-button" data-size={size} data-variant={selected.includes(option.value) ? 'primary' : 'default'}>
        <input {@attach (input) => reset(input, option.value)} {@attach (input) => input.setCustomValidity(multiple && required && !options.some(item => !item.disabled && selected.includes(item.value)) && options.find(item => !item.disabled)?.value === option.value ? "Choose at least one option." : "")} {form} type={multiple ? 'checkbox' : 'radio'} name={name ?? uid} value={option.value} disabled={option.disabled} required={required && !multiple} checked={selected.includes(option.value)} onchange={(event) => change(option.value, event.currentTarget.checked)} />
        <span aria-hidden="true">{selected.includes(option.value) ? '[x]' : '[ ]'}</span> {option.label}
      </label>
    {/each}
  </div>
</fieldset>

<style>
  .group { border: 0; padding: 0; margin: 0; min-inline-size: 0; }
  legend { padding: 0; margin-block-end: .5rem; }
  .toggles { display: flex; flex-wrap: wrap; gap: .5rem; }
  label { position: relative; display: inline-flex; align-items: center; }
  label:has(input:focus-visible) { outline: 2px dashed var(--accent); outline-offset: 2px; }
  label:has(input:disabled), fieldset:disabled label { opacity: .65; cursor: not-allowed; }
  input { opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; cursor: inherit; }
  @media (forced-colors: active) { label:has(input:focus-visible) { outline-color: Highlight; } }
</style>
