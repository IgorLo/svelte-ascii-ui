<script lang="ts">
  import { MusicPlayer, FileInput, type MusicTrack } from '../src/lib';
  import one from './assets/music-player-1.wav?url';
  import two from './assets/music-player-2.wav?url';
  import clickSound from './assets/music-player-press.wav?url';
  let { mode = 'multiple' }: { mode?: 'multiple' | 'files' } = $props();
  let files = $state<FileList>();
  const local = $derived(Array.from(files ?? [], (file, index): MusicTrack => ({ id: `${index}-${file.name}`, title: file.name, src: file })));
  const tracks = [{ id:'one',title:'Light in the window',src:one }, { id:'two',title:'Rain beyond the glass',src:two }];
</script>
<div class="examples">
  {#if mode === 'files'}
    <p>Choose audio files. The host supplies File objects; the player attaches only the selected source when playback is requested.</p>
    <FileInput aria-label="Audio files" accept="audio/*" multiple bind:files />
    <MusicPlayer tracks={local} {clickSound} />
  {:else}
    <p>Each player owns its audio, history and cassette. Starting one does not stop the other.</p>
    <MusicPlayer {tracks} {clickSound} labels={{ player:'First music player' }} />
    <MusicPlayer tracks={tracks.slice(0,1)} {clickSound} labels={{ player:'Second music player' }} />
  {/if}
</div>
<style>.examples{display:grid;gap:24px;max-width:720px}p{font-size:13px;line-height:1.8;margin:0}</style>
