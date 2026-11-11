<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';
  import IconButton from '../IconButton.svelte';

  type Props = Omit<HTMLDialogAttributes, 'children' | 'open' | 'title'> & {
    open?: boolean; title: string; size?: 's' | 'm' | 'l' | 'xl' | 'fit';
    header?: Snippet; children?: Snippet; footer?: Snippet;
    closeOnEscape?: boolean; closeOnBackdrop?: boolean; closeLabel?: string;
    drawerSide?: 'left' | 'right' | 'bottom';
  };
  let {
    open = $bindable(false), title, size = 'm', header, children, footer,
    closeOnEscape = true, closeOnBackdrop = true, closeLabel = 'Close', drawerSide,
    class: className, onclose, oncancel, onclick, onkeydown, onpointerdown, ...rest
  }: Props = $props();
  const titleId = $props.id();
  let element: HTMLDialogElement;
  let backdropPressed = false;

  $effect(() => {
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  });


  $effect(() => {
    if (!open || drawerSide !== 'bottom' || !window.visualViewport) return;
    const viewport = window.visualViewport;
    function updateViewport() {
      // Pinch zoom keeps the layout size so users can pan across the content.
      if (viewport.scale !== 1) {
        element.style.removeProperty('--drawer-viewport-height');
        element.style.removeProperty('--drawer-viewport-bottom');
        return;
      }
      element.style.setProperty('--drawer-viewport-height', `${viewport.height}px`);
      element.style.setProperty('--drawer-viewport-bottom', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
      const active = document.activeElement;
      if (active instanceof HTMLElement && element.contains(active)) active.scrollIntoView({ block: 'nearest' });
    }
    updateViewport();
    viewport.addEventListener('resize', updateViewport);
    viewport.addEventListener('scroll', updateViewport);
    return () => {
      viewport.removeEventListener('resize', updateViewport);
      viewport.removeEventListener('scroll', updateViewport);
      element.style.removeProperty('--drawer-viewport-height');
      element.style.removeProperty('--drawer-viewport-bottom');
    };
  });

  function onBackdrop(event: MouseEvent | PointerEvent) {
    if (event.target !== element) return false;
    const { left, right, top, bottom } = element.getBoundingClientRect();
    return event.clientX < left || event.clientX >= right || event.clientY < top || event.clientY >= bottom;
  }

  function trapTab(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.defaultPrevented) return;
    const candidates = [...element.querySelectorAll<HTMLElement>('a[href], area[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]')];
    const available = candidates.filter(node => node.tabIndex >= 0 && !node.matches(':disabled') &&
      !node.closest('[inert], [hidden]') && node.getClientRects().length && getComputedStyle(node).visibility === 'visible');
    const active = document.activeElement;
    if (!available.length) {
      event.preventDefault();
      element.focus();
    } else if (event.shiftKey && (active === available[0] || !available.includes(active as HTMLElement))) {
      event.preventDefault();
      available.at(-1)?.focus();
    } else if (!event.shiftKey && (active === available.at(-1) || !available.includes(active as HTMLElement))) {
      event.preventDefault();
      available[0]?.focus();
    }
  }
</script>

<dialog {...rest} bind:this={element} class={['aui-frame', 'dialog', className]} data-overlay-size={size}
  data-drawer={drawerSide} aria-labelledby={titleId} tabindex="-1"
  onclose={(event) => { if (!element.open) open = false; onclose?.(event); }}
  oncancel={(event) => { oncancel?.(event); if (!closeOnEscape) event.preventDefault(); }}
  onpointerdown={(event) => { onpointerdown?.(event); backdropPressed = !event.defaultPrevented && onBackdrop(event); }}
  onclick={(event) => { onclick?.(event); if (closeOnBackdrop && backdropPressed && !event.defaultPrevented && onBackdrop(event)) open = false; backdropPressed = false; }}
  onkeydown={(event) => { onkeydown?.(event); trapTab(event); }}>
  <div class="header">
    <div><h2 id={titleId}>{title}</h2>{@render header?.()}</div>
    <IconButton label={closeLabel} size="s" onclick={() => open = false} />
  </div>
  <div class="body">{@render children?.()}</div>
  {#if footer}<div class="footer">{@render footer()}</div>{/if}
</dialog>

<style>
  .dialog { --overlay-width: 600px; width: min(var(--overlay-width), calc(100vw - 32px)); max-width: calc(100vw - 32px); max-height: min(82dvh, 900px); padding: 0; overflow: hidden; background: var(--bg); border-image-source: var(--ascii-frame); }
  .dialog[open] { display: flex; flex-direction: column; }
  .dialog::backdrop { background: rgb(0 0 0 / .58); }
  [data-overlay-size='s'] { --overlay-width: 400px; }
  [data-overlay-size='l'] { --overlay-width: 860px; }
  [data-overlay-size='xl'] { --overlay-width: 1120px; }
  [data-overlay-size='fit'] { width: fit-content; max-width: min(70ch, calc(100vw - 32px)); }
  .header, .footer { display: flex; justify-content: space-between; align-items: flex-start; gap: .75em; padding: 1em; flex: 0 0 auto; }
  .header > div { min-width: 0; overflow-wrap: anywhere; }
  .header h2 { margin: 0; font-size: 1.15em; font-weight: 600; }
  .body { padding: 0 1em 1em; min-height: 0; overflow: auto; overscroll-behavior: contain; overflow-wrap: anywhere; scrollbar-color: var(--muted) var(--bg); }
  .body :global(p:first-child) { margin-top: 0; }
  .footer { justify-content: flex-end; flex-wrap: wrap; border-top: 1px dashed var(--line); }
  [data-drawer] { --overlay-width: 33vw; height: 100dvh; max-height: 100dvh; max-width: 100vw; width: var(--overlay-width); }
  [data-drawer='left'] { margin: 0 auto 0 0; }
  [data-drawer='right'] { margin: 0 0 0 auto; }
  [data-drawer] .body { flex: 1; }
  [data-drawer][data-overlay-size='s'] { --overlay-width: 25vw; }
  [data-drawer][data-overlay-size='l'] { --overlay-width: 50vw; }
  [data-drawer][data-overlay-size='xl'] { --overlay-width: 67vw; }
  .dialog[data-drawer='bottom'] {
    position: fixed; inset: auto 0 var(--drawer-viewport-bottom, 0); margin: 0;
    width: 100%; max-width: 100%; height: auto;
    max-height: var(--drawer-viewport-height, 100dvh);
    padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
  }
  .dialog[data-drawer='bottom'] .body { scroll-padding-block: var(--control-height); }
  :global(html:has(dialog[data-drawer='bottom']:modal)) { overflow: hidden; }
  @media (max-width: 600px) {
    .dialog { width: 100vw; max-width: 100vw; max-height: 75dvh; }
    [data-drawer]:not([data-drawer='bottom']) { max-height: 100dvh; margin: 0; }
    .header, .footer { padding: .6em; }
    .body { padding: 0 .6em .6em; }
  }
</style>
