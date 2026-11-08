<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & { label: string; children?: Snippet };
  let { label, children, class: className, ...rest }: Props = $props();
</script>
<div {...rest} role="group" aria-label={label} class={['toolbar', className]}>{@render children?.()}</div>

<style>
  .toolbar { display: flex; flex-wrap: wrap; gap: .5em; align-items: center; }
</style>
