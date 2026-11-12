---
"svelte-ascii-ui": patch
---

Slider and Range keep numeric tick labels whole and centered when host text may wrap anywhere. Long custom text labels wrap within the scale and reserve their height instead of overflowing or clipping. Their selected rail includes the terminal tail and endcap when the selected interval reaches the minimum or maximum, and retains its color without muted traces at fractional display scales.
