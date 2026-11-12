<script lang="ts">
  import { Theme, Article, Link, Badge, Input } from '../src/lib';
</script>

<Theme palette="paper">
  <p>Default body</p>
  <Article><p>Default article</p><Link href="#default">Default source</Link></Article>
</Theme>
<Theme palette="paper" style="--font-size:1.125rem;--text-weight:400;--article-font-size:1.09375rem;--article-line-height:1.6">
  <section aria-label="Reading card" class="card">
    <p>Readable body</p>
    <Article>
      <h2>Длинная справка о материалах</h2>
      <p>Читаемая справка помогает сравнить материалы, проверить источники и выбрать подходящий вариант без постоянного увеличения страницы.</p>
      <p><Link href="#source" size="inherit">Источник данных</Link> <span>Дата источника</span></p>
      <p><Badge label="Данные проверены" size="inherit" tone="success" /></p>
      <p><Link href="#compact" size="m">Compact source</Link></p>
      <p>Оченьдлинныйнеразрывныйидентификатористочникаматериаловкоторыйнедолженвызыватьгоризонтальнуюпрокрутку</p>
    </Article>
    <Input aria-label="Compact control" size="s" />
  </section>
  <Theme style="--font-size:1.125rem;--text-weight:400"><p>Nested body</p><Article><p>Nested article</p></Article></Theme>
</Theme>

<style>.card { min-width: 0; padding: 16px; background: var(--bg); }</style>
