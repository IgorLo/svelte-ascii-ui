<script lang="ts">
  import { untrack } from 'svelte';
  import { Select } from '../src/lib';

  let { showPlaceholder, initialValue = 'author', required = false }: {
    showPlaceholder?: boolean;
    initialValue?: string;
    required?: boolean;
  } = $props();
  let value = $state(untrack(() => initialValue));
  const options = [
    { value: 'author', label: 'By popularity' },
    { value: 'date', label: 'By date' },
  ];
</script>

<form aria-label="Sort form">
  <Select aria-label="Sort order" name="sort" {options} {showPlaceholder} {required} bind:value />
  <output aria-label="Bound sort">{value}</output>
  <button type="button" onclick={() => value = 'date'}>Set date</button>
  <button type="reset">Reset</button>
</form>
