<script lang="ts">
  import { Theme, Input, Textarea, Select, Button, Checkbox, Switch, RadioGroup, FileInput, SearchInput, PasswordInput, NumberInput, Combobox, TagInput } from '../src/lib';
  import type { Palette } from '../src/lib/theme';
  let { palette = 'phosphor', size = 's' }: { palette?: Palette; size?: 's' | 'm' } = $props();
</script>

<Theme {palette}>
  <h1>Control states</h1>
  <Input {size} aria-label="Editable" />
  <Input aria-label="Invalid" aria-invalid="true" />
  <Input aria-label="Read only" readonly />
  <Input aria-label="Disabled" disabled />
  <Textarea {size} aria-label="Notes" />
  <Select {size} aria-label="Choice" options={[{ value: 'one', label: 'One' }]} />
  <SearchInput {size} aria-label="Search" />
  <PasswordInput {size} aria-label="Password" />
  <NumberInput {size} aria-label="Amount" />
  <Combobox {size} aria-label="Search choices" options={[]} />
  <TagInput {size} aria-label="Tags" />
  <Button label="Delete" variant="danger" />
  <Button label="Unavailable" disabled />
  <Checkbox {size} label="Checkbox" />
  <Checkbox {size} label="Checked checkbox" checked />
  <Checkbox {size} label="Partial checkbox" indeterminate />
  <Checkbox label="Disabled checkbox" disabled />
  <Switch {size} label="Switch" />
  <RadioGroup {size} label="Radio group" options={[{ value: 'one', label: 'Radio' }, { value: 'two', label: 'Disabled radio', disabled: true }]} />
  <FileInput aria-label="File" />
  <FileInput aria-label="Invalid file" aria-invalid="true" />
</Theme>
