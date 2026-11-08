<script lang="ts">import type{Snippet}from'svelte';let{children,text,author,cite}:{children?:Snippet;text?:string;author?:string;cite?:string}=$props();</script>
<blockquote {cite}>{#if children}{@render children()}{:else}<p>{text}</p>{/if}{#if author}<footer>— {author}</footer>{/if}</blockquote>
<style>blockquote{margin:1.5em 0;padding-left:2ch;border-left:1px dashed var(--muted);font-size:.95em}p{margin:0}footer{font-size:.85em;color:var(--muted);margin-top:.5em}</style>
