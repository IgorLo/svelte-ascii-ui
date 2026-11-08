<!-- THROWAWAY: one specimen for comparing fonts and ASCII drawing geometry. -->
<script lang="ts">
  import WavesExample from './WavesExample.svelte';
  import ArticleExample from './ArticleExample.svelte';
  import SpecimenSet from './SpecimenSet.svelte';
  const variant = 'B';
  const fonts = [
    { name: 'Cascadia Code', family: "'Cascadia Code Variable'", note: 'Мягкий технический характер · кириллица и латиница' },
    { name: 'DotGothic16', family: "'DotGothic16 UI'", note: 'Пиксельный рисунок · широкие формы латиницы и кириллицы · 16 px' },
    { name: 'IBM Plex Mono', family: "'IBM Plex Mono'", note: 'Более механический рисунок · кириллица и латиница' },
    { name: 'PT Mono', family: "'PT Mono'", note: 'Сдержанный машинописный рисунок · кириллица и латиница' },
    { name: 'JetBrains Mono', family: "'JetBrains Mono'", note: 'Чёткие открытые формы · кириллица и латиница' },
    { name: 'Space Mono', family: "'Space Mono'", note: 'Геометрический ретрохарактер · латиница; кириллица остаётся Cascadia' },
    { name: 'Courier Prime', family: "'Courier Prime'", note: 'Машинописные засечки · латиница; кириллица остаётся Cascadia' },
  ];
  let fontName = $state('DotGothic16');
  const selectedFont = $derived(fonts.find((font) => font.name === fontName)!);
  let palette = $state('phosphor');
  let size = $state('16');
  let panelFill = $state(true);
  let grid = $state(false);
  const frameColors: Record<string, string[]> = {
    phosphor: ['#a7b29e', '#c4ed83', '#ffb6a8'],
    paper: ['#5d6556', '#465d36', '#993e2e'],
    plum: ['#b9a7bd', '#e6b1d7', '#ffb5a4'],
  };
  // Fixed glyph geometry: independent of the text font, no external SVG/font dependency.
  function asciiFrame(color: string, opacity = 1, stroke = 1) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${stroke}" d="M3 6h6M6 3v6M27 6h6M30 3v6M3 30h6M6 27v6M27 30h6M30 27v6M15 6h6M15 30h6M6 15v6M30 15v6"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
</script>


<div class={["specimen", { "grid-visible": grid }]} data-variant={variant} data-palette={palette} data-font={fontName} data-panel-fill={panelFill} style:--text-font={`${selectedFont.family}, "Cascadia Code Variable", monospace`} style:--font-size={`${size}px`} style:--ascii-chevron={`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12"><path d="m2 3 6 6 6-6" fill="none" stroke="${frameColors[palette][0]}" stroke-width="1.5"/></svg>`)}")`} style:--ascii-focus={asciiFrame(palette === 'paper' ? '#2e332c' : palette === 'plum' ? '#ede1e4' : '#e2e6d9', 1, 2.2)} style:--ascii-frame={asciiFrame(frameColors[palette][0])} style:--ascii-muted={asciiFrame(frameColors[palette][0], 0.48)} style:--ascii-button={asciiFrame(frameColors[palette][0], 0.85)} style:--ascii-accent={asciiFrame(frameColors[palette][1])} style:--ascii-error={asciiFrame(frameColors[palette][2])}>
  <a class="skip-link" href="#catalog">К компонентам</a>
  <div class="topline"><span>ASCII / UI</span><span class="topline-note">ЛАБОРАТОРИЯ ИНТЕРФЕЙСА</span><span>SPECIMEN 001 <span class="live-dot" aria-hidden="true">●</span></span></div>
  <header class="masthead">
    <div class="heading-copy">
      <p class="eyebrow">НЕБОЛЬШОЙ НАБОР / БОЛЬШЕ ВОЗМОЖНОСТЕЙ</p>
      <h1>Символы.<br /> Система.<span class="cursor" aria-hidden="true">_</span></h1>
      <p class="intro">Знакомые элементы. Другой характер.<br />Живой образец будущей ASCII-библиотеки.</p>
    </div>
    <div class="identity" aria-hidden="true"><pre>     ┌──────────────┐
     │  ░░  ▒▒  ██  │
 ┌───┤              ├───┐
 │   │  A S C I I   │   │
 │   └──────┬───────┘   │
 └──────────┴───────────┘
       FORM FOLLOWS
         CHARACTER</pre></div>
    <div class="edition"><span>ВИЗУАЛЬНОЕ ИССЛЕДОВАНИЕ</span><strong>Одна витрина / все элементы</strong><span>v.0.0 — в поиске формы</span></div>
  </header>

  <section class="control-desk" aria-label="Настройки образца">
    <label>ПАЛИТРА<select bind:value={palette}><option value="phosphor">01 · Phosphor</option><option value="paper">02 · Paper</option><option value="plum">03 · Plum</option></select></label>
    <label>ГАРНИТУРА<select bind:value={fontName}>{#each fonts as font (font.name)}<option>{font.name}</option>{/each}</select></label>
    <label>РАЗМЕР<select bind:value={size}><option value="14">14 px</option><option value="15">15 px</option><option value="16">16 px</option><option value="18">18 px</option></select></label>
    <label class="grid-toggle"><input type="checkbox" bind:checked={panelFill} /> Фон панелей</label>
    <label class="grid-toggle"><input type="checkbox" bind:checked={grid} /> Показать сетку</label>
    <nav class="size-links" aria-label="Размеры компонентов"><a href="#size-s">S · компактные ↓</a><a href="#size-m">M · обычные ↓</a><a href="#article">Текст и изображения ↓</a></nav><span class="grid-info">СНАЧАЛА S · НИЖЕ M</span>
  </section>

  <div class="font-specimen"><p>{selectedFont.note}</p><p class="font-proof">Aa Bb Gg Mm Rr 0123456789 · ( ) [ ] + − ×</p><p class="font-proof">Аа Бб Дд Жж Фф Яя · Съешь ещё этих мягких булок.</p><p class="hint">Меняется только текст. Рамки и служебные символы сохраняют свою геометрию.</p></div>

  <main id="catalog"><WavesExample pageBackground /><SpecimenSet componentSize="s" /><SpecimenSet componentSize="m" /><ArticleExample /></main>
  <footer>ASCII / UI · S + M</footer>
</div>

<style>
  .specimen { position: relative; isolation: isolate; }
</style>
