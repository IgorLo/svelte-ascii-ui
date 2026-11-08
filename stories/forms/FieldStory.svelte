<script lang="ts">
  import Field from '../../src/lib/forms/Field.svelte';
  import Input from '../../src/lib/forms/Input.svelte';
  import type { Size } from '../../src/lib/types';
  let { label = 'Article title', hint, error, required, disabled, size = 'm' }: { label?: string; hint?: string; error?: string; required?: boolean; disabled?: boolean; size?: Size } = $props();
</script>

<Field {label} {hint} {error} {required}>
  {#snippet children(control)}
    <Input {...control} {size} {required} {disabled} name="title" placeholder="Enter a title" />
  {/snippet}
</Field>
