<script lang="ts">
  import { onDestroy } from 'svelte';
  import AsciiLoader from './AsciiLoader.svelte';
  let { size }: { size: 's' | 'm' } = $props();
  let files = $state<File[]>([]);
  let error = $state('');
  let busy = $state(false);
  let message = $state('');
  let fileInput: HTMLInputElement;
  let timer: ReturnType<typeof setTimeout>;
  function choose(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    files = Array.from(input.files ?? []);
    error = files.some(f => f.size > 5 * 1024 * 1024) ? 'Один из файлов больше 5 МБ. Выберите файлы поменьше.' : '';
    message = files.length ? `Выбрано файлов: ${files.length}` : '';
  }
  function reset() { files = []; fileInput.value = ''; error = ''; message = 'Выбор очищен.'; }
  function process() {
    if (busy || !files.length || error) return;
    busy = true; message = 'Обработка файлов…';
    timer = setTimeout(() => { busy = false; message = 'Готово. Это демонстрация: файлы никуда не отправлялись.'; }, 2200);
  }
  onDestroy(() => clearTimeout(timer));
</script>

<label class={["file-picker", {invalid: !!error, busy}]}>
  <span class="sample-label">Выбрать файлы</span>
  <span class="file-surface"><span aria-hidden="true">[ + ]</span><span>{files.length ? `Выбрано: ${files.length}` : 'Открыть файлы'}</span>{#if busy}<AsciiLoader {size} />{/if}</span>
  <input bind:this={fileInput} type="file" multiple onchange={choose} disabled={busy} aria-invalid={!!error} aria-describedby={`${size}-file-help ${size}-file-error`} />
</label>
<p class="hint" id={`${size}-file-help`}>Любой формат · до 5 МБ на файл · можно выбрать несколько. Только локальный пример.</p>
<p class="error-text" id={`${size}-file-error`}>{error}</p>
{#if files.length}<ul class="file-list">{#each files as file, i (i)}<li><span>{file.name}</span><small>{Math.max(1,Math.round(file.size / 1024))} КБ</small></li>{/each}</ul>{/if}
<div class="sample-row file-actions"><button class="primary loading-button" aria-busy={busy} aria-disabled={busy} disabled={!files.length || !!error} onclick={process}>{#if busy}<AsciiLoader {size} />{/if}{busy ? 'Обработка…' : 'Обработать'}</button><button disabled={busy || !files.length} onclick={reset}>Очистить</button></div>
<p class="hint" role="status">{message}</p>
<label class="file-picker disabled"><span class="sample-label">Недоступно</span><span class="file-surface">[ + ] Выбор недоступен</span><input type="file" disabled /></label>
