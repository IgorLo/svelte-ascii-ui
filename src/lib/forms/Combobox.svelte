<script lang="ts">
  import Picker from './Picker.svelte';
  import type { PickerProps } from './types';
  let { value = $bindable(''), ...props }: PickerProps & { value?: string } = $props();
</script>

<Picker {...props} selected={value ? [value] : []} onSelection={(next) => { value = next[0] ?? ''; }} />
