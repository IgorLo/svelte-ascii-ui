<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import Button from '../Button.svelte';
  import Loader from '../Loader.svelte';
  interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'files' | 'children'> {
    size?: Size;
    files?: FileList;
    chooseLabel?: string;
    emptyText?: string;
    clearLabel?: string;
    loading?: boolean;
    loadingText?: string;
    error?: string;
  }
  const uid = $props.id();
  let { size = 'm', files = $bindable<FileList>(), disabled, chooseLabel = 'Choose file', emptyText = 'No file selected', clearLabel = 'Clear selection', loading = false, loadingText = 'Checking files…', error, class: className, 'aria-invalid': invalid, 'aria-describedby': describedBy, 'aria-label': accessibleLabel, ...attrs }: Props = $props();
  let input: HTMLInputElement;
  const names = $derived(Array.from(files ?? [], file => file.name).join(', '));
  function clear() {
    // A fresh FileList also invalidates derived names; clearing input.value
    // mutates the existing FileList without notifying reactive consumers.
    files = new DataTransfer().files;
    input.focus();
  }
</script>

<div class="file" data-size={size}>
  <div class="row">
    <div class="target">
      <input {...attrs} {@attach (element) => { input = element; }} bind:files type="file" disabled={disabled || loading} aria-busy={loading}
        aria-label={accessibleLabel} aria-invalid={error ? true : invalid}
        aria-describedby={[describedBy, error && uid + '-error'].filter(Boolean).join(' ') || undefined} class={className} />
      <div class="surface aui-control" data-invalid={Boolean(error)} aria-hidden="true">
        {#if loading}<Loader {size} />{:else}<span>{chooseLabel}</span>{/if}
        <span class="names">{names || emptyText}</span>
      </div>
    </div>
    {#if names}<Button {size} label={clearLabel} disabled={disabled || loading} onclick={clear} />{/if}
  </div>
  {#if loading}<div class="note" role="status">{loadingText}</div>{/if}
  {#if error}<div class="note error" id={uid + '-error'}>! {error}</div>{/if}
</div>

<style>
  .file { display: grid; gap: .5rem; }
  .row { display: flex; gap: .5rem; flex-wrap: wrap; }
  .target { position: relative; flex: 1 1 13rem; min-width: 0; }
  input { position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
  .surface { display: flex; flex-wrap: wrap; align-items: center; gap: .35em 1em; height: 100%; overflow-wrap: anywhere; }
  .surface[data-invalid='true'] { border-image-source: var(--ascii-error); }
  input:disabled { cursor: not-allowed; }
  input:disabled + .surface { opacity: .55; }
  input:focus-visible + .surface { outline: 2px dashed var(--accent); outline-offset: 2px; border-image-source: var(--ascii-focus); }
  .names, .note { color: var(--muted); }
  .note { font-size: .875em; }
  .error { color: var(--danger); }
  @media (forced-colors: active) { input:focus-visible + .surface { outline-color: Highlight; } }
</style>
