<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { BreadcrumbItem } from './types';
  let { items, label = 'Breadcrumbs', ...rest }: Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    items: readonly BreadcrumbItem[]; label?: string;
  } = $props();
  const explicitCurrent = $derived(items.findIndex(item => item.current));
</script>

<nav aria-label={label} {...rest}>
  <ol role="list">
    {#each items as item, index (item)}
      {@const current = index === (explicitCurrent < 0 ? items.length - 1 : explicitCurrent)}
      <li>
        {#if index > 0}<span class="separator" aria-hidden="true">/</span>{/if}
        {#if item.href}<a class="aui-link" href={item.href} aria-current={current ? 'page' : undefined}>{item.label}</a>
        {:else}<span aria-current={current ? 'page' : undefined}>{item.label}</span>{/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  ol { display: flex; flex-wrap: wrap; gap: .25em 1ch; padding: 0; margin: 0; list-style: none; }
  li { display: flex; gap: 1ch; min-width: 0; overflow-wrap: anywhere; }
  .separator { color: var(--muted); }
</style>
