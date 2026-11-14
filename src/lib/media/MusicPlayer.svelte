<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import IconButton from '../IconButton.svelte';
  import Button from '../Button.svelte';
  import Slider from '../forms/Slider.svelte';
  import MusicPlayerIcon from './MusicPlayerIcon.svelte';
  import { mediaLevel, musicPlayerLabels, type MusicPlayerProps, type MusicTrack } from './music-player';

  let { tracks = [], shuffle = $bindable(false), volume = $bindable(.4), clickSound,
    clickVolume = 1 / 3, labels = {}, class: className, ...rest }: MusicPlayerProps = $props();
  const text = $derived({ ...musicPlayerLabels, ...labels });
  const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)', false);
  const dialogId = $props.id();
  let audio: HTMLAudioElement;
  let feedbackAudio: HTMLAudioElement;
  let dialog: HTMLDialogElement;
  let open = $state(false);
  let currentId = $state<string>();
  const track = $derived(tracks.find(item => item.id === currentId) ?? tracks[0]);
  const title = $derived(track ? [track.artist, track.title || text.untitled].filter(Boolean).join(' — ') : text.empty);
  const shuffleActive = $derived(shuffle && tracks.length > 1);
  let paused = $state(true);
  let loading = $state(false);
  let muted = $state(false);
  let currentTime = $state(0);
  let duration = $state(NaN);
  let error = $state('');
  let motionPaused = $state(false);
  const moving = $derived(!paused && !motionPaused && !reducedMotion.current);
  const percent = $derived(Number.isFinite(duration) && duration > 0 ? mediaLevel(currentTime / duration) * 100 : 0);
  let history = $state<string[]>([]);
  let future: string[] = [];
  let bag: string[] = [];
  let firstBag = true;
  let loaded: { id: string; source: string | Blob; url: string } | undefined;
  let ownedUrl: string | undefined;
  let feedbackUrl = $state<string>();
  let wantsPlayback = $state(false);
  let request = 0;
  let startingPlayback = false;
  let disposed = false;
  let backdropPressed = false;

  function time(seconds: number) {
    return Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}` : '—:—';
  }
  function releaseSource() {
    if (ownedUrl) URL.revokeObjectURL(ownedUrl);
    ownedUrl = undefined;
    loaded = undefined;
  }
  function load(item: MusicTrack) {
    if (loaded?.id === item.id && loaded.source === item.src && !audio.error) return;
    audio.pause();
    audio.removeAttribute('src');
    releaseSource();
    const url = typeof item.src === 'string' ? item.src : (ownedUrl = URL.createObjectURL(item.src));
    loaded = { id: item.id, source: item.src, url };
    audio.src = url;
    audio.load();
  }
  function pause() {
    wantsPlayback = false;
    startingPlayback = false;
    request++;
    loading = false;
    audio.pause();
    paused = true;
  }
  async function play(item = track) {
    if (!item || disposed) return;
    const version = ++request;
    currentId = item.id;
    wantsPlayback = true;
    startingPlayback = true;
    loading = true;
    error = '';
    try {
      load(item);
      await audio.play();
      if (version !== request && !wantsPlayback) audio.pause();
    } catch (failure) {
      if (version === request && !disposed && wantsPlayback) {
        // A browser/media-control pause aborts play() without being a source error.
        error = failure instanceof DOMException && failure.name === 'AbortError' ? '' : text.error;
        wantsPlayback = false;
      }
    } finally {
      if (version === request && !disposed) { startingPlayback = false; loading = false; }
    }
  }
  function nativePause() {
    // Source transitions pause internally; stale pause events must not cancel a new play().
    if (audio.paused && !audio.ended && wantsPlayback && !startingPlayback) pause();
  }
  function toggle() { if (wantsPlayback || !paused) pause(); else void play(); }
  function choose(item: MusicTrack) {
    const resume = wantsPlayback;
    startingPlayback = false;
    request++;
    audio.pause();
    currentId = item.id;
    currentTime = 0;
    duration = loaded?.id === item.id && loaded.source === item.src ? audio.duration : NaN;
    error = '';
    loading = false;
    if (loaded) {
      try { load(item); audio.currentTime = 0; }
      catch { error = text.error; wantsPlayback = false; }
    }
    if (resume && !error) void play(item);
  }
  function shuffled(ids: string[]) {
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    if (ids.length > 1 && ids[0] === track?.id) [ids[0], ids[1]] = [ids[1], ids[0]];
    return ids;
  }
  function next() {
    if (!track) return;
    let id: string;
    if (future.length) id = future.pop()!;
    else if (shuffleActive) {
      if (!bag.length) {
        bag = shuffled(tracks.map(item => item.id).filter(id => !firstBag || id !== track.id));
        firstBag = false;
      }
      id = bag.shift() ?? track.id;
    } else id = tracks[(tracks.findIndex(item => item.id === track.id) + 1) % tracks.length].id;
    const destination = tracks.find(item => item.id === id);
    if (!destination) return;
    if (id !== track.id) history = [...history, track.id];
    choose(destination);
  }
  function previous() {
    const id = history.at(-1);
    const destination = tracks.find(item => item.id === id);
    if (!destination) return;
    if (track) future.push(track.id);
    history = history.slice(0, -1);
    choose(destination);
  }
  function failed() {
    if (disposed || !loaded || track?.id !== loaded.id) return;
    if (audio.currentSrc && audio.currentSrc !== new URL(loaded.url, document.baseURI).href) return;
    error = text.error;
    pause();
  }
  function seek(event: Event) {
    if (Number.isFinite(duration)) audio.currentTime = Number((event.target as HTMLInputElement).value) / 100 * duration;
  }

  $effect(() => {
    // Reconcile host updates by identity; metadata-only updates do not restart audio.
    const sources = tracks.map(item => ({ id: item.id, src: item.src }));
    const selected = track;
    untrack(() => {
      const ids = new Set(sources.map(item => item.id));
      history = history.filter(id => ids.has(id));
      future = future.filter(id => ids.has(id));
      bag = bag.filter(id => ids.has(id) && id !== selected?.id);
      if (currentId !== undefined && !ids.has(currentId)) currentId = selected?.id;
      if (!selected) {
        pause(); audio.removeAttribute('src'); audio.load(); releaseSource();
        currentTime = 0; duration = NaN; error = '';
      } else if (loaded && (loaded.id !== selected.id || loaded.source !== selected.src)) choose(selected);
    });
  });
  $effect(() => {
    void shuffle;
    untrack(() => { bag = []; firstBag = true; future = []; });
  });
  $effect(() => { audio.volume = mediaLevel(volume); });
  $effect(() => {
    const source = clickSound;
    if (!source) { feedbackUrl = undefined; return; }
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    feedbackUrl = url;
    return () => { if (typeof source !== 'string') URL.revokeObjectURL(url); };
  });
  function feedback(root: HTMLElement) {
    function clicked(event: MouseEvent) {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (!clickSound || !button || button.disabled || button.hasAttribute('data-music-silent')) return;
      feedbackAudio.volume = mediaLevel(clickVolume);
      feedbackAudio.currentTime = 0;
      void feedbackAudio.play().catch(() => {});
    }
    root.addEventListener('click', clicked);
    return () => root.removeEventListener('click', clicked);
  }

  $effect(() => {
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });
  $effect(() => {
    if (!open) return;
    function reveal() {
      const active = document.activeElement;
      if (active instanceof HTMLElement && dialog.contains(active)) active.scrollIntoView({ block: 'nearest' });
    }
    let frame = requestAnimationFrame(reveal);
    const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(reveal); });
    observer.observe(dialog);
    const viewport = window.visualViewport;
    function position() {
      if (viewport && viewport.scale === 1) {
        dialog.style.setProperty('--music-viewport-height', `${viewport.height}px`);
        dialog.style.setProperty('--music-viewport-bottom', `${Math.max(0, innerHeight - viewport.height - viewport.offsetTop)}px`);
      } else {
        dialog.style.removeProperty('--music-viewport-height'); dialog.style.removeProperty('--music-viewport-bottom');
      }
    }
    position();
    viewport?.addEventListener('resize', position);
    viewport?.addEventListener('scroll', position);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); viewport?.removeEventListener('resize', position); viewport?.removeEventListener('scroll', position); };
  });
  function outside(event: MouseEvent | PointerEvent) {
    const box = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < box.left || event.clientX >= box.right || event.clientY < box.top || event.clientY >= box.bottom);
  }
  function keepFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.defaultPrevented) return;
    const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),[tabindex="0"]')].filter(node => node.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  onDestroy(() => {
    disposed = true; request++; wantsPlayback = false;
    audio?.pause(); audio?.removeAttribute('src'); audio?.load();
    feedbackAudio?.pause();
    releaseSource();
  });
</script>

{#snippet ticker()}
  <span class={['ticker', { moving, stationary: motionPaused || reducedMotion.current }]} title={title}>
    <span class="ticker-run"><span>{title}</span><span aria-hidden="true">{title}</span></span>
  </span>
{/snippet}
{#snippet playControl(large = false)}
  <IconButton size={large ? 'l' : 's'} variant="primary" label={wantsPlayback || !paused ? text.pause : text.play} disabled={!track} aria-busy={loading || undefined} onclick={toggle}><MusicPlayerIcon name={wantsPlayback || !paused ? 'pause' : 'play'} /></IconButton>
{/snippet}
{#snippet failure()}
  {#if error}<p role="alert" class="error">{error} <Button size="s" onclick={() => void play()}>{text.retry}</Button></p>{/if}
{/snippet}

<section {...rest} class={['music-player', className]} aria-label={rest['aria-label'] ?? text.player} {@attach feedback}>
  <audio bind:this={audio} preload="none" bind:paused bind:currentTime bind:duration bind:muted onended={next} onpause={nativePause} onerror={failed} onwaiting={() => { if (wantsPlayback) loading = true; }} onplaying={() => loading = false}></audio>
  <audio bind:this={feedbackAudio} src={feedbackUrl} preload={clickSound ? 'auto' : 'none'}></audio>
  <div class="compact-player">
    {@render playControl()}
    <div class="compact-copy">{@render ticker()}<div class="mini-progress" role="progressbar" aria-label={text.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number.isFinite(duration) ? Math.round(percent) : undefined}><span style:width={`${percent}%`}></span></div></div>
    <IconButton size="s" label={text.open} title={text.open} aria-haspopup="dialog" aria-expanded={open} aria-controls={dialogId} onclick={() => open = true}><MusicPlayerIcon name="cassette" /></IconButton>
  </div>
  {#if !open}{@render failure()}{/if}
  {#if !open}<span class="aui-sr-only" role="status">{title}</span>{/if}
  <dialog bind:this={dialog} id={dialogId} class="aui-music-dialog" aria-label={text.player} onclose={() => { if (!dialog.open) open = false; }} onkeydown={keepFocus} onpointerdown={event => backdropPressed = outside(event)} onclick={event => { if (backdropPressed && outside(event)) open = false; backdropPressed = false; }}>
    <div class="cassette">
      <div class="cassette-top"><span>{text.side}</span><IconButton size="s" label={text.close} autofocus onclick={() => open = false} /></div>
      <div class="cassette-label">{@render ticker()}<span class="subtle">{String(track ? tracks.indexOf(track) + 1 : 0).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}</span></div>
      <button type="button" class="reels-control" aria-label={motionPaused || reducedMotion.current ? text.resumeMotion : text.pauseMotion} title={motionPaused || reducedMotion.current ? text.resumeMotion : text.pauseMotion} aria-pressed={motionPaused || reducedMotion.current} disabled={reducedMotion.current} onclick={() => motionPaused = !motionPaused}>
      <svg class={['reels', { spinning: moving }]} viewBox="0 0 300 92" fill="none" aria-hidden="true">
        <path class="tape-path" d="M52 58V74H248V58M79 42H221" />
        {#each [56,244] as x (x)}<g transform={`translate(${x},42)`}><circle r="28" class="reel-ring"/><g class="reel"><circle r="9"/><path d="M0-22v9M0 13v9M-22 0h9M13 0h9M-16-16l7 7M9 9l7 7M-16 16l7-7M9-9l7-7"/></g></g>{/each}
        <path class="window-line" d="M105 28h90v27h-90zM116 36v11M125 36v11M134 36v11M143 36v11M152 36v11M161 36v11M170 36v11M179 36v11M188 36v11"/>
      </svg>
      </button>
      <div class="progress-row"><span>{time(currentTime)}</span><div class="progress-rail"><Slider size="s" aria-label={text.seek} value={percent} disabled={!Number.isFinite(duration)} oninput={seek} /></div><span>{time(duration)}</span></div>
      <div class="cassette-controls">
        <IconButton size="s" label={shuffleActive ? text.shuffleOff : text.shuffleOn} aria-pressed={shuffleActive} disabled={tracks.length <= 1} variant={shuffleActive ? 'primary' : 'default'} onclick={() => shuffle = !shuffle}><MusicPlayerIcon name="shuffle" /></IconButton>
        <div class="transport"><IconButton size="m" label={text.previous} disabled={!history.length} onclick={previous}><MusicPlayerIcon name="previous" /></IconButton>{@render playControl(true)}<IconButton size="m" label={text.next} disabled={tracks.length <= 1} onclick={next}><MusicPlayerIcon name="next" /></IconButton></div>
        <IconButton size="s" label={muted ? text.unmute : text.mute} aria-pressed={muted} data-music-silent onclick={() => muted = !muted}><MusicPlayerIcon name={muted ? 'mute' : 'sound'} /></IconButton>
      </div>
      <div class="cassette-volume"><span>{text.quiet}</span><Slider size="s" aria-label={text.volume} value={Math.round(mediaLevel(volume) * 100)} oninput={event => volume = event.currentTarget.valueAsNumber / 100} /><span>{text.loud}</span></div>
      {#if open}<span class="aui-sr-only" role="status">{title}</span>{@render failure()}{/if}
    </div>
  </dialog>
</section>

<style>
  .music-player { --player-line:color-mix(in srgb,var(--muted) 38%,transparent);min-width:0;font-size:var(--component-font); }
  .compact-player { width:480px;max-width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px; }
  .compact-copy { min-width:0; }
  .ticker { display:block;min-width:0;overflow:hidden;white-space:nowrap;line-height:1.7; }
  .ticker-run { display:flex;width:max-content;gap:52px; }
  .ticker-run>span { flex:none; }
  .ticker-run>span+span { display:none; }
  .moving .ticker-run { animation:marquee 19s linear infinite; }
  .moving .ticker-run>span+span { display:block; }
  .ticker:hover .ticker-run { animation-play-state:paused; }
  .stationary { white-space:normal;overflow-wrap:anywhere; }
  .stationary .ticker-run { width:100%;animation:none; }
  .stationary .ticker-run>span { flex:0 1 auto;min-width:0;max-width:100%;white-space:normal;overflow-wrap:anywhere; }
  .stationary .ticker-run>span+span { display:none; }
  @keyframes marquee { 0%,15% {transform:translateX(0)} 90%,100% {transform:translateX(calc(-50% - 26px))} }
  .compact-copy .ticker { font-size:12px;line-height:1.6; }
  .mini-progress { height:2px;margin-top:5px;overflow:hidden;background:color-mix(in srgb,var(--muted) 25%,transparent); }
  .mini-progress>span { display:block;height:100%;background:var(--accent); }
  .aui-music-dialog { width:430px;max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);margin:auto;padding:0;border:0;overflow:auto;overscroll-behavior:contain;background:transparent;color:var(--text);font-family:var(--text-font);font-size:var(--component-font);font-weight:var(--text-weight);line-height:1.6;scrollbar-color:var(--muted) var(--bg); }
  .aui-music-dialog::backdrop { background:rgb(0 0 0 / .58); }
  :global(html:has(dialog.aui-music-dialog:modal)) { overflow:hidden; }
  .cassette { box-sizing:border-box;width:100%;max-width:100%;border:9px solid transparent;border-image:var(--ascii-frame) 12 / 9px space;padding:14px 22px 8px;background:color-mix(in srgb,var(--accent) 6%,var(--bg));background-clip:padding-box; }
  .cassette-top { display:flex;align-items:center; }
  .cassette-top { justify-content:space-between;gap:12px;font-size:9px;color:var(--muted);padding-bottom:6px; }
  .cassette-label { text-align:center;padding:10px 6px 6px;border-block:1px dashed var(--player-line); }
  .cassette-label .ticker { font-size:13px; }
  .subtle { display:block;color:var(--muted);font-size:9px;margin-top:3px; }
  .reels-control { display:block;appearance:none;width:300px;max-width:100%;height:92px;margin:4px auto 0;padding:0;border:0;background:transparent;color:var(--accent);cursor:pointer; }
  .reels-control:disabled { cursor:default; }
  .reels-control:focus-visible { outline:2px dashed var(--accent);outline-offset:2px; }
  .reels { display:block;max-width:100%;width:100%;height:92px;margin:0;color:var(--accent);stroke:currentColor;stroke-width:2; }
  .tape-path,.window-line { opacity:.4;stroke-width:1; }
  .reel-ring { opacity:.6;stroke-dasharray:3 4; }
  .reel { transform-box:fill-box;transform-origin:center; }
  .spinning .reel { animation:spin 7s linear infinite; }
  @keyframes spin { to {transform:rotate(360deg)} }
  .progress-row { display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted); }
  .progress-rail { flex:1;min-width:0; }
  .cassette-controls { display:flex;align-items:center;justify-content:space-between;gap:10px; }
  .transport { display:flex;align-items:center;gap:10px;flex-shrink:0; }
  .cassette-volume { display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:6px;font-size:9px;color:var(--muted);margin-top:6px; }
  .error { color:var(--danger);font-size:12px;line-height:1.6; }
  @media(max-width:700px) { .compact-player {gap:10px}.compact-copy .ticker{font-size:11px}.cassette{padding:10px 12px 6px}.cassette-top{font-size:8px}.transport{gap:6px} }
  @media(max-width:600px) { .aui-music-dialog{position:fixed;inset:auto 0 var(--music-viewport-bottom,0);width:min(430px,100vw);max-width:100vw;max-height:var(--music-viewport-height,100dvh);margin:0 auto}.cassette{padding-bottom:max(6px,env(safe-area-inset-bottom));padding-right:max(12px,env(safe-area-inset-right));padding-left:max(12px,env(safe-area-inset-left))} }
  @media(prefers-reduced-motion:reduce) { .moving .ticker-run,.spinning .reel{animation:none}.ticker-run>span+span{display:none !important}.ticker{white-space:normal;overflow-wrap:anywhere}.ticker-run{width:auto} }
  @media(forced-colors:active) { .reels-control:focus-visible{outline-color:Highlight}.aui-music-dialog{background:Canvas}.cassette{border-image:none;border:1px solid CanvasText;background:Canvas}.mini-progress{background:CanvasText}.mini-progress>span{background:Highlight} }
</style>
