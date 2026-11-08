<script lang="ts">
  import Combobox from '../../src/lib/forms/Combobox.svelte';
  let status = $state<'error' | 'ready'>('error');
  const options = [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }];
</script>

<Combobox aria-label="Publication state" {options} error={status === 'error' ? 'Could not load publication states.' : undefined} onRetry={() => { status = 'ready'; }} />
