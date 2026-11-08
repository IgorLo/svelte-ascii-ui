<script lang="ts">
  import { untrack } from 'svelte';
  import type { Size } from '../types';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { Option } from './types';
  import Loader from '../Loader.svelte';
  import Icon from '../Icon.svelte';
  interface Props extends Omit<HTMLSelectAttributes, 'size' | 'value' | 'multiple'> {
    value?: string;
    size?: Size;
    options: Option[];
    placeholder?: string;
    loading?: boolean;
    loadingText?: string;
    error?: string;
  }
  const uid = $props.id();
  let { value = $bindable(''), size = 'm', options, placeholder = 'Choose an option', disabled, loading, loadingText = 'Loading options…', error, class: className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...attrs }: Props = $props();
  const initial = untrack(() => value);
</script>

<div class="select" data-size={size}>
  <div class="target">
    <select {...attrs} bind:value disabled={disabled || loading} aria-busy={loading} aria-invalid={error ? true : invalid} aria-describedby={[describedBy, error && !loading && uid + '-error'].filter(Boolean).join(' ') || undefined} class={['aui-control', className]}>
    <option value="" selected={!initial}>{placeholder}</option>
    {#each options as option (option.value)}
      <option value={option.value} disabled={option.disabled} selected={initial === option.value}>{option.label}</option>
    {/each}
    </select>
    <span class="chevron" aria-hidden="true">{#if loading}<Loader {size} />{:else}<Icon name="chevron-down" />{/if}</span>
  </div>
  {#if loading}<span class="status" role="status">{loadingText}</span>
  {:else if error}<span id={uid + '-error'} class="error">! {error}</span>{/if}
</div>

<style>
  .select { position: relative; display: grid; gap: .5rem; }
  .target { position: relative; }
  select { width: 100%; appearance: none; padding-inline-end: calc(var(--field-height,var(--control-height)) - var(--control-frame) + .75ch); }
  .chevron { position: absolute; inset-inline-end: 0; inset-block: 0; inline-size: var(--field-height,var(--control-height)); display: grid; place-items: center; pointer-events: none; }
  @media (forced-colors: active) { select { appearance: auto; } .chevron { display: none; } }
  .status { position: absolute; clip-path: inset(50%); width: 1px; height: 1px; overflow: hidden; }
  .error { color: var(--danger); font-size: .875em; }
</style>
