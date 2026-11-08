<script lang="ts">
  import Tabs from '../../src/lib/navigation/Tabs.svelte';
  import type { TabItem } from '../../src/lib/navigation/types';
  let { items = [{ id: 'overview', label: 'Overview' }, { id: 'logs', label: 'Logs', disabled: true }, { id: 'access', label: 'Access' }],
    label = 'Session information', orientation = 'horizontal', size = 's' }: {
    items?: TabItem[]; label?: string; orientation?: 'horizontal' | 'vertical'; size?: 's' | 'm' | 'l';
  } = $props();
  let value = $state<string>();
</script>
<Tabs {items} {label} {orientation} {size} bind:value>
  {#snippet panel(item)}<p>Showing the {item.label.toLowerCase()} panel.</p>{/snippet}
</Tabs>
