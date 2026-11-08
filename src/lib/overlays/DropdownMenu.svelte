<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import MenuSurface from './MenuSurface.svelte';
  import type { MenuItem } from './types';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'size' | 'onselect'> & {
    label: string; items: readonly MenuItem[]; trigger?: Snippet; size?: Size;
    open?: boolean; emptyLabel?: string; onselect?: (item: MenuItem) => void;
  };
  let { label, items, trigger, size = 's', open = $bindable(false), emptyLabel = 'No actions',
    onselect, type = 'button', class: className, onclick, onkeydown, ...rest }: Props = $props();
  const id = $props.id();
  let anchor: HTMLButtonElement | undefined = $state();
  let focusLast = $state(false);

  function dismiss(restore: boolean) { open = false; if (restore) anchor?.focus(); }
</script>

<button {...rest} bind:this={anchor} {type} class={['aui-button', className]} data-size={size} aria-label={rest['aria-label'] ?? label}
  aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
  onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) { focusLast = false; open = !open; } }}
  onkeydown={(event) => {
    onkeydown?.(event);
    if (!event.defaultPrevented && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault(); focusLast = event.key === 'ArrowUp'; open = true;
    } else if (!event.defaultPrevented && event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); dismiss(true); }
  }}>
  {#if trigger}{@render trigger()}{:else}{label} <span aria-hidden="true">v</span>{/if}
</button>
{#if open && anchor}
  <MenuSurface {id} {label} {items} {size} {emptyLabel} {onselect} {focusLast} {dismiss}
    owner={anchor} origin={() => anchor?.getBoundingClientRect() ?? { left: 0, top: 0, bottom: 0 }} />
{/if}
