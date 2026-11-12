<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import { positionFloating, showFloating } from './position';
  import './floating.css';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'size'> & {
    text: string; label?: string; trigger?: Snippet; size?: Size;
  };
  let { text, label = 'Help', trigger, size = 's', type = 'button', class: className,
    onclick, onfocus, onblur, 'aria-describedby': describedBy, ...rest }: Props = $props();
  const id = $props.id();
  let anchor: HTMLButtonElement;
  let bubble: HTMLDivElement;
  let hovered = $state(false), focused = $state(false), pinned = $state(false), dismissed = $state(false);
  let leave: ReturnType<typeof setTimeout> | undefined;
  const visible = $derived(!dismissed && (hovered || focused || pinned));

  function reposition() { if (visible && anchor && bubble) positionFloating(bubble, anchor.getBoundingClientRect(), 0); }
  function enter() { clearTimeout(leave); hovered = true; dismissed = false; }
  function exit() { clearTimeout(leave); leave = setTimeout(() => { hovered = false; }, 100); }
  function dismiss() { dismissed = true; pinned = false; clearTimeout(leave); hovered = false; }

  $effect(() => {
    if (visible) {
      showFloating(bubble);
      reposition();
    } else if (typeof bubble.hidePopover === 'function' && bubble.matches(':popover-open')) {
      bubble.hidePopover();
    }
  });
  $effect(() => () => clearTimeout(leave));
</script>

<svelte:window onscrollcapture={reposition} onresize={reposition} onkeydowncapture={(event) => {
  if (visible && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(); }
}} />

<button {...rest} bind:this={anchor} {type} class={['aui-button', className]} data-size={size}
  aria-label={rest['aria-label'] ?? label} aria-describedby={[describedBy, id].filter(Boolean).join(' ')}
  onpointerenter={enter} onpointerleave={exit}
  onfocus={(event) => { onfocus?.(event); focused = true; dismissed = false; }}
  onblur={(event) => { onblur?.(event); focused = false; pinned = false; }}
  onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) { if (pinned) dismiss(); else { pinned = true; dismissed = false; } } }}>
  {#if trigger}{@render trigger()}{:else}<span aria-hidden="true">[?]</span> {label}{/if}
</button>
<div bind:this={bubble} {id} role="tooltip" popover="manual" hidden={!visible}
  class="aui-frame aui-floating aui-scrollbar tooltip" data-size="s" onpointerenter={enter} onpointerleave={exit}>{text}</div>

<style>
  .tooltip { width: max-content; max-width: min(32ch, calc(100vw - 16px)); }
</style>
