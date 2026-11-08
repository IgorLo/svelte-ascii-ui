<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Size } from '../types';

  type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onchange'> & {
    page?: number; totalPages: number; disabled?: boolean; size?: Size; label?: string;
    previousLabel?: string; nextLabel?: string; pageLabel?: (page: number) => string;
    onchange?: (page: number) => void;
  };
  let { page = $bindable(1), totalPages, disabled = false, size = 's', label = 'Pagination',
    previousLabel = 'Previous page', nextLabel = 'Next page', pageLabel = (n) => `Page ${n}`, onchange, ...rest }: Props = $props();
  const total = $derived(Number.isFinite(totalPages) ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(totalPages))) : 0);
  const current = $derived(Math.max(1, Math.min(total, Number.isFinite(page) ? Math.trunc(page) : 1)));
  const pages = $derived.by(() => {
    if (total < 8) return Array.from({ length: total }, (_, i) => i + 1);
    if (current < 5) return [1, 2, 3, 4, 5, 'end-gap', total] as const;
    if (current > total - 4) return [1, 'start-gap', total - 4, total - 3, total - 2, total - 1, total] as const;
    return [1, 'start-gap', current - 1, current, current + 1, 'end-gap', total] as const;
  });
  function select(next: number, event: MouseEvent) {
    if (disabled || next < 1 || next > total || next === current) return;
    const button = event.currentTarget as HTMLButtonElement;
    const nav = button.closest('nav');
    page = next;
    onchange?.(next);
    queueMicrotask(() => {
      if ((button.disabled || !button.isConnected) && (button.ownerDocument.activeElement === button || button.ownerDocument.activeElement === button.ownerDocument.body)) {
        nav?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus();
      }
    });
  }
</script>
<nav aria-label={label} {...rest}>
  <div class="pages">
    <button type="button" class="aui-button" data-size={size} aria-label={previousLabel} disabled={disabled || current <= 1}
      onclick={(event) => select(current - 1, event)}><span aria-hidden="true">&lt;</span></button>
    {#each pages as entry (entry)}
      {#if typeof entry === 'number'}
        <button type="button" class="aui-button" data-size={size} data-variant={current === entry ? 'primary' : undefined}
          aria-current={current === entry ? 'page' : undefined} aria-label={pageLabel(entry)} {disabled}
          onclick={(event) => select(entry, event)}>{entry}</button>
      {:else}<span class="gap" aria-hidden="true">...</span>{/if}
    {/each}
    <button type="button" class="aui-button" data-size={size} aria-label={nextLabel} disabled={disabled || current >= total}
      onclick={(event) => select(current + 1, event)}><span aria-hidden="true">&gt;</span></button>
  </div>
</nav>

<style>
  .pages { display: flex; flex-wrap: wrap; align-items: center; gap: .35em; }
  .gap { padding-inline: .25ch; color: var(--muted); }
  button { min-width: 36px; }
</style>
