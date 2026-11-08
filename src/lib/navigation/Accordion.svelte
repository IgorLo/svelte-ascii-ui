<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import type { AccordionItem } from './types';

  type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> & {
    items: readonly AccordionItem[]; value?: string | string[]; multiple?: boolean; size?: Size;
    header?: Snippet<[AccordionItem, boolean]>; children?: Snippet<[AccordionItem]>; onchange?: (value: string | string[]) => void;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
  };
  let { items, value = $bindable(), multiple = false, size = 's', header, children, onchange,
    headingLevel = 3, class: className, ...rest }: Props = $props();
  const uid = $props.id();
  const heading = $derived(`h${headingLevel}` as const);
  const ids = $derived(Array.isArray(value) ? (multiple ? value : value.slice(0, 1)) : value ? [value] : []);
  function toggle(id: string) {
    const next = multiple ? (ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]) : ids.includes(id) ? '' : id;
    value = next;
    onchange?.(next);
  }
</script>

<div {...rest} class={['accordion', className]}>
  {#each items as item (item.id)}
    {@const expanded = ids.includes(item.id)}
    {@const id = `${uid}-${encodeURIComponent(item.id)}`}
    <div class="section">
      <svelte:element this={heading} class="heading">
        <button type="button" class="aui-button toggle" data-size={size} disabled={item.disabled}
          aria-label={item.title} aria-expanded={expanded} aria-controls={id}
          onclick={() => toggle(item.id)}>
          <span class="chevron" aria-hidden="true">{expanded ? 'v' : '>'}</span>
          {#if header}{@render header(item, expanded)}{:else}{item.title}{/if}
        </button>
      </svelte:element>
      <div {id} class="content" hidden={!expanded}>
        {#if children}{@render children(item)}{:else}{item.content}{/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .accordion { display: grid; gap: .45em; }
  .heading { margin: 0; font: inherit; }
  .toggle { width: 100%; justify-content: flex-start; text-align: start; gap: .75ch; }
  .chevron { width: 1ch; flex: none; font-family: var(--art-font); font-variant-east-asian: normal; }
  .content { margin-block-start: .35em; padding-inline: 1ch; overflow-wrap: anywhere; }
</style>
