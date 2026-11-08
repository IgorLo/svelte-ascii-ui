<script lang="ts">
  import type { Size } from '../types';
  import type { MenuItem } from './types';
  import { positionFloating, showFloating, type Origin } from './position';
  import './floating.css';

  let { id, label, items, origin, owner, dismiss, size, emptyLabel, focusLast = false, onselect }: {
    id: string; label: string; items: readonly MenuItem[]; origin: () => Origin; owner: HTMLElement;
    dismiss: (restore: boolean) => void; size: Size; emptyLabel: string; focusLast?: boolean;
    onselect?: (item: MenuItem) => void;
  } = $props();

  let panel: HTMLDivElement;
  let active = $state('');
  const enabled = $derived(items.filter(item => !item.disabled));
  const current = $derived(enabled.some(item => item.id === active) ? active : (focusLast ? enabled.at(-1) : enabled[0])?.id);

  function position() { if (panel) positionFloating(panel, origin()); }
  function focusItem(id: string | undefined) {
    if (!id) { panel.focus({ preventScroll: true }); return; }
    active = id;
    const node = [...panel.querySelectorAll<HTMLButtonElement>('button')].find(button => button.dataset.id === id);
    node?.focus();
  }

  $effect(() => {
    showFloating(panel);
    position();
  });

  function mountFocus(node: HTMLDivElement) {
    queueMicrotask(() => { if (node.isConnected) focusItem(current); });
  }

  function navigate(event: KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(true); return; }
    if (event.key === 'Tab') { dismiss(true); return; }
    if (!enabled.length) return;
    const index = enabled.findIndex(item => item.id === current);
    let next: MenuItem | undefined;
    if (event.key === 'ArrowDown') next = enabled[(index + 1) % enabled.length];
    else if (event.key === 'ArrowUp') next = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === 'Home') next = enabled[0];
    else if (event.key === 'End') next = enabled.at(-1);
    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const following = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)];
      next = following.find(item => item.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
    }
    if (next) { event.preventDefault(); focusItem(next.id); }
  }
</script>

<svelte:window onresize={position} onscrollcapture={position} />
<svelte:document onpointerdown={(event) => {
  const path = event.composedPath();
  if (!path.includes(panel) && !path.includes(owner)) dismiss(panel.contains(panel.ownerDocument.activeElement));
}} onfocusin={(event) => {
  if (event.target !== owner && !panel.contains(event.target as Node)) dismiss(false);
}} />

<div bind:this={panel} {@attach mountFocus} {id} role="menu" aria-label={label} popover="manual"
  tabindex="-1" class="aui-frame aui-floating menu" data-size={size} onkeydown={navigate}>
  {#each items as item (item.id)}
    <button class="item" type="button" role="menuitem" disabled={item.disabled} data-id={item.id}
      tabindex={current === item.id ? 0 : -1} onfocus={() => active = item.id}
      onclick={() => { dismiss(true); item.action?.(item); onselect?.(item); }}>{item.label}</button>
  {:else}
    <span role="menuitem" aria-disabled="true" class="empty">{emptyLabel}</span>
  {/each}
</div>

<style>
  .menu { width: max-content; min-width: min(20ch, calc(100vw - 16px)); max-width: min(36ch, calc(100vw - 16px)); display: none; }
  .menu:popover-open { display: grid; gap: 2px; }
  @supports not selector(:popover-open) { .menu { display: grid; gap: 2px; } }
  .item { display: block; text-align: start; color: var(--text); font: inherit; min-height: 32px; overflow-wrap: anywhere; padding: .2em .75ch; background: transparent; border: 1px solid transparent; cursor: pointer; }
  .item:hover:not(:disabled), .item:focus-visible { color: var(--accent); outline: 1px dashed currentColor; outline-offset: -2px; }
  .item:disabled, .empty { opacity: .65; cursor: default; }
  .empty { padding: .2em .75ch; }
  @media(pointer:coarse) { .item { min-height: 44px; } }
</style>
