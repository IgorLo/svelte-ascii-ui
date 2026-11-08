<script lang="ts">
  import AsciiDialog from './AsciiDialog.svelte';
  import './extended-examples.css';
  let imageOpen = $state(false);
</script>

<div class="catalog article-catalog">
<section class="panel feedback-panel extended-demo" id="article">
  <div class="section-heading"><h2>Текст и изображения</h2><span class="kind">ARTICLE / FIGURE</span></div>
  <div class="article-demo-container">
  <article class="article-example"><p class="eyebrow">ДНЕВНИК / 07</p><h3>Тишина между символами</h3><p class="article-lead">Интерфейс начинается с ритма. Отступ даёт тексту место, а рамка объединяет связанные вещи.</p><p>Обычный текст, <strong>важное выделение</strong>, <em>небольшой акцент</em> и <a href="#s-navigation">ссылка на соседний раздел</a>. Текст свободно переносится и остаётся выделяемым.</p><blockquote><p>Хороший интерфейс оставляет место для содержания.</p><footer>— Заметка из лаборатории</footer></blockquote>
    <aside class="article-callout" aria-label="Важно"><strong>[!] Важно</strong><p>Цвет дополняет смысл. Подпись и символ сохраняют его даже без цвета.</p></aside>
    <figure><button class="image-trigger" aria-label="Увеличить иллюстрацию: горы и восход" onclick={() => imageOpen = true}><img src="/terminal-landscape.svg" alt="Пиксельные горы под восходящим солнцем на тёмном фоне" width="960" height="480" /></button><figcaption>01 / Утро в терминале. Нажмите на изображение, чтобы увеличить.</figcaption></figure>
    <small>Подписи и дополнительная информация используют спокойный тон, сохраняя читаемость.</small>
  </article>
  </div>
  <AsciiDialog bind:open={imageOpen} title="Утро в терминале" size="l"><img class="expanded-image" src="/terminal-landscape.svg" alt="Пиксельные горы под восходящим солнцем на тёмном фоне" width="960" height="480" />{#snippet footer()}<span class="hint">Иллюстрация / пиксельный пейзаж</span>{/snippet}</AsciiDialog>
</section>
</div>
