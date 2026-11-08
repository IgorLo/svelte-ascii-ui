<script lang="ts">
  import { onMount } from 'svelte';
  import AsciiBackground from './lib/effects/Background.svelte';
  import { createAmbientWaves, createSineWaves, type AsciiPattern } from './lib/effects/ascii-patterns';
  let { pageBackground = false }: { pageBackground?: boolean } = $props();
  let cellWidth = $state(14), cellHeight = $state(14), speed = $state(.35), waveScale = $state(1), opacity = $state(.2);
  let color = $state('#70cfff'), characters = $state(' .:-=+*#'), paused = $state(false), overlay = $state(true);
  let preset = $state('sine'), angle = $state(-25), amplitude = $state(100), wavelength = $state(500), spacing = $state(500);
  let fps = $state(12);
  let wavelengthVariability = $state(.5);
  let waveRandomness = $state(.9), seed = $state(42);
  onMount(() => {
    if (pageBackground) seed = crypto.getRandomValues(new Int32Array(1))[0];
  });
  const customPattern: AsciiPattern = ({ column, row, time }) => ({
    character: (column + row) % 2 ? '+' : '.',
    opacity: .15 + .85 * (Math.sin(column * .25 + row * .4 - time) + 1) / 2,
  });
  let pattern = $derived(preset === 'custom' ? customPattern : preset === 'ambient'
    ? createAmbientWaves({ scale: waveScale, characters })
    : createSineWaves({ angle, amplitude, wavelength, wavelengthVariability, waveRandomness, seed, spacing, characters }));
</script>

<div class="catalog wave-catalog" id="waves">
  {#if pageBackground}
    <div class="page-background" aria-hidden="true"><AsciiBackground {cellWidth} {cellHeight} {speed} {color} {opacity} {pattern} {paused} {fps} /></div>
  {/if}
  <section class="panel feedback-panel">
    <div class="section-heading"><h2>ASCII-волны</h2><span class="kind">BACKGROUND</span></div>
    {#if pageBackground}
      <p class="hint">Эти настройки управляют фоном всей страницы. При перезагрузке меняется только seed рисунка. Фон остаётся на месте при прокрутке.</p>
    {:else}
    <div class="wave-preview">
      <div class="wave-layer"><AsciiBackground {cellWidth} {cellHeight} {speed} {color} {opacity} {pattern} {paused} {fps} /></div>
      {#if overlay}<div class="wave-copy"><p class="eyebrow">ТИХОЕ ДВИЖЕНИЕ</p><h3>Место для следующей идеи.</h3><p>Символы меняются. Содержимое остаётся главным.</p></div>{/if}
    </div>
    {/if}
    <div class="wave-controls">
      <label>Ширина ячейки · px<input type="number" min="6" max="64" bind:value={cellWidth} /></label>
      <label>Высота ячейки · px<input type="number" min="8" max="64" bind:value={cellHeight} /></label>
      <label>Скорость<input type="number" min="0" max="2" step=".05" bind:value={speed} /></label>
      <label>Частота кадров<select bind:value={fps}><option value={12}>12 · по умолчанию</option><option value={24}>24 · плавнее</option><option value={30}>30 · плавнее</option></select></label>
      <label>Прозрачность · 0–1<input type="number" min="0" max="1" step=".05" bind:value={opacity} /></label>
      <label>Один цвет<input type="color" bind:value={color} /></label>
    </div>
    <h3>Паттерн и его параметры</h3>
    <div class="wave-controls">
      <label class="wave-characters">Паттерн<select bind:value={preset}><option value="sine">Наклонные синусоиды</option><option value="ambient">Мягкое переливание</option><option value="custom">Своя функция · точки и плюсы</option></select></label>
      {#if preset === 'ambient'}<label>Масштаб волн<input type="number" min=".15" max="4" step=".1" bind:value={waveScale} /></label>{/if}
      {#if preset === 'sine'}
        <label>Угол · градусы<input type="number" min="-180" max="180" bind:value={angle} /></label>
        <label>Амплитуда · px<input type="number" min="0" max="160" bind:value={amplitude} /></label>
        <label>Длина волны · px<input type="number" min="40" max="800" bind:value={wavelength} /></label>
        <label>Вариативность длины · 0–1<input type="number" min="0" max="1" step=".05" bind:value={wavelengthVariability} /></label>
        <label>Хаотичность между волнами · 0–1<input type="number" min="0" max="1" step=".05" bind:value={waveRandomness} /></label>
        <label>Seed · рисунок<input type="number" step="1" bind:value={seed} /></label>
        <label>Интервал полос · px<input type="number" min="20" max="300" bind:value={spacing} /></label>
        <p class="hint wave-characters">Хаотичность задаёт разное смещение соседних волн. Seed выбирает рисунок, который сохраняется при движении. При хаотичности 0 случайные смещения отключены.</p>
      {/if}
      {#if preset !== 'custom'}<label class="wave-characters">Символы · от редких к плотным<input bind:value={characters} spellcheck="false" /></label>{/if}
    </div>
    <div class="sample-row"><button aria-pressed={paused} onclick={() => paused = !paused}>{paused ? 'Продолжить' : 'Пауза'}</button>{#if !pageBackground}<label class="check-label"><input type="checkbox" bind:checked={overlay} /> Текст поверх фона</label>{/if}</div>
    <p class="hint">Размер сетки задаётся в пикселях на ячейку. Фон прозрачный. При уменьшении движения в системе остаётся неподвижный рисунок.</p>
  </section>
</div>

<style>
  .page-background { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
  .wave-catalog { display: block; width: 100%; max-width: 144ch; margin: 2em auto 4em; }
  .wave-preview { position: relative; min-height: 300px; display: grid; align-items: center; isolation: isolate; background: var(--bg); }
  .wave-layer { position: absolute; inset: 0; z-index: -1; overflow: hidden; }
  .wave-copy { padding: 2em; max-width: 44em; }
  .wave-copy h3 { font-size: clamp(1.3em,3vw,2em); line-height: 1.4; }
  .wave-copy p { max-width: 34em; }
  .wave-controls { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 1em; margin-block: 1.5em; }
  .wave-controls label { min-width: 0; font-size: .8em; }
  .wave-characters { grid-column: 1 / -1; }
  @media(max-width:760px) { .wave-controls { grid-template-columns: repeat(2,minmax(0,1fr)); } .wave-preview { min-height: 260px; } .wave-copy { padding: 1em; } }
  @media(max-width:420px) { .wave-controls { grid-template-columns: minmax(0,1fr); } }
</style>
