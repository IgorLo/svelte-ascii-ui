<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from './types';
  import Loader from './Loader.svelte';
  import Icon from './Icon.svelte';
  import type { IconName } from './icons/pixelarticons';
  let { children,label,icon,iconEnd,size='m',variant='default',loading=false,disabled=false,fullWidth=false,type='button',class:className='',...rest }: Omit<HTMLButtonAttributes,'children'> & {children?:Snippet;label?:string;icon?:Snippet|IconName;iconEnd?:Snippet|IconName;size?:Size;variant?:'default'|'primary'|'danger';loading?:boolean;fullWidth?:boolean}=$props();
</script>
<button {...rest} {type} disabled={disabled||loading} aria-busy={loading || undefined} class={`aui-button ${className}`} data-size={size} data-variant={variant} style:width={fullWidth?'100%':undefined}>
  {#if loading}<Loader {size} />{:else if icon}<span class="button-icon" aria-hidden="true">{#if typeof icon === 'string'}<Icon name={icon} />{:else}{@render icon()}{/if}</span>{/if}
  <span>{#if children}{@render children()}{:else}{label}{/if}</span>
  {#if iconEnd}<span class="button-icon" aria-hidden="true">{#if typeof iconEnd === 'string'}<Icon name={iconEnd} />{:else}{@render iconEnd()}{/if}</span>{/if}
</button>
<style>.button-icon{display:inline-grid;place-items:center;inline-size:var(--icon-size,18px);block-size:var(--icon-size,18px);flex:none;font-family:var(--art-font);font-variant-east-asian:normal;line-height:1}.button-icon :global(svg){display:block;width:100%;height:100%}</style>
