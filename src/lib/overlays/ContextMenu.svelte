<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import MenuSurface from './MenuSurface.svelte';
  import type { MenuItem } from './types';
  import type { Origin } from './position';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'size' | 'onselect'> & {
    label: string; items: readonly MenuItem[]; children?: Snippet; buttonLabel?: string; size?: Size;
    emptyLabel?: string; onselect?: (item: MenuItem) => void;
  };
  let { label, items, children, buttonLabel, size = 's', emptyLabel = 'No actions',
    onselect, onkeydown, oncontextmenu, onclick, class: className, disabled, ...rest }: Props = $props();
  const id = $props.id();
  let anchor: HTMLButtonElement | undefined = $state();
  let visibleButton: HTMLButtonElement | undefined = $state();
  let owner: HTMLButtonElement | undefined = $state();
  let point: Origin | undefined = $state();

  function show(button: HTMLButtonElement, position?: Origin) {
    point = position;
    owner = button;
  }
  function dismiss(restore: boolean) {
    const previous = owner;
    owner = undefined;
    if (restore) previous?.focus();
  }
</script>

<div class="context">
  <button {...rest} bind:this={anchor} type="button" {disabled} class={['aui-button', 'context-area', className]} data-size={size}
    aria-label={rest['aria-label'] ?? label} aria-haspopup="menu" aria-expanded={!!owner && owner === anchor} aria-controls={owner && owner === anchor ? id : undefined}
    oncontextmenu={(event) => {
      oncontextmenu?.(event);
      if (event.defaultPrevented || disabled) return;
      event.preventDefault();
      show(event.currentTarget, event.clientX || event.clientY ? { left: event.clientX, top: event.clientY, bottom: event.clientY } : undefined);
    }}
    onkeydown={(event) => {
      onkeydown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
        event.preventDefault(); show(event.currentTarget);
      }
    }}
    onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) { if (owner === anchor) dismiss(true); else show(event.currentTarget); } }}>
    {#if children}{@render children()}{:else}{label}{/if}
  </button>
  {#if buttonLabel}
    <button bind:this={visibleButton} type="button" {disabled} class="aui-button" data-size={size}
      aria-haspopup="menu" aria-expanded={!!owner && owner === visibleButton} aria-controls={owner && owner === visibleButton ? id : undefined}
      onclick={(event) => { if (owner === visibleButton) dismiss(true); else show(event.currentTarget); }}>{buttonLabel}</button>
  {/if}
  {#if owner}
    <MenuSurface {id} {label} {items} {size} {emptyLabel} {onselect} {dismiss} {owner}
      origin={() => point ?? owner?.getBoundingClientRect() ?? { left: 0, top: 0, bottom: 0 }} />
  {/if}
</div>

<style>
  .context { display: flex; flex-wrap: wrap; gap: .65em; align-items: start; }
  .context-area { min-height: 72px; border-image-source: var(--ascii-muted); }
</style>
