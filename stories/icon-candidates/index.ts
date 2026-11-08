// Comparison assets only; no public library export or runtime dependency.
export const iconCandidates = [
  {
    id: 'pixelarticons',
    label: 'Pixelarticons',
    license: 'MIT · Gerrit Halfmann',
    source: 'https://github.com/halfmage/pixelarticons/tree/c9ecc2da61afde85dbe539025e3d931c6152ad75',
    nativeSize: 24,
    icons: {
      plus: new URL('./pixelarticons/plus.svg', import.meta.url).href,
      minus: new URL('./pixelarticons/minus.svg', import.meta.url).href,
      down: new URL('./pixelarticons/chevron-down.svg', import.meta.url).href,
      close: new URL('./pixelarticons/close.svg', import.meta.url).href,
      refresh: new URL('./pixelarticons/refresh.svg', import.meta.url).href,
      info: new URL('./pixelarticons/info-box.svg', import.meta.url).href,
    },
  },
  {
    id: 'teenyicons',
    label: 'Teenyicons (minimal outline)',
    license: 'MIT · Anja van Staden',
    source: 'https://github.com/smhmd/teenyicons/tree/32620e2449b66b03a41c862f437cc184698bc041',
    nativeSize: 15,
    icons: {
      plus: new URL('./teenyicons/add.svg', import.meta.url).href,
      minus: new URL('./teenyicons/minus.svg', import.meta.url).href,
      down: new URL('./teenyicons/down.svg', import.meta.url).href,
      close: new URL('./teenyicons/x.svg', import.meta.url).href,
      refresh: new URL('./teenyicons/refresh.svg', import.meta.url).href,
      info: new URL('./teenyicons/info.svg', import.meta.url).href,
    },
  },
] as const;

export type IconCandidateName = keyof (typeof iconCandidates)[number]['icons'];
