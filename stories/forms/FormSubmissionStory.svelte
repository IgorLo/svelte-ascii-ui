<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Field from '../../src/lib/forms/Field.svelte';
  import Input from '../../src/lib/forms/Input.svelte';
  import RadioGroup from '../../src/lib/forms/RadioGroup.svelte';
  import ToggleGroup from '../../src/lib/forms/ToggleGroup.svelte';
  import Combobox from '../../src/lib/forms/Combobox.svelte';
  import MultiSelect from '../../src/lib/forms/MultiSelect.svelte';
  import TagInput from '../../src/lib/forms/TagInput.svelte';
  import Range from '../../src/lib/forms/Range.svelte';
  import Select from '../../src/lib/forms/Select.svelte';
  let submitted = $state('');
  const options = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled', disabled: true }
  ];
</script>

<form onsubmit={(event) => { event.preventDefault(); submitted = JSON.stringify([...new FormData(event.currentTarget)]); }} onreset={() => { submitted = ''; }}>
  <Field label="Article title" hint="Shown in the list of articles." required>
    {#snippet children(control)}<Input {...control} name="title" defaultValue="Example article" required />{/snippet}
  </Field>
  <Select aria-label="Native publication state" name="native" {options} value="draft" />
  <RadioGroup label="One state" name="radio" {options} value="draft" />
  <ToggleGroup label="Several states" name="toggle" {options} multiple value={['draft']} required />
  <Combobox aria-label="Publication state" name="state" {options} value="draft" required />
  <MultiSelect aria-label="Allowed states" name="allowed" {options} value={['draft']} required />
  <TagInput aria-label="Article tags" name="tag" value={['ASCII']} required />
  <Range label="Availability" lowerName="from" upperName="to" lower={20} upper={80} marks />
  <div class="actions"><Button type="submit" label="Submit" variant="primary" /><Button type="reset" label="Reset" /></div>
  {#if submitted}<output>{submitted}</output>{/if}
</form>

<style>
  form { display: grid; gap: .75rem; max-width: 34rem; }
  .actions { display: flex; gap: .5rem; }
  output { overflow-wrap: anywhere; }
</style>
