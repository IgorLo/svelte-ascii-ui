<script lang="ts">import type{Snippet}from'svelte';import Loader from'../Loader.svelte';import Button from'../Button.svelte';import Skeleton from'./Skeleton.svelte';import Alert from'./Alert.svelte';import EmptyState from'./EmptyState.svelte';let{state='ready',children,empty,loading,error,title='Пока ничего нет',message='Попробуйте ещё раз.',onretry}:{state?:'ready'|'loading'|'updating'|'empty'|'error';children?:Snippet;empty?:Snippet;loading?:Snippet;error?:Snippet;title?:string;message?:string;onretry?:()=>void}=$props();</script>
<div aria-busy={state==='loading'||state==='updating'}>
{#if state==='loading'}{#if loading}{@render loading()}{:else}<p><Loader/> Загрузка…</p><Skeleton width="70%"/><Skeleton/><Skeleton width="85%"/>{/if}
{:else if state==='empty'}{#if empty}{@render empty()}{:else}<EmptyState {title}/>{/if}
{:else if state==='error'}{#if error}{@render error()}{:else}<Alert title="Не удалось загрузить данные" {message} tone="danger"/>{#if onretry}<Button label="Повторить" onclick={onretry}/>{/if}{/if}
{:else}{#if state==='updating'}<p><Loader size="s"/> Обновление…</p>{/if}{@render children?.()}{/if}
</div>
<style>p{display:flex;gap:1ch;align-items:center;color:var(--muted);margin:.8em 0}</style>
