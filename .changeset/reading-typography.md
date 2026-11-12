---
"svelte-ascii-ui": minor
---

Add `size="inherit"` to inline Link and Badge, and document Theme text tokens for independently configuring body and Article size, weight and line height. Existing default sizes remain available; relative Article sizing also follows the browser root font size.
Nested Theme instances now honor their own body font size instead of inheriting the surrounding control-size rule.
