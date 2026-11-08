<script lang="ts">
  import Menu from '../../src/lib/overlays/DropdownMenu.svelte';
  import type { MenuItem } from '../../src/lib/overlays/types';
  let { label = 'File actions', size = 's', empty = false }: {
    label?: string; size?: 's' | 'm' | 'l'; empty?: boolean;
  } = $props();
  let result = $state('');
  const items: MenuItem[] = [
    { id: 'copy', label: 'Copy path', action: () => result = 'Path copied.' },
    { id: 'archive', label: 'Archive', disabled: true },
    { id: 'rename', label: 'Rename', action: () => result = 'Rename requested.' },
  ];
</script>
<Menu {label} {size} items={empty ? [] : items} />

<p role="status">{result}</p>
