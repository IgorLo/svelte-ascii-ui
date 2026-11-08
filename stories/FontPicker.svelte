<script lang="ts">
  import { Button, Select, Theme } from '../src/lib';
  import type { Palette } from '../src/lib';
  import { fontCandidates } from './font-candidates';
  import './font-candidates/fonts.css';
  const licenses = import.meta.glob('./font-candidates/*/LICENSE.txt', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
  const baselineLicense = new URL('../src/lib/fonts/OFL-DotGothic16.txt', import.meta.url).href;

  const baseline = { id: 'dotgothic16', label: 'DotGothic16 — текущий', family: 'DotGothic16 UI', cyrillic: true, license: 'OFL-1.1', source: 'https://github.com/google/fonts/tree/main/ofl/dotgothic16', notes: 'Текущий ориентир для сравнения.', recommendedSize: 16 };
  const fonts = [baseline, ...fontCandidates];
  let { palette = 'phosphor', font = $bindable("'DotGothic16 UI', monospace") }: { palette?: Palette; font?: string } = $props();
  let selectedId = $state('dotgothic16');
  let shortlist = $state<string[]>([]);
  const selected = $derived(fonts.find(item => item.id === selectedId) ?? baseline);
  const stack = (family: string) => `'${family}', 'DotGothic16 UI', monospace`;
  function choose(id: string) { selectedId = id; font = stack((fonts.find(item => item.id === id) ?? baseline).family); }
</script>

<Theme {palette}>
  <section class="font-review" aria-label="Сравнение шрифтов">
    <h2>Шрифт всей формы</h2>
    <div class="tools">
      <Select size="s" aria-label="Шрифт формы" value={selectedId} options={fonts.map(item => ({ value: item.id, label: item.label + (item.cyrillic ? ' · АБВ' : ' · Latin') }))} onchange={(event) => choose(event.currentTarget.value)} />
      <Button size="s" label={shortlist.includes(selectedId) ? 'Убрать из сравнения' : 'Добавить в сравнение'} aria-pressed={shortlist.includes(selectedId)} onclick={() => shortlist = shortlist.includes(selectedId) ? shortlist.filter(id => id !== selectedId) : [...shortlist, selectedId]} />
      <Button size="s" label="Вернуть DotGothic16" onclick={() => choose('dotgothic16')} />
    </div>
    <p class="note">Выбор меняет шрифт на странице. Рамки и SVG-иконки сохраняют свои размеры. Файлы загружаются локально и используются только в демо.</p>
    <p class="note" role="status">{selected.label}: {selected.cyrillic ? 'Есть кириллица.' : 'Кириллицы нет или она неполная: русские буквы будут из запасного DotGothic16.'} {selected.notes}</p>
    <p class="note">Образец — {selected.recommendedSize} px. В формах ниже остаются размеры 12 / 13 / 15 px для сравнения плотности.</p>
    <p class="sample" style:font-family={stack(selected.family)} style:font-size={`${selected.recommendedSize}px`}>Aa Bb 0123456789 · Hello, pixel world!<br />Съешь ещё этих мягких французских булок. Ёжик № 12.</p>
    <a href={selected.source} target="_blank" rel="noreferrer">Источник</a>
    · <a href={licenses[`./font-candidates/${selected.id}/LICENSE.txt`] ?? baselineLicense} target="_blank" rel="noreferrer">Лицензия: {selected.license}</a>
    {#if shortlist.length}
      <div class="shortlist">
        {#each shortlist as id (id)}
          {@const item = fonts.find(candidate => candidate.id === id)!}
          <article>
            <h3>{item.label}</h3>
            <p class="sample" style:font-family={stack(item.family)}>Hello, pixel world! 0123456789<br />Книги на выходные · Ёжик</p>
            {#if !item.cyrillic}<p class="note">Русская строка использует запасной шрифт.</p>{/if}
            <div class="actions"><Button size="s" label="Применить к форме" onclick={() => choose(id)} /><Button size="s" label="Убрать" aria-label={'Убрать ' + item.label + ' из сравнения'} onclick={() => shortlist = shortlist.filter(value => value !== id)} /></div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</Theme>

<style>
  .font-review { margin-block: 24px; padding: 16px; border: 1px dashed var(--muted); }
  h2, h3 { margin: 0 0 12px; font-size: 1rem; }
  .tools { display: grid; grid-template-columns: minmax(0,1fr) auto auto; gap: 12px; align-items: start; }
  .note { color: var(--muted); font-size: .875rem; margin-block: 12px; }
  .sample { font-size: 16px; line-height: 1.6; font-variant-east-asian: normal; overflow-wrap: anywhere; }
  a { color: var(--accent); font-size: .875rem; }
  .shortlist { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,22rem),1fr)); gap: 20px; margin-block-start: 20px; }
  article { border-block-start: 1px dashed var(--muted); padding-block-start: 16px; min-width: 0; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  @media(max-width:900px) { .tools { grid-template-columns: minmax(0,1fr); } }
</style>
