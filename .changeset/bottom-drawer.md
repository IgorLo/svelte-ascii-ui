---
"svelte-ascii-ui": minor
---

Drawer accepts `side="bottom"` for a full-width panel anchored to the available viewport. Short content keeps its natural height, long content scrolls beneath the header, and safe-area padding protects controls. The bottom panel follows visual viewport changes, keeps focused controls visible when its height changes, and locks background scrolling until the last bottom panel closes. Left and right placement and the default right side remain unchanged. The `size` prop continues to set left/right panel width; bottom panels always fill the viewport width.
