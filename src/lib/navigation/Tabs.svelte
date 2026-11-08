<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import type { TabItem } from './types';

  type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> & {
    items: readonly TabItem[]; value?: string; label?: string; orientation?: 'horizontal' | 'vertical';
    size?: Size; panel?: Snippet<[TabItem]>; onchange?: (value: string) => void;
  };
  let { items, value = $bindable(), label = 'Tabs', orientation = 'horizontal', size = 's', panel,
    onchange, class: className, ...rest }: Props = $props();
  const id = $props.id();
  const enabled = $derived(items.filter(item => !item.disabled));
  const selected = $derived(enabled.find(item => item.id === value) ?? enabled[0]);
  const tabId = (item: TabItem) => `${id}-tab-${encodeURIComponent(item.id)}`;
  const panelId = (item: TabItem) => `${id}-panel-${encodeURIComponent(item.id)}`;

  function select(item: TabItem) {
    if (value !== item.id) { value = item.id; onchange?.(item.id); }
  }
  function navigate(event: KeyboardEvent, item: TabItem) {
    if (event.altKey || event.ctrlKey || event.metaKey || !enabled.length) return;
    const index = enabled.indexOf(item);
    const button = event.currentTarget as HTMLButtonElement;
    const horizontal = orientation === 'horizontal';
    const rtl = horizontal && getComputedStyle(button).direction === 'rtl';
    const next = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const previous = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    let target: TabItem | undefined;
    if (event.key === 'Home') target = enabled[0];
    else if (event.key === 'End') target = enabled.at(-1);
    else if (event.key === next) target = enabled[(index + 1) % enabled.length];
    else if (event.key === previous) target = enabled[(index - 1 + enabled.length) % enabled.length];
    if (target) {
      event.preventDefault();
      select(target);
      button.ownerDocument.getElementById(tabId(target))?.focus();
    }
  }
</script>

<div {...rest} class={['tabs', className]} data-orientation={orientation}>
  <div class="list" role="tablist" aria-label={label} aria-orientation={orientation}>
    {#each items as item (item.id)}
      <button type="button" class="aui-button tab" data-size={size} data-variant={selected === item ? 'primary' : undefined}
        role="tab" id={tabId(item)} aria-selected={selected === item} aria-controls={panel ? panelId(item) : undefined}
        tabindex={selected === item ? 0 : -1} disabled={item.disabled}
        onclick={() => select(item)} onkeydown={(event) => navigate(event, item)}>{item.label}</button>
    {/each}
  </div>
  {#if panel}
    {#each items as item (item.id)}
      <div class="panel" id={panelId(item)} role="tabpanel" aria-labelledby={tabId(item)} hidden={selected !== item} tabindex="0">
        {#if selected === item}{@render panel(item)}{/if}
      </div>
    {/each}
  {/if}
</div>

<style>
  .tabs { display: flex; flex-direction: column; align-items: start; gap: .65em; }
  .list { display: flex; flex-wrap: wrap; gap: .5em; }
  [data-orientation='vertical'] { flex-direction: row; }
  [data-orientation='vertical'] .list { flex-direction: column; flex: 0 1 auto; }
  .panel { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
  .panel:focus-visible, .tab:focus-visible { outline: 2px dashed var(--text); outline-offset: -2px; }
  @media(max-width: 420px) { [data-orientation='vertical'] { flex-direction: column; } }
</style>
