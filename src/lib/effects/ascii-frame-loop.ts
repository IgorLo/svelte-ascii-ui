export interface FrameClock {
  now(): number;
  delay(callback: () => void, ms: number): number;
  cancelDelay(id: number): void;
  frame(callback: (now: number) => void): number;
  cancelFrame(id: number): void;
}

/** Sleep between draws, then align drawing to the browser's next animation frame. */
export function startAsciiFrames(draw: (elapsed: number) => void, fps: number, clock: FrameClock = {
  now: () => performance.now(),
  delay: (callback, ms) => window.setTimeout(callback, ms),
  cancelDelay: id => window.clearTimeout(id),
  frame: callback => requestAnimationFrame(callback),
  cancelFrame: id => cancelAnimationFrame(id),
}): () => void {
  const interval = 1000 / Math.max(1, Math.min(60, Number.isFinite(fps) ? fps : 12));
  let stopped = false, timer = 0, frame = 0;
  let previous = clock.now(), deadline = previous + interval;
  function schedule() {
    timer = clock.delay(() => {
      timer = 0;
      if (stopped) return;
      frame = clock.frame(now => {
        frame = 0;
        if (stopped) return;
        const elapsed = Math.max(0, (now - previous) / 1000);
        previous = now;
        draw(elapsed);
        // Keep cadence without replaying missed frames after a busy main thread.
        deadline = Math.max(deadline + interval, now + 1);
        if (!stopped) schedule();
      });
    }, Math.max(0, deadline - clock.now()));
  }
  schedule();
  return () => { stopped = true; clock.cancelDelay(timer); clock.cancelFrame(frame); };
}
