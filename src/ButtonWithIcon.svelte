<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  let { icon, children, class: className, ...attributes }: HTMLButtonAttributes & { icon: Snippet; children: Snippet } = $props();
</script>

<button {...attributes} class={['with-icon', 'balanced-icon-button', className]}>
  <span class="balanced-icon" aria-hidden="true">{@render icon()}</span>
  <span>{@render children()}</span>
</button>
