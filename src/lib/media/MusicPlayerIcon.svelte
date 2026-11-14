<script lang="ts">
  let { name }: { name: 'play' | 'pause' | 'previous' | 'next' | 'shuffle' | 'cassette' | 'sound' | 'mute' } = $props();
</script>
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {#if name === 'play'}<path d="M7 4h2v2h3v2h3v2h3v4h-3v2h-3v2H9v2H7z" />
    {:else if name === 'pause'}<path d="M6 4h4v16H6zm8 0h4v16h-4z" />
    {:else if name === 'next'}<path d="M4 5h2v2h3v2h3v2h3v2h-3v2H9v2H6v2H4zm13 0h3v14h-3z" />
    {:else if name === 'previous'}<path d="M20 5h-2v2h-3v2h-3v2H9v2h3v2h3v2h3v2h2zM4 5h3v14H4z" />
    {:else if name === 'shuffle'}<path d="M3 5h4v2H3zm4 2h3v2H7zm3 2h3v6h-3zm3 6h3v2h-3zm3 2h3v-2h2v6h-6v-2h4v-2zM3 17h4v2H3zm4-2h3v2H7zm6-8h3v2h-3zm3-2h3V3h2v6h-2V7h-3z" />
    {:else if name === 'cassette'}<path fill-rule="evenodd" d="M2 4h20v16H2zm2 2v12h16V6zM7 14h10v2H7z"/><circle cx="8" cy="10" r="2"/><circle cx="16" cy="10" r="2"/>
    {:else if name === 'sound'}<path d="M3 9h4V7h2V5h3v14H9v-2H7v-2H3zm12-2h2v10h-2zm4-2h2v14h-2z" />
    {:else}<path d="M3 9h4V7h2V5h3v14H9v-2H7v-2H3zm12 0h2v2h2V9h2v2h-2v2h2v2h-2v-2h-2v2h-2v-2h2v-2h-2z" />{/if}
  </svg>
