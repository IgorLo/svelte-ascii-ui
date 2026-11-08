<script lang="ts">
  // Temporary side-by-side review for surface roles; no library defaults change.
  import { Theme, Panel, Field, Input, Textarea, Select, Button, Progress, Checkbox } from '../src/lib';
  import type { Palette, Size } from '../src/lib';
  let palette = $state<Palette>('phosphor');
  let size = $state<Size>('m');
  let fields = $state(true);
  let actions = $state(true);
  let tracks = $state(true);
  let title = $state('Книги на выходные');
  let collection = $state('personal');
  let message = $state('');
  const options = [{ value: 'personal', label: 'Личная коллекция' }, { value: 'shared', label: 'Общая коллекция' }];
</script>

<Theme {palette}>
  <main lang="ru">
    <header>
      <p class="eyebrow">Проба поверхностей · issues #7 / #8</p>
      <h1>Текущий вид и предлагаемое изменение</h1>
      <p>Одинаковые компоненты и данные. Справа меняется только фон: геометрия, шрифт, рамки и семантика остаются прежними.</p>
      <div class="settings">
        <Field label="Палитра">{#snippet children(control)}<Select {...control} size="s" value={palette} options={[{value:'phosphor',label:'Phosphor'},{value:'paper',label:'Paper'},{value:'plum',label:'Plum'}]} onchange={event => palette = event.currentTarget.value as Palette} />{/snippet}</Field>
        <Field label="Размер">{#snippet children(control)}<Select {...control} size="s" value={size} options={[{value:'s',label:'S · компактный'},{value:'m',label:'M · средний'},{value:'l',label:'L · крупный'}]} onchange={event => size = event.currentTarget.value as Size} />{/snippet}</Field>
      </div>
      <div class="toggles" aria-label="Предлагаемые изменения">
        <Checkbox size="s" label="Выделить фон полей" bind:checked={fields} />
        <Checkbox size="s" label="Залить primary-кнопки" bind:checked={actions} />
        <Checkbox size="s" label="Показать дорожку Progress" bind:checked={tracks} />
      </div>
      <p class="note">Наведи курсор или нажимай Tab: hover и focus работают по-настоящему. Переключатели меняют только правую колонку.</p>
    </header>

    {#snippet example(area: string)}
      <div class="example">
        <Field label="Название подборки" hint="Поле редактируется одновременно в обоих вариантах.">{#snippet children(control)}<Input {...control} {size} bind:value={title} />{/snippet}</Field>
        <Field label="Коллекция">{#snippet children(control)}<Select {...control} {size} options={options} bind:value={collection} />{/snippet}</Field>
        <Field label="Описание">{#snippet children(control)}<Textarea {...control} {size} rows={2} placeholder="Несколько слов о подборке" />{/snippet}</Field>
        <div class="row"><Button {size} variant="primary" icon="plus" label="Применить" onclick={() => message = `${area}: настройки применены (демонстрация).`} /><Button {size} label="Отмена" onclick={() => message = `${area}: отмена (демонстрация).`} /></div>
        <div class="row"><Button {size} variant="primary" label="Недоступно" disabled /><Button {size} variant="primary" label="Загрузка" loading /></div>
        <div class="progress-list">
          {#each [0,.4,1] as value (value)}
            <div><p class="note">{Math.round(value*100)}%</p><Progress {size} {value} label={`${area}: подготовка файлов ${Math.round(value*100)}%`} /></div>
          {/each}
        </div>
      </div>
    {/snippet}

    <div class="comparison">
      {#each [false,true] as proposed (proposed)}
        <section aria-label={proposed ? 'Предлагаемый вариант' : 'Текущий вариант'} class={{ proposal: proposed, fields, actions, tracks }}>
          <h2>{proposed ? 'Предлагаемый вариант' : 'Сейчас в библиотеке'}</h2>
          <p class="description">{proposed ? 'Поля: 7% text + background. Primary: 10% accent. Дорожка: 6% text. Заливка внутри ASCII-рамки.' : 'Поля совпадают с background. Кнопки и дорожка прозрачны в покое; hover и focus уже добавляют фон.'}</p>
          <Theme {palette} {size}>
            <div class="on-page">
              <h3>На фоне страницы</h3>
              {@render example(proposed ? 'Предложение / страница' : 'Текущий / страница')}
            </div>
            <Panel {size} title="Та же форма внутри Panel">
              {@render example(proposed ? 'Предложение / Panel' : 'Текущий / Panel')}
            </Panel>
            <div class="states">
              <h3>Ошибки и недоступные поля</h3>
              <Field label="Почта" error="Укажите полный адрес.">{#snippet children(control)}<Input {...control} {size} defaultValue="reader@" />{/snippet}</Field>
              <Input {size} aria-label="Недоступное поле" value="Недоступно" disabled />
              <Input {size} aria-label="Поле только для чтения" value="Только чтение" readonly />
              <Select {size} aria-label="Загрузка коллекций" options={[]} loading />
            </div>
          </Theme>
        </section>
      {/each}
    </div>
    <p role="status">{message}</p>
    <footer>Это визуальный эксперимент. Отдельных настроек поверхности в API пока нет; изменения не опубликованы.</footer>
  </main>
</Theme>

<style>
  main { background: var(--bg); min-height: 100vh; padding: clamp(16px,3vw,40px); }
  header { max-width: 78rem; margin: 0 auto 2rem; }
  h1 { font-size: clamp(1.4rem,3vw,2rem); line-height: 1.4; }
  h2 { font-size: 1.25rem; margin: 0 0 .75rem; }
  h3 { font-size: 1em; margin: 0 0 1rem; }
  .eyebrow, .note, .description, footer { color: var(--muted); }
  .note { font-size: .875em; margin: .5rem 0; }
  .description { min-height: 6em; margin: 0 0 1.5rem; }
  .settings { display: grid; grid-template-columns: repeat(2,minmax(0,16rem)); gap: 1rem; margin-block: 1.5rem; }
  .toggles, .row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
  .comparison { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: clamp(20px,4vw,56px); max-width: 90rem; margin-inline: auto; }
  section { min-width: 0; }
  .example, .states { display: grid; gap: 1rem; }
  .on-page { padding-bottom: 2rem; }
  .states { margin-top: 2rem; }
  .progress-list { display: grid; gap: .75rem; }
  footer { margin-block: 2rem; font-size: .875rem; }
  /* Temporary overrides are intentionally confined to the proposed column. */
  .proposal.fields :global(input.aui-control), .proposal.fields :global(select.aui-control), .proposal.fields :global(textarea.aui-control) {
    background-color: color-mix(in srgb,var(--text) 7%,var(--bg)); background-clip: padding-box;
  }
  .proposal.actions :global(.aui-button[data-variant='primary']) {
    background-color: color-mix(in srgb,var(--accent) 10%,var(--bg)); background-clip: padding-box;
  }
  .proposal.tracks :global(.ascii-progress) {
    background-color: color-mix(in srgb,var(--text) 6%,var(--bg)); background-clip: padding-box;
  }
  @media(hover:hover) {
    .proposal.fields :global(.aui-control:enabled:not([readonly]):hover:not(:focus-visible)) { background-color: color-mix(in srgb,var(--text) 10%,var(--bg)); }
    .proposal.actions :global(.aui-button[data-variant='primary']:enabled:hover:not(:focus-visible)) { background-color: color-mix(in srgb,var(--accent) 16%,var(--bg)); }
  }
  .proposal.fields :global(.aui-control:focus-visible) { background-color: color-mix(in srgb,var(--text) 12%,var(--bg)); }
  .proposal.actions :global(.aui-button[data-variant='primary']:focus-visible) { background-color: color-mix(in srgb,var(--accent) 18%,var(--bg)); }
  @media(max-width:760px) { .comparison { grid-template-columns: minmax(0,1fr); } .description { min-height: 0; } }
  @media(forced-colors:active) { .proposal :global(.aui-control), .proposal :global(.aui-button), .proposal :global(.ascii-progress) { background-color: Canvas; } }
</style>
