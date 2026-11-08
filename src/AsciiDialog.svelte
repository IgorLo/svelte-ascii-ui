<script lang="ts">
  import type { Snippet } from 'svelte';
  import './overlay-examples.css';
  let { open = $bindable(false), title, size = 'm', drawer = false, header, children, footer }: {
    open?: boolean; title: string; size?: 's' | 'm' | 'l' | 'xl' | 'fit'; drawer?: boolean;
    header?: Snippet; children: Snippet; footer?: Snippet;
  } = $props();
  const id = $props.id();
  let element: HTMLDialogElement;
  $effect(() => {
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  });
  function dismissBackdrop(event: MouseEvent) {
    if (event.target !== element) return;
    const box = element.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) open = false;
  }
  function keepTabInside(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const candidates = element.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], area[href], summary, [tabindex], [contenteditable="true"]');
    const focusable = [...candidates].filter(node => {
      if (node.tabIndex < 0 || node.matches(':disabled') || node.closest('[inert], [hidden]')) return false;
      const style = getComputedStyle(node);
      return node.getClientRects().length > 0 && style.visibility !== 'hidden' && style.visibility !== 'collapse' && style.display !== 'none';
    });
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) { event.preventDefault(); element.focus(); return; }
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === element || !element.contains(active))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || active === element || !element.contains(active))) {
      event.preventDefault(); first.focus();
    }
  }
</script>

<!-- Native Escape and focus restoration; an explicit Tab loop also keeps focus out of browser chrome. -->
<dialog bind:this={element} class={["ascii-overlay", {drawer}]} data-overlay-size={size} aria-labelledby={`${id}-title`} tabindex="-1" onclose={() => open = false} onclick={dismissBackdrop} onkeydown={keepTabInside}>
  <div class="overlay-header">
    <div><h2 id={`${id}-title`}>{title}</h2>{#if header}{@render header()}{/if}</div>
    <button type="button" class="icon-button" aria-label="Закрыть окно" onclick={() => open = false}><span aria-hidden="true">×</span></button>
  </div>
  <div class="overlay-body">{@render children()}</div>
  {#if footer}<div class="overlay-footer">{@render footer()}</div>{/if}
</dialog>
