<script lang="ts">
  import { onMount } from 'svelte';
  import { defaultAsciiPattern, type AsciiPattern } from './ascii-patterns';
  import { startAsciiFrames } from './ascii-frame-loop';
  let { cellWidth = 14, cellHeight = 18, speed = .35, color = '#c4ed83', opacity = .35, pattern = defaultAsciiPattern, paused = false, fps = 12 }: {
    cellWidth?: number; cellHeight?: number; speed?: number; fps?: number;
    color?: string; opacity?: number; pattern?: AsciiPattern; paused?: boolean;
  } = $props();
  let canvas: HTMLCanvasElement;
  let refresh = () => {};
  // Redraw the canvas when props change; refresh never writes reactive state.
  $effect(() => { cellWidth; cellHeight; speed; color; opacity; pattern; paused; fps; refresh(); });
  onMount(() => {
    const context = canvas.getContext('2d');
    if (!context) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, visible = false, phase = 0;
    let stopFrames = () => {};
    const finite = (v: number, fallback: number) => Number.isFinite(v) ? v : fallback;
    function paint() {
      const ctx = context!;
      ctx.clearRect(0, 0, width, height);
      const alpha = Math.max(0,Math.min(1,finite(opacity,.35)));
      if (!alpha || width <= 0 || height <= 0) return;
      const cw = Math.max(6, finite(cellWidth,14)), ch = Math.max(8,finite(cellHeight,18));
      const budgetScale = Math.max(1, Math.sqrt((width / cw) * (height / ch) / 20000));
      const dx = cw * budgetScale, dy = ch * budgetScale;
      const columns = Math.ceil(width / dx), rows = Math.ceil(height / dy);
      ctx.font = `${Math.min(dx * 1.3,dy * .8)}px monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = (col + .5) * dx, y = (row + .5) * dy;
          const cell = pattern({ x, y, column: col, row, width, height, columns, rows, cellWidth: dx, cellHeight: dy, time: phase });
          if (!cell || !cell.character || cell.character === ' ') continue;
          const cellAlpha = Math.max(0,Math.min(1,finite(cell.opacity ?? 1,1)));
          if (!cellAlpha) continue;
          ctx.globalAlpha = alpha * cellAlpha;
          ctx.fillText(cell.character, x, y);
        }
      }
      ctx.globalAlpha = 1;

    }
    function moving() { return visible && !document.hidden && !motion.matches && !paused && speed > 0 && finite(opacity,.35) > 0 && width > 0 && height > 0; }
    function sync() {
      stopFrames();
      if (!visible || document.hidden) return;
      paint();
      if (moving()) stopFrames = startAsciiFrames(elapsed => {
        if (!moving()) { stopFrames(); return; }
        phase += elapsed * Math.max(0,finite(speed,.35));
        paint();
      }, fps);
    }
    refresh = sync;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height;
      const ratio = Math.min(devicePixelRatio || 1,2);
      const pixelWidth = Math.max(1,Math.round(width * ratio)), pixelHeight = Math.max(1,Math.round(height * ratio));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      context.setTransform(ratio,0,0,ratio,0,0); sync();
    });
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    intersection.observe(canvas);
    document.addEventListener('visibilitychange',sync); motion.addEventListener('change',sync);
    return () => { refresh = () => {}; stopFrames(); resize.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange',sync); motion.removeEventListener('change',sync); };
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>
<style>
  canvas { display: block; width: 100%; height: 100%; pointer-events: none; }
</style>
