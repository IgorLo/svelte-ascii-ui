<script lang="ts">
  let { size = 'm' }: { size?: 's' | 'm' | 'l' } = $props();
</script>
<span class="ascii-loader" data-size={size} aria-hidden="true">
  {#each ['|','/','-','\\'] as glyph, i (i)}<span style:animation-delay={`${i * -0.2}s`}>{glyph}</span>{/each}
</span>
<style>
  .ascii-loader { display: inline-grid; place-items: center; width: var(--icon-size,18px); height: var(--icon-size,18px); flex: 0 0 auto; vertical-align: middle; color: inherit; font: var(--icon-size,18px)/1 var(--art-font,monospace); font-variant-east-asian: normal; letter-spacing: 0; }
  .ascii-loader > span { grid-area: 1 / 1; visibility: hidden; }
  .ascii-loader > span:first-child { visibility: visible; }
  @media (prefers-reduced-motion: no-preference) { .ascii-loader > span { animation: rotor .8s steps(1,end) infinite; animation-play-state: var(--loader-play,running); } }
  @keyframes rotor { 0%,24.99% { visibility: visible; } 25%,100% { visibility: hidden; } }
</style>
