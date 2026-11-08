<script lang="ts">
  import { tick, untrack } from 'svelte';
  import type { PickerProps } from './types';
  import { formReset } from './form-reset';
  import Loader from '../Loader.svelte';
  import Button from '../Button.svelte';

  interface Props extends PickerProps { selected: string[]; onSelection: (next: string[]) => void; multiple?: boolean; }
  const uid = $props.id();
  let { selected, onSelection, multiple = false, options, size = 'm', disabled, readonly, required, id = uid, name, form, loading = false, error, onRetry, placeholder = 'Search options', listLabel = 'Options', emptyText = 'No matching options.', loadingText = 'Loading options…', retryLabel = 'Retry', removeLabel = 'Remove', requiredText = 'Choose an option.', class: className, 'aria-describedby': describedBy, 'aria-invalid': invalid, oninput, onfocus, onblur, onkeydown, onclick, ...attrs }: Props = $props();
  let draft = $state('');
  let editing = $state(false);
  let open = $state(false);
  let active = $state<string>();
  let input: HTMLInputElement;
  let popup: HTMLDivElement | undefined;
  const expanded = $derived(open && !disabled && !readonly);
  const display = $derived(editing ? draft : multiple ? '' : options.find(option => option.value === selected[0])?.label ?? selected[0] ?? '');
  const matches = $derived(loading || error ? [] : options.filter(option => !editing || option.label.toLocaleLowerCase().includes(draft.trim().toLocaleLowerCase())));
  const optionId = (value: string) => uid + '-option-' + encodeURIComponent(value);
  const current = $derived(matches.find(option => option.value === active && !option.disabled));

  function close() { open = false; active = undefined; editing = false; draft = ''; }
  function choose(value: string) {
    if (disabled || readonly || loading || error) return;
    if (multiple) {
      onSelection(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
      draft = ''; editing = false; active = undefined;
    } else { onSelection([value]); close(); }
  }
  function remove(value: string) {
    if (disabled || readonly || loading) return;
    onSelection(selected.filter(item => item !== value));
    input.focus();
  }
  function keydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (typeof onkeydown === 'function') onkeydown(event);
    if (event.defaultPrevented || event.isComposing || disabled || readonly) return;
    if (event.key === 'Escape' && expanded) { event.preventDefault(); close(); return; }
    if (event.key === 'Enter' && expanded) {
      event.preventDefault();
      if (current) choose(current.value);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    open = true;
    const available = matches.filter(option => !option.disabled);
    if (!available.length) return;
    const i = available.findIndex(option => option.value === active);
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    active = available[i === -1 ? (direction === 1 ? 0 : available.length - 1) : (i + direction + available.length) % available.length].value;
    void tick().then(() => popup?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }));
  }
  function reset(element: HTMLInputElement) {
    const initial = untrack(() => [...selected]);
    return formReset(element, () => { onSelection(initial); close(); });
  }
</script>

<div class="picker" data-size={size}>
  {#if multiple && selected.length}
    <ul class="chips" aria-label="Selected options">
      {#each selected as item (item)}
        {@const label = options.find(option => option.value === item)?.label ?? item}
        <li class="chip">
          <span>{label}</span>
          <button type="button" aria-label={removeLabel + ' ' + label} disabled={disabled || readonly || loading} onclick={() => remove(item)}>×</button>
        </li>
      {/each}
    </ul>
  {/if}
  <div class="shell">
    <input {...attrs} {@attach reset} {@attach (element) => element.setCustomValidity(required && !selected.length && !readonly ? requiredText : '')}
      {id} {form} {disabled} {readonly} {placeholder} {@attach (element) => { input = element; }} type="text" role="combobox" autocomplete="off"
      aria-autocomplete="list" aria-controls={expanded ? uid + '-list' : undefined} aria-expanded={expanded}
      aria-activedescendant={expanded && current ? optionId(current.value) : undefined} aria-required={required}
      aria-busy={loading} aria-invalid={error ? true : invalid}
      aria-describedby={[describedBy, error && !loading && uid + '-error'].filter(Boolean).join(' ') || undefined}
      class={['aui-control', className]} value={display}
      oninput={(event) => { draft = event.currentTarget.value; editing = true; active = undefined; open = true; if (typeof oninput === 'function') oninput(event); }}
      onfocus={(event) => { open = true; if (typeof onfocus === 'function') onfocus(event); }}
      onclick={(event) => { if (typeof onclick === 'function') onclick(event); if (!event.defaultPrevented) open = true; }}
      onblur={(event) => { close(); if (typeof onblur === 'function') onblur(event); }}
      onkeydown={keydown}
    />
    {#if loading}<span class="loader" aria-hidden="true"><Loader {size} /></span>{/if}
    {#if expanded}
      <div class="popup aui-frame" {@attach (element) => { popup = element; return () => { popup = undefined; }; }}>
        <div id={uid + '-list'} role="listbox" aria-label={listLabel} aria-multiselectable={multiple || undefined}>
          {#each matches as option (option.value)}
            <button type="button" role="option" tabindex="-1" id={optionId(option.value)} aria-selected={selected.includes(option.value)}
              disabled={option.disabled} data-active={active === option.value}
              onpointerdown={(event) => event.preventDefault()} onclick={() => choose(option.value)}>{option.label}</button>
          {/each}
        </div>
        {#if loading}<p role="status">{loadingText}</p>
        {:else if !error && !matches.length}<p role="status">{emptyText}</p>{/if}
      </div>
    {/if}
  </div>
  {#if loading && !expanded}<p class="status" role="status">{loadingText}</p>{/if}
  {#if error && !loading}
    <p class="error" role="status" id={uid + '-error'}>! {error}</p>
    {#if onRetry}<div><Button {size} label={retryLabel} {disabled} onclick={() => { input.focus(); onRetry?.(); }} /></div>{/if}
  {/if}
  {#if name}
    {#each selected as item (item)}<input type="hidden" {form} {name} value={item} {disabled} />{/each}
  {/if}
</div>

<style>
  .picker { display: grid; gap: .5rem; }
  .shell { position: relative; min-width: 0; }
  .shell:has(.loader) input { padding-inline-end: 4em; }
  .loader { position: absolute; top: 0; inset-inline-end: 1rem; height: 100%; display: grid; align-items: center; pointer-events: none; }
  .popup { position: absolute; z-index: 2; inset-inline: 0; top: 100%; background: var(--bg); padding: .25rem; max-height: 15rem; overflow: auto; }
  .popup button { display: block; width: 100%; border: 0; padding: .5em; min-height: var(--control-height); background: none; color: inherit; font: inherit; text-align: start; cursor: pointer; }
  .popup button[data-active='true'], .popup button:not(:disabled):hover { outline: 1px solid var(--accent); outline-offset: -1px; }
  .popup button[aria-selected='true'] { color: var(--accent); font-weight: bold; }
  .popup button:disabled { color: var(--muted); cursor: not-allowed; }
  p { margin: .25em; }
  .status { position: absolute; clip-path: inset(50%); width: 1px; height: 1px; overflow: hidden; }
  .error { color: var(--danger); font-size: .875em; }
  .chips { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0; padding: 0; }
  .chip { display: flex; align-items: center; gap: .5ch; padding-inline-start: .5ch; border: 1px dashed var(--muted); overflow-wrap: anywhere; }
  .chip button { min-width: 28px; min-height: 28px; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
  .chip button:focus-visible { outline: 2px dashed var(--accent); }
  @media (pointer: coarse) { .chip button { min-height: 44px; min-width: 44px; } .popup button { min-height: 44px; } }
  @media (forced-colors: active) { .chip button:focus-visible, .popup button[data-active='true'] { outline-color: Highlight; } }
</style>
