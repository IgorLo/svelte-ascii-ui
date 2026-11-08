export function formReset(input: HTMLInputElement, reset: () => void) {
  const form = input.form;
  if (!form) return;
  const handle = (event: Event) => {
    queueMicrotask(() => { if (!event.defaultPrevented) reset(); });
  };
  form.addEventListener('reset', handle);
  return () => form.removeEventListener('reset', handle);
}
