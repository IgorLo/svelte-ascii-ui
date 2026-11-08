<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from './types';
  import Loader from './Loader.svelte';
  let { children,label,icon,iconEnd,size='m',variant='default',loading=false,disabled=false,fullWidth=false,type='button',class:className='',...rest }: Omit<HTMLButtonAttributes,'children'> & {children?:Snippet;label?:string;icon?:Snippet;iconEnd?:Snippet;size?:Size;variant?:'default'|'primary'|'danger';loading?:boolean;fullWidth?:boolean}=$props();
</script>
<button {...rest} {type} disabled={disabled||loading} aria-busy={loading || undefined} class={`aui-button ${className}`} data-size={size} data-variant={variant} style:width={fullWidth?'100%':undefined}>
  {#if loading}<Loader {size} />{:else if icon}<span class="button-icon" aria-hidden="true">{@render icon()}</span>{/if}
  <span>{#if children}{@render children()}{:else}{label}{/if}</span>
  {#if iconEnd}<span class="button-icon" aria-hidden="true">{@render iconEnd()}</span>{/if}
</button>
<style>.button-icon{display:inline-grid;place-items:center;width:1em;height:1em;flex:0 0 auto;font-family:var(--art-font);font-variant-east-asian:normal}.button-icon :global(svg){width:100%;height:100%}</style>
