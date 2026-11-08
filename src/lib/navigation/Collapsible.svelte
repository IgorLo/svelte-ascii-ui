<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from '../types';
  import Icon from '../Icon.svelte';

  type Props = Omit<HTMLButtonAttributes, 'children' | 'size'> & {
    open?: boolean; title: string; size?: Size; trigger?: Snippet<[boolean]>; children?: Snippet;
  };
  let { open = $bindable(false), title, size = 's', disabled, trigger, children,
    type = 'button', class: className, onclick, ...rest }: Props = $props();
  const id = $props.id();
</script>

<div class="disclosure">
  <button {...rest} {type} class={['aui-button', 'toggle', className]} data-size={size} {disabled}
    aria-label={rest['aria-label'] ?? title} aria-expanded={open} aria-controls={id}
    onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) open = !open; }}>
    <span class={['chevron', { collapsed: !open }]} aria-hidden="true"><Icon name="chevron-down" /></span>
    {#if trigger}{@render trigger(open)}{:else}{title}{/if}
  </button>
  <div {id} class="content" hidden={!open}>{@render children?.()}</div>
</div>

<style>
  .toggle { justify-content: flex-start; text-align: start; gap: .75ch; }
  .chevron { display: grid; place-items: center; flex: none; }
  .chevron.collapsed { transform: rotate(-90deg); }
  .chevron.collapsed:dir(rtl) { transform: rotate(90deg); }
  .content { margin-block-start: .35em; padding-inline: 1ch; overflow-wrap: anywhere; }
</style>
