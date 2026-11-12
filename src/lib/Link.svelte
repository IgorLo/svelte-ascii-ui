<script lang="ts">
  import type { Snippet } from 'svelte';import type { HTMLAnchorAttributes } from 'svelte/elements';import type { Size } from './types';
  let {children,label,button=false,size='m',class:className='',...rest}:Omit<HTMLAnchorAttributes,'children'> & {children?:Snippet;label?:string;button?:boolean;size?:Size|'inherit'}=$props();
</script>
<a {...rest} class={`${button?'aui-button':'aui-link'} ${className}`} data-size={size === 'inherit' ? undefined : size}>{#if children}{@render children()}{:else}{label}{/if}</a>
