<script lang="ts">
  import Picker from './Picker.svelte';
  import type { PickerProps } from './types';
  let { value = $bindable<string[]>([]), ...props }: PickerProps & { value?: string[] } = $props();
</script>

<Picker {...props} multiple selected={value} onSelection={(next) => { value = next; }} />
