<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from './types';
  import Loader from './Loader.svelte';
  let {label,children,glyph='×',size='m',variant='default',loading=false,disabled=false,type='button',class:className='',...rest}:Omit<HTMLButtonAttributes,'children'|'aria-label'> & {label:string;children?:Snippet;glyph?:string;size?:Size;variant?:'default'|'primary'|'danger';loading?:boolean}=$props();
</script>
<button {...rest} {type} aria-label={label} aria-busy={loading||undefined} disabled={disabled||loading} class={`aui-button aui-icon-button ${className}`} data-size={size} data-variant={variant}>{#if loading}<Loader {size}/>{:else}<span aria-hidden="true">{#if children}{@render children()}{:else}{glyph}{/if}</span>{/if}</button>
<style>.aui-icon-button{width:var(--control-height);height:var(--control-height);min-width:var(--control-height);padding:0;flex:none}.aui-icon-button>span{display:grid;place-items:center;font:var(--radio-font)/1 var(--art-font);font-variant-east-asian:normal;transform:translateY(-1px)}@media(pointer:coarse){.aui-icon-button{width:max(44px,var(--control-height));height:max(44px,var(--control-height))}}</style>
