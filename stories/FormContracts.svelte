<script lang="ts">
  import { Checkbox, Switch, SearchInput, PasswordInput, NumberInput, TagInput, MultiSelect, Button } from '../src/lib';
  let events = $state(0);
  let clicked = $state(0);
</script>
<form onsubmit={event => event.preventDefault()}>
  <Checkbox label="Default checkbox" defaultChecked />
  <Switch label="Default switch" defaultChecked />
  <SearchInput aria-label="Search" defaultValue="ASCII" oninput={() => events++} />
  <PasswordInput aria-label="Password" defaultValue="secret" />
  <NumberInput aria-label="Quantity" value={2} oninput={() => events++} />
  <TagInput aria-label="Tag" oninput={() => events++} />
  <MultiSelect aria-label="Loading selection" options={[{value:'a',label:'Alpha'}]} value={['a']} loading onclick={() => clicked++} />
  <Button label="Reset" type="reset" />
  <output aria-label="Input events">{events}</output><output aria-label="Click events">{clicked}</output>
</form>
<style>form{display:grid;gap:16px;max-width:500px}</style>
