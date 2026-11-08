<script lang="ts">
  import { Button, Checkbox, Field, IconButton, Input, NumberInput, Panel, RadioGroup, Select, Theme } from '../src/lib';
  import type { Palette } from '../src/lib';
  import { asciiFrame, palettes } from '../src/lib/theme';

  let { palette = 'phosphor' }: { palette?: Palette } = $props();
  let feedback = $state('');
  const frame = $derived(asciiFrame(palettes[palette].muted, 1, 1.4));
  const accent = $derived(asciiFrame(palettes[palette].accent, 1, 1.4));
  const errorFrame = $derived(asciiFrame(palettes[palette].danger, 1, 1.4));
  const samples = [
    { id: 'current-s', title: 'Сейчас · S', size: 's', description: 'Контролы 14 px. Исходные рамки и отступы.' },
    { id: 'compact', title: 'Проба · компактнее', size: 's', description: 'Контролы и подписи 13 px. Меньше отступы, рисунок рамки сохранён.' },
    { id: 'current-m', title: 'Для сравнения · M', size: 'm', description: 'Контролы 16 px. Крупный вариант остаётся без изменений.' },
  ] as const;
  const collections = [{ value: 'personal', label: 'Личная коллекция' }, { value: 'shared', label: 'Общая коллекция редакции' }];
  const modes = [{ value: 'draft', label: 'Сохранить как черновик' }, { value: 'review', label: 'Передать на проверку' }];
</script>

<Theme {palette}>
  <main lang="ru" style:--demo-frame={frame} style:--demo-accent={accent} style:--demo-error={errorFrame}>
    <header>
      <p class="eyebrow">Сравнение масштаба</p>
      <h1>Меньше текст и отступы — удобнее ли форма?</h1>
      <p>Средний вариант — только проба. Размеры S и M в библиотеке не меняются.</p>
      <p class="note">На узком экране текст полей остаётся 16 px; для касания высота целей — не меньше 44 px. Проверьте ввод, Tab и выбор стрелками.</p>
    </header>
    <div class="comparison">
      {#each samples as sample (sample.id)}
        <section class={['sample', sample.id]} aria-label={sample.title}>
          <h2>{sample.title}</h2>
          <p class="description">{sample.description}</p>
          <Panel size={sample.size}>
            <form class={['preferences', sample.size]} onsubmit={(event) => { event.preventDefault(); feedback = sample.title + ': пример сохранения.'; }}>
              <h3>Новая подборка</h3>
              <Field label="Название подборки" hint="Название видно другим участникам.">
                {#snippet children(control)}<Input {...control} size={sample.size} defaultValue="Книги на выходные" />{/snippet}
              </Field>
              <Field label="Коллекция">
                {#snippet children(control)}<Select {...control} size={sample.size} options={collections} value="personal" />{/snippet}
              </Field>
              <Field label="Количество материалов">
                {#snippet children(control)}<NumberInput {...control} size={sample.size} value={12} min={1} max={50} decrementLabel="Уменьшить количество" incrementLabel="Увеличить количество" />{/snippet}
              </Field>
              <Field label="Электронная почта редактора" error="Укажите полный адрес: имя и домен.">
                {#snippet children(control)}<Input {...control} size={sample.size} type="email" defaultValue="reader@" />{/snippet}
              </Field>
              <Checkbox size={sample.size} label="Получать уведомления об изменениях" />
              <RadioGroup size={sample.size} label="После сохранения" options={modes} value="draft" />
              <div class="actions">
                <Button size={sample.size} type="submit" variant="primary" label="Сохранить" />
                <IconButton size={sample.size} label="Сведения о подборке" glyph="?" onclick={() => feedback = sample.title + ': подборка объединяет материалы одной темы.'} />
              </div>
              <div class="secondary-actions">
                <Button size={sample.size} label="Опубликовать" disabled />
                <Button size={sample.size} label="Проверка" loading />
              </div>
            </form>
          </Panel>
        </section>
      {/each}
    </div>
    <p class="feedback" role="status">{feedback}</p>
  </main>
</Theme>

<style>
  main { padding: clamp(12px, 2vw, 24px); background: var(--bg); min-block-size: 100vh; }
  header { max-inline-size: 65rem; margin-block-end: 24px; }
  h1 { font-size: 1.4rem; line-height: 1.4; margin-block: 8px 12px; }
  h2, h3 { font-size: 1em; line-height: 1.5; margin: 0; }
  p { margin: 0; }
  .eyebrow, .description, .note { color: var(--muted); font-size: .875rem; }
  .note { margin-block-start: 12px; }
  .comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); align-items: start; gap: 24px; }
  .sample { min-inline-size: 0; overflow-wrap: anywhere; }
  .description { margin-block: 8px 16px; }
  .preferences { display: grid; gap: 12px; }
  .preferences.m { gap: 24px; }
  .actions, .secondary-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
  .feedback { margin-block-start: 16px; }

  /* Story-only experiment. Internal selectors are not a supported consumer API. */
  .compact .preferences { font-size: 13px; gap: 10px; }
  .compact .actions, .compact .secondary-actions { gap: 8px; }
  .compact :global([data-size='s']) { --component-font: 13px; --control-height: 32px; --control-frame: 6px; --choice-box: 26px; --radio-font: 16px; --panel-inset: 10px; }
  .compact :global(.aui-control), .compact :global(.aui-button), .compact :global(.aui-frame) { border-image-width: 9px; }
  .compact :global(input.aui-control), .compact :global(select.aui-control), .compact :global(.aui-button) { padding-inline: .75ch; line-height: 1.4; }
  .compact :global(select.aui-control) { padding-inline-end: 2.5em; }
  .compact :global(.aui-button) { padding-block: 0; gap: 6px; }
  .compact :global(.aui-icon-button) { padding: 0; }
  .compact :global(.aui-control:not(:focus-visible):not([aria-invalid='true'])) { border-image-source: var(--demo-frame); }
  .compact :global(.aui-button:not(:focus-visible)) { border-image-source: var(--demo-frame); }
  .compact :global(.aui-button[data-variant='primary']:not(:focus-visible)) { border-image-source: var(--demo-accent); }
  .compact :global(.aui-control[aria-invalid='true']:not(:focus-visible)) { border-image-source: var(--demo-error); }
  .compact :global(.field) { gap: 6px; }
  @media (hover: hover) {
    .compact :global(.aui-control:enabled:hover:not(:focus-visible):not([aria-invalid='true'])),
    .compact :global(.aui-button:enabled:hover:not(:focus-visible)) { border-image-source: var(--demo-accent); }
  }
  @media (max-width: 760px) {
    .compact :global(input.aui-control), .compact :global(select.aui-control) { font-size: 16px; }
  }
  @media (pointer: coarse) {
    .compact :global(input.aui-control), .compact :global(select.aui-control), .compact :global(.aui-button) { min-height: 44px; }
    .compact :global(.aui-button) { min-inline-size: 44px; }
    .compact :global(.aui-icon-button) { min-width: 44px; }
  }
  @media (forced-colors: active) {
    .compact :global(.aui-control), .compact :global(.aui-button), .compact :global(.aui-frame) { border-image: none !important; }
  }
</style>
