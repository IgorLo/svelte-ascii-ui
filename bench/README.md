# Development benchmarks

Run `npm run dev` and open `/bench/ascii.html` to compare Canvas, cached glyphs and DOM rendering. The harness runs warm-up frames followed by measured frames; results depend on the browser, hardware and surface size.

The comparison runs at animation-frame cadence to expose relative rendering costs. The production Background component uses its configurable FPS limit. JavaScript timings do not represent total CPU, GPU completion or battery use.

The frame-loop and sine-pattern tests in this directory are run by `npm test`. Benchmark pages and test sources are development tools and are not included in the npm package.
