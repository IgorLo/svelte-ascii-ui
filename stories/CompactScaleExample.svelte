<script lang="ts">
  // Experiment decisions and production follow-up: CompactScale.review.md.
  import { Button, Checkbox, Field, IconButton, Input, NumberInput, Panel, RadioGroup, Select, Theme } from '../src/lib';
  import type { Palette } from '../src/lib';
  import { asciiFrame, palettes } from '../src/lib/theme';
  import { iconCandidates } from './icon-candidates';

  let { palette = 'phosphor' }: { palette?: Palette } = $props();
  let feedback = $state('');
  let selectedIcons = $state('pixelarticons');
  const icons = $derived(iconCandidates.find(candidate => candidate.id === selectedIcons) ?? iconCandidates[0]);
  const iconNames = ['plus', 'minus', 'down', 'close', 'refresh', 'info'] as const;
  const frame = $derived(asciiFrame(palettes[palette].muted, 1, 1.4));
  const accent = $derived(asciiFrame(palettes[palette].accent, 1, 1.4));
  const errorFrame = $derived(asciiFrame(palettes[palette].danger, 1, 1.4));
  const samples = [
    { id: 'current-s', title: 'Проба · S / 13 px', size: 's', description: 'Текст 14 → 13 px. Размер контролов сохранён.' },
    { id: 'compact', title: 'Проба · компакт / 12 px', size: 's', description: 'Текст 13 → 12 px. Компактные отступы и рисунок рамки сохранены.' },
    { id: 'current-m', title: 'Проба · M / 15 px', size: 'm', description: 'Текст 16 → 15 px. Крупные контролы сохранены.' },
  ] as const;
  const collections = [{ value: 'personal', label: 'Личная коллекция' }, { value: 'shared', label: 'Общая коллекция редакции' }];
  const modes = [{ value: 'draft', label: 'Сохранить как черновик' }, { value: 'review', label: 'Передать на проверку' }];
</script>

<Theme {palette}>
  <main lang="ru" style:--demo-frame={frame} style:--demo-accent={accent} style:--demo-error={errorFrame}
    style:--icon-plus={`url("${icons.icons.plus}")`} style:--icon-minus={`url("${icons.icons.minus}")`} style:--icon-down={`url("${icons.icons.down}")`}>
    <header>
      <p class="eyebrow">Сравнение масштаба</p>
      <h1>Меньше текст и отступы — удобнее ли форма?</h1>
      <p>Во всех трёх вариантах текст уменьшен на 1 px. Это проба: размеры S и M в библиотеке не меняются.</p>
      <p class="note">На узком экране текст полей остаётся 16 px; для касания высота целей — не меньше 44 px. Проверьте ввод, Tab и выбор стрелками.</p>
    </header>
    <section class="icon-review" aria-label="Выбор SVG-иконок">
      <h2>Иконки: выберите набор для формы ниже</h2>
      <p class="note">Оба набора — бесплатные SVG по MIT. Уведомления об авторстве сохранены. Новых зависимостей нет.</p>
      <div class="icon-candidates">
        {#each iconCandidates as candidate (candidate.id)}
          <Panel size="s">
            <h3>{candidate.label}</h3>
            <p class="note">{candidate.nativeSize} × {candidate.nativeSize} · {candidate.license}</p>
            <div class="icon-strip">
              {#each iconNames as name (name)}
                <span class="icon-cell"><span class="svg-icon" aria-hidden="true" style:--icon={`url("${candidate.icons[name]}")`} style:--icon-size={`${candidate.nativeSize}px`}></span><small>{name}</small></span>
              {/each}
            </div>
            <Button size="s" label={selectedIcons === candidate.id ? 'Выбран' : 'Посмотреть в форме'} aria-pressed={selectedIcons === candidate.id} onclick={() => selectedIcons = candidate.id} />
            <a href={candidate.source} target="_blank" rel="noreferrer">Исходники и лицензия</a>
          </Panel>
        {/each}
      </div>
    </section>
    <div class="comparison">
      {#each samples as sample (sample.id)}
        <section class={['sample', sample.id]} aria-label={sample.title} style:--demo-icon-size={`${icons.id === 'pixelarticons' ? sample.size === 'm' ? 24 : 18 : 18}px`}>
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
                <IconButton size={sample.size} label="Сведения о подборке" onclick={() => feedback = sample.title + ': подборка объединяет материалы одной темы.'}>
                  <span class="svg-icon" aria-hidden="true" style:--icon={`url("${icons.icons.info}")`}></span>
                </IconButton>
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
  .icon-review { margin-block-end: 24px; }
  .icon-candidates { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,24rem),1fr)); gap: 16px; margin-block-start: 12px; }
  .icon-strip { display: flex; flex-wrap: wrap; gap: 12px; margin-block: 16px; }
  .icon-cell { display: grid; place-items: center; grid-template-rows: 32px auto; gap: 4px; min-width: 48px; }
  .icon-cell small { font: 12px monospace; }
  .svg-icon { display: inline-block; width: var(--icon-size,var(--demo-icon-size)); height: var(--icon-size,var(--demo-icon-size)); background: currentColor; mask: var(--icon) center / contain no-repeat; flex: none; }
  .icon-candidates a { display: block; margin-block-start: 12px; font-size: 13px; color: var(--accent); }

  /* Story-only experiment. Internal selectors are not a supported consumer API. */
  .current-s { --demo-field-height: 39px; --demo-action-height: 37.5px; }
  .current-m { --demo-field-height: 48px; --demo-action-height: 48px; }
  .compact { --demo-field-height: 32px; --demo-action-height: 32px; }
  .current-s :global([data-size='s']) { --component-font: 13px; }
  .current-m :global([data-size='m']) { --component-font: 15px; }
  .current-s .preferences { font-size: 13px; }
  .current-m .preferences { font-size: 15px; }
  .sample :global(input.aui-control), .sample :global(select.aui-control) { min-height: var(--demo-field-height); }
  .sample :global(.aui-button) { min-height: var(--demo-action-height); }
  .sample :global(.mark.aui-control) { flex: 0 0 var(--choice-box); min-inline-size: var(--choice-box); inline-size: var(--choice-box); block-size: var(--choice-box); aspect-ratio: 1; }
  .sample :global(.inline > .aui-button) { flex: 0 0 var(--demo-field-height); inline-size: var(--demo-field-height); block-size: var(--demo-field-height); min-inline-size: var(--demo-field-height); min-block-size: var(--demo-field-height); padding: 0; display: grid; place-items: center; }
  .sample :global(.chevron) { inline-size: 1em; display: grid; place-items: center; line-height: 1; }
  .sample :global(.chevron) { font-size: 0; inline-size: var(--demo-icon-size); inset-inline-end: calc(var(--control-frame) + .75rem); }
  .sample :global(.chevron)::after { content: ''; inline-size: var(--demo-icon-size); block-size: var(--demo-icon-size); background: currentColor; mask: var(--icon-down) center / contain no-repeat; }
  .sample :global(.inline > .aui-button) { font-size: 0; }
  .sample :global(.inline > .aui-button > span) { display: none; }
  .sample :global(.inline > .aui-button)::after { content: ''; inline-size: var(--demo-icon-size); block-size: var(--demo-icon-size); background: currentColor; mask: var(--icon-plus) center / contain no-repeat; }
  .sample :global(.inline > .aui-button:first-child)::after { mask-image: var(--icon-minus); }
  .sample :global(.aui-icon-button > span) { transform: none; }
  .compact .preferences { font-size: 12px; gap: 10px; }
  .compact .actions, .compact .secondary-actions { gap: 8px; }
  .compact :global([data-size='s']) { --component-font: 12px; --control-height: 32px; --control-frame: 6px; --choice-box: 26px; --radio-font: 16px; --panel-inset: 10px; }
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
    .current-s { --demo-field-height: 42px; }
    .compact { --demo-field-height: 34.4px; }
    .sample :global(input.aui-control), .sample :global(select.aui-control) { font-size: 16px; }
  }
  @media (pointer: coarse) {
    .sample { --demo-field-height: 44px; --demo-action-height: 44px; }
    .current-m { --demo-field-height: 48px; --demo-action-height: 48px; }
    .compact :global(input.aui-control), .compact :global(select.aui-control), .compact :global(.aui-button) { min-height: 44px; }
    .compact :global(.aui-button) { min-inline-size: 44px; }
    .compact :global(.aui-icon-button) { min-width: 44px; }
  }
  @media (forced-colors: active) {
    .compact :global(.aui-control), .compact :global(.aui-button), .compact :global(.aui-frame) { border-image: none !important; }
    .svg-icon, .sample :global(.chevron)::after, .sample :global(.inline > .aui-button)::after { forced-color-adjust: none; background: CanvasText; }
  }
</style>
