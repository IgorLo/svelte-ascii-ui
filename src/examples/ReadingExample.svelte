<script lang="ts">
  import { Article, Badge, Checkbox, Field, Input, Link, Panel, Switch, Theme, type Palette } from '../lib';
  let { palette = 'paper', readable = $bindable(true) }: { palette?: Palette; readable?: boolean } = $props();
  const textStyle = $derived(readable ? '--font-size:1.125rem;--text-weight:400;--article-font-size:1.09375rem;--article-line-height:1.6' : '');
</script>

<Theme {palette} style={textStyle}>
  <div class="reading-example">
    <div class="reading-toolbar"><Switch label="Более крупный текст и Regular 400" bind:checked={readable} /><span>{readable ? 'Текст 18px · справка 17.5px' : 'Текст 16px · справка 14px'} · контролы S</span></div>
    <p>Настройка читаемого текста не меняет размеры элементов плотной формы.</p>
    <div class="reading-layout">
      <Panel title="Настройки" size="s">
        <div class="settings">
          <Field label="Поиск материалов">{#snippet children(control)}<Input {...control} size="s" placeholder="Название или автор" />{/snippet}</Field>
          <Checkbox size="s" label="Только проверенные источники" checked />
          <Checkbox size="s" label="Показывать архивные материалы с длинными описаниями" />
          <Checkbox size="s" label="Получать уведомления" indeterminate />
        </div>
      </Panel>
      <Article style="max-width:68ch">
        <h2>Как выбрать материал</h2>
        <p>Сначала сравните полноту данных, дату обновления и доступность источников. Число помогает оценить результат, а короткое пояснение раскрывает его смысл.</p>
        <dl class="metrics"><div><dt>Полнота</dt><dd>82 из 100</dd></div><div><dt>Проверено</dt><dd>24 источника</dd></div></dl>
        <p><Badge size="inherit" tone="success" label="Данные проверены" /></p>
        <p><Link size="inherit" href="#reading-sources">Источник данных</Link> · <time datetime="2026-11-10">10 ноября 2026</time></p>
        <h3>Список для проверки</h3>
        <ul><li>Название и автор соответствуют записи.</li><li>Источник доступен и содержит пояснение к показателям.</li><li>Длинная кириллическая подпись переносится без потери смысла.</li></ul>
        <div class="table-wrap"><table><caption>Сводка материалов</caption><thead><tr><th scope="col">Материал</th><th scope="col">Статус</th></tr></thead><tbody><tr><td>Открытые данные</td><td>Проверены</td></tr><tr><td>Историческая справка</td><td>Требует обновления</td></tr></tbody></table></div>
        <h3 id="reading-sources">Подробная справка</h3>
        <p>Для чтения подряд полезна отдельная шкала текста. Размер окна, кнопок и переключателей остаётся независимым от размера абзацев. Ссылка на источник и дата рядом с ней используют одинаковый размер, а статус остаётся понятным без опоры только на цвет.</p>
        <p>Существующие компактные размеры подходят для коротких подписей инструментов. Для длинной справки попробуйте 16–18px и Regular 400, проверьте переносы на узком экране и увеличение в браузере. Конкретный размер зависит от шрифта и содержания.</p>
      </Article>
    </div>
  </div>
</Theme>

<style>
  .reading-example { padding: 20px; background: var(--bg); min-width: 0; }
  .reading-toolbar { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
  .reading-toolbar > span { color: var(--muted); font-size: .875rem; }
  .reading-layout { display: grid; grid-template-columns: minmax(0, 18rem) minmax(0, 1fr); gap: 24px; align-items: start; }
  .settings { display: grid; gap: 12px; }
  .metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .metrics dt { color: var(--muted); }
  .metrics dd { margin: 0; font-size: 1.25em; font-weight: 600; }
  p { overflow-wrap: anywhere; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: start; vertical-align: top; padding: .5em; border-bottom: 1px solid var(--muted); overflow-wrap: anywhere; }
  caption { text-align: start; font-weight: 600; }
  @media (max-width: 760px) { .reading-layout { grid-template-columns: minmax(0, 1fr); } }
</style>
