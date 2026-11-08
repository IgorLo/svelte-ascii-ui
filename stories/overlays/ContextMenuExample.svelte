<script lang="ts">
  import Menu from '../../src/lib/overlays/ContextMenu.svelte';
  import type { MenuItem } from '../../src/lib/overlays/types';
  let { label = 'File context actions', size = 's', empty = false, buttonLabel = 'More actions' }: {
    label?: string; size?: 's' | 'm' | 'l'; empty?: boolean; buttonLabel?: string;
  } = $props();
  let result = $state('');
  const items: MenuItem[] = [
    { id: 'copy', label: 'Copy path', action: () => result = 'Path copied.' },
    { id: 'archive', label: 'Archive', disabled: true },
    { id: 'rename', label: 'Rename', action: () => result = 'Rename requested.' },
  ];
</script>
<Menu {label} {size} {buttonLabel} items={empty ? [] : items} />
<small>Right-click the framed target or press Shift+F10.</small>
<p role="status">{result}</p>
