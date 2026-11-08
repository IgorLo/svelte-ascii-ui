<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import { positionFloating, showFloating } from './position';
  import './floating.css';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'size'> & {
    label: string; title?: string; open?: boolean; trigger?: Snippet; children?: Snippet<[() => void]>; size?: Size; triggerVariant?: 'button' | 'compact';
  };
  let { label, title, open = $bindable(false), trigger, children, size = 's', triggerVariant = 'button', type = 'button',
    class: className, onclick, ...rest }: Props = $props();
  const id = $props.id();
  let anchor: HTMLButtonElement;
  let panel: HTMLDivElement | undefined = $state();

  function position() { if (panel) positionFloating(panel, anchor.getBoundingClientRect()); }
  function dismiss(restore = true) { open = false; if (restore) anchor.focus(); }

  $effect(() => {
    if (!panel) return;
    showFloating(panel);
    position();
    const first = panel.querySelector<HTMLElement>('[autofocus], a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
    (first ?? panel).focus({ preventScroll: true });
  });
</script>

<svelte:window onscrollcapture={position} onresize={position} />
<svelte:document onpointerdown={(event) => {
  const path = event.composedPath();
  if (open && panel && !path.includes(panel) && !path.includes(anchor)) dismiss(panel.contains(panel.ownerDocument.activeElement));
}} onfocusin={(event) => {
  if (open && panel && event.target !== anchor && !panel.contains(event.target as Node)) dismiss(false);
}} />

<button {...rest} bind:this={anchor} {type} class={['aui-button', className]} data-size={size} data-trigger-variant={triggerVariant} aria-label={rest['aria-label'] ?? label}
  aria-haspopup="dialog" aria-controls={open ? id : undefined} aria-expanded={open}
  onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) open = !open; }}
  onkeydown={(event) => { rest.onkeydown?.(event); if (open && !event.defaultPrevented && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(); } }}>
  {#if trigger}{@render trigger()}{:else if triggerVariant === 'compact'}<span aria-hidden="true">[?]</span>{:else}{label}{/if}
</button>
{#if open}
  <div bind:this={panel} {id} popover="manual" role="dialog" aria-label={title ?? label} tabindex="-1"
    class="aui-frame aui-floating" data-size={size} onkeydown={(event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); dismiss(); }
    }}>
    {@render children?.(dismiss)}
  </div>
{/if}

<style>
  .aui-button[data-trigger-variant='compact'] {
    border: 0;
    border-image: none;
    min-inline-size: 24px;
    min-block-size: 24px;
    min-height: 24px;
    padding: 2px;
    line-height: 1.25;
    flex-shrink: 0;
  }
  .aui-button[data-trigger-variant='compact']:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }
  @media (pointer: coarse) {
    .aui-button[data-trigger-variant='compact'] {
      min-inline-size: 44px;
      min-block-size: 44px;
      min-height: 44px;
    }
  }
  @media (forced-colors: active) {
    .aui-button[data-trigger-variant='compact']:focus-visible { outline-color: Highlight; }
  }
</style>
