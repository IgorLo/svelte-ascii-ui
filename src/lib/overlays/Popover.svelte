<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import { positionFloating, showFloating } from './position';
  import './floating.css';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'size'> & {
    label: string; title?: string; open?: boolean; trigger?: Snippet; children?: Snippet<[() => void]>; size?: Size;
  };
  let { label, title, open = $bindable(false), trigger, children, size = 's', type = 'button',
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

<button {...rest} bind:this={anchor} {type} class={['aui-button', className]} data-size={size} aria-label={rest['aria-label'] ?? label}
  aria-haspopup="dialog" aria-controls={open ? id : undefined} aria-expanded={open}
  onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) open = !open; }}
  onkeydown={(event) => { rest.onkeydown?.(event); if (open && !event.defaultPrevented && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(); } }}>
  {#if trigger}{@render trigger()}{:else}{label}{/if}
</button>
{#if open}
  <div bind:this={panel} {id} popover="manual" role="dialog" aria-label={title ?? label} tabindex="-1"
    class="aui-frame aui-floating" data-size={size} onkeydown={(event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); dismiss(); }
    }}>
    {@render children?.(dismiss)}
  </div>
{/if}
