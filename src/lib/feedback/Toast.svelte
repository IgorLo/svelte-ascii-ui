<script lang="ts">import type{Snippet}from'svelte';import type{Tone,Size}from'../types';import IconButton from '../IconButton.svelte';let{open=$bindable(false),message='',children,tone='default',size='s',onclose}:{open?:boolean;message?:string;children?:Snippet;tone?:Tone;size?:Size;onclose?:()=>void}=$props();function close(){open=false;onclose?.();}</script>
<div role="status" aria-atomic="true">
{#if open}<div class="aui-frame toast" data-size={size} data-tone={tone}><div>{#if children}{@render children()}{:else}{message}{/if}</div><IconButton label="Закрыть уведомление" {size} onclick={close}/></div>{/if}
</div>
<style>.toast{display:flex;align-items:center;gap:1em;padding:.6em;max-width:100%;background:var(--surface)}.toast>div{flex:1;min-width:0;overflow-wrap:anywhere}[data-tone='danger']{color:var(--danger);border-image-source:var(--ascii-error)}[data-tone='success']{color:var(--accent)}</style>
