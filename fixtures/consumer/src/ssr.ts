import { render } from 'svelte/server';
import App from './App.svelte';
export function verifySSR() {
  const result = render(App);
  for (const text of ['Installed cassette player', 'Open cassette', 'Установленный пакет', 'По прикольности', 'По дате', 'Источник', 'Нижняя шторка из установленного пакета.']) {
    if (!result.body.includes(text)) throw new Error(`SSR output missing: ${text}`);
  }
  if (result.body.includes('Choose an option')) throw new Error('Option-only Select rendered an empty placeholder during SSR');
  return { ok: true, bytes: result.body.length };
}
