<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Dialog from './Dialog.svelte';
  type Props = Omit<ComponentProps<typeof Dialog>, 'drawerSide' | 'size'> & {
    side?: 'left' | 'right'; size?: 's' | 'm' | 'l' | 'xl';
  };
  let { open = $bindable(false), side = 'right', size = 'm', ...rest }: Props = $props();
</script>
<Dialog {...rest} bind:open {size} drawerSide={side} />
