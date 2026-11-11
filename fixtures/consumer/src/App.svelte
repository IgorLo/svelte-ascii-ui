<script lang="ts">
  import { Theme, Button, Panel, Progress, Quote, Background, createSineWaves, Article, Badge, Link, Select, Drawer, Checkbox, Slider, Range } from 'svelte-ascii-ui';
  import 'svelte-ascii-ui/styles.css';
  import 'svelte-ascii-ui/fonts.css';
  let count = $state(0);
  let sort = $state('author');
  let sheetOpen = $state(false);
  const pattern = createSineWaves({ seed: 42, waveRandomness: .9 });
</script>
<p class="host">Host content retains its own font and colors.</p>
<Theme style="--font-size:1.125rem;--text-weight:400;--article-font-size:1.09375rem">
  <main>
    <h1>Установленный пакет</h1>
    <Panel title="Проверка зависимости"><Button label={`Счётчик: ${count}`} onclick={() => count++} /><Progress value={count / 10} label="Счётчик" /><Quote text="Компоненты импортированы из установленного tarball." /></Panel>
    <Article><p>Публичные настройки читаемого текста.</p><Link href="#source" size="inherit" label="Источник" /> <Badge size="inherit" label="Проверено" /></Article>
    <Select aria-label="Сортировка" showPlaceholder={false} bind:value={sort} options={[{value:'author',label:'По прикольности'},{value:'date',label:'По дате'}]} />
    <Checkbox size="s" label="Маленькая рамка" /><Slider aria-label="Значение" size="s" /><Range label="Диапазон" size="s" />
    <div class="aui-scrollbar scrolling"><p>Публичное оформление нативного скроллбара.</p></div>
    <Button label="Открыть шторку" onclick={() => sheetOpen = true} />
    <Drawer side="bottom" title="Подробности" bind:open={sheetOpen}><p>Нижняя шторка из установленного пакета.</p></Drawer>
    <div style="height:140px"><Background {pattern} paused /></div>
  </main>
</Theme>
<style>.host{color:navy;font-family:Arial}main{padding:24px;background:var(--bg)}h1{font-size:1.4em;font-weight:400}.scrolling{max-height:8rem;overflow:auto}</style>
