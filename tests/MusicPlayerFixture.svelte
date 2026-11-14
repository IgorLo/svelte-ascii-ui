<script lang="ts">
  import { MusicPlayer, Theme } from '../src/lib';
  import type { MusicPlayerProps } from '../src/lib';
  let props: MusicPlayerProps = $props();
</script>
<Theme><MusicPlayer {...props} /></Theme>
