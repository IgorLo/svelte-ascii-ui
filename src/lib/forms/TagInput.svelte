<script lang="ts">
  import { untrack } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import Button from '../Button.svelte';
  import { formReset } from './form-reset';
  interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'children'> {
    value?: string[];
    size?: Size;
    addLabel?: string;
    removeLabel?: string;
    duplicateText?: string;
    requiredText?: string;
  }
  let { value = $bindable<string[]>([]), size = 'm', addLabel = 'Add tag', removeLabel = 'Remove', duplicateText = 'This tag is already added.', requiredText = 'Add at least one tag.', name, form, disabled, readonly, required, class: className, onkeydown, oninput, ...attrs }: Props = $props();
  let draft = $state('');
  let message = $state('');
  let input: HTMLInputElement;
  const tags = $derived([...new Set(value)]);
  function add() {
    if (disabled || readonly) return;
    const tag = draft.trim();
    if (!tag) return;
    if (tags.includes(tag)) { message = duplicateText; return; }
    value = [...tags, tag];
    draft = ''; message = ''; input.focus();
  }
  function remove(tag: string) {
    value = tags.filter(item => item !== tag);
    message = ''; input.focus();
  }
  function reset(element: HTMLInputElement) {
    const initial = untrack(() => [...tags]);
    return formReset(element, () => { value = initial; draft = ''; message = ''; });
  }
</script>

<div class="tags" data-size={size}>
  {#if tags.length}
    <ul aria-label="Tags">
      {#each tags as tag (tag)}
        <li><span>{tag}</span><button type="button" disabled={disabled || readonly} aria-label={removeLabel + ' ' + tag} onclick={() => remove(tag)}>×</button></li>
      {/each}
    </ul>
  {/if}
  <div class="row">
    <input {...attrs} {@attach reset} {@attach (element) => element.setCustomValidity(required && !tags.length && !readonly ? requiredText : '')}
      type="text" {disabled} {readonly} {form} {@attach (element) => { input = element; }} bind:value={draft} aria-required={required}
      class={['aui-control', className]} oninput={(event) => { message = ''; if (typeof oninput === 'function') oninput(event); }}
      onkeydown={(event) => {
        if (typeof onkeydown === 'function') onkeydown(event);
        if (!event.defaultPrevented && !event.isComposing && event.key === 'Enter' && draft.trim() && !readonly) { event.preventDefault(); add(); }
      }} />
    <Button {size} label={addLabel} disabled={disabled || readonly || !draft.trim()} onclick={add} />
  </div>
  {#if message}<p role="status">{message}</p>{/if}
  {#if name}{#each tags as tag (tag)}<input type="hidden" {name} {form} value={tag} {disabled} />{/each}{/if}
</div>

<style>
  .tags { display: grid; gap: .5rem; }
  .row { display: flex; gap: .5rem; }
  .row input { flex: 1 1 0; min-width: 0; }
  ul { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0; padding: 0; }
  li { display: flex; align-items: center; gap: .5ch; padding-inline-start: .5ch; border: 1px dashed var(--muted); overflow-wrap: anywhere; }
  li button { min-width: 28px; min-height: 28px; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
  li button:focus-visible { outline: 2px dashed var(--accent); }
  p { color: var(--danger); margin: 0; font-size: .875em; }
  @media (pointer: coarse) { li button { min-width: 44px; min-height: 44px; } }
  @media (forced-colors: active) { li button:focus-visible { outline-color: Highlight; } }
</style>
