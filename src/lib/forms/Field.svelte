<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { FieldControl } from './types';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> {
    id?: string;
    label: string | Snippet;
    hint?: string | Snippet;
    error?: string | Snippet;
    required?: boolean;
    requiredText?: string;
    children: Snippet<[FieldControl]>;
  }
  const uid = $props.id();
  let { id = uid, label, hint, error, required, requiredText = '(required)', children, class: className, ...attrs }: Props = $props();
  const describedBy = $derived([hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined);
</script>

<div {...attrs} class={['field', className]}>
  <label for={id}>{#if typeof label === 'string'}{label}{:else}{@render label()}{/if}{#if required}<span class="hint required">{requiredText}</span>{/if}</label>
  {@render children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
  {#if hint}<div id={id + '-hint'} class="hint">{#if typeof hint === 'string'}{hint}{:else}{@render hint()}{/if}</div>{/if}
  {#if error}<div id={id + '-error'} class="error"><span aria-hidden="true">! </span>{#if typeof error === 'string'}{error}{:else}{@render error()}{/if}</div>{/if}
</div>

<style>
  .field { display: grid; gap: .5rem; }
  .hint,.error { font-size: .875em; }
  .hint { color: var(--muted); }
  .required { display: inline-block; margin-inline-start: .5ch; white-space: nowrap; }
  .error { color: var(--danger); }
</style>
