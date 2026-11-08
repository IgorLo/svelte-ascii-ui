export type Origin = DOMRect | { left: number; top: number; bottom: number };

export function positionFloating(node: HTMLElement, origin: Origin, gap = 6) {
  const view = node.ownerDocument.defaultView;
  if (!view) return;
  const { clientWidth, clientHeight } = node.ownerDocument.documentElement;
  const { width, height } = node.getBoundingClientRect();
  const above = origin.top - height - gap;
  const below = origin.bottom + gap;
  const y = below + height > clientHeight - 8 && above >= 8 ? above : below;
  node.style.left = Math.max(8, Math.min(origin.left, clientWidth - width - 8)) + 'px';
  node.style.top = Math.max(8, Math.min(y, clientHeight - height - 8)) + 'px';
}

export function showFloating(node: HTMLElement) {
  if (typeof node.showPopover === 'function' && !node.matches(':popover-open')) node.showPopover();
}
