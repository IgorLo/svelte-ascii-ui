export interface FontCandidate {
  id: string;
  label: string;
  family: string;
  url: string;
  format: 'woff2' | 'truetype' | 'woff';
  /** Complete Russian alphabet U+0410–044F plus Ё/ё, verified from the font cmap. */
  cyrillic: boolean;
  notes: string;
  license: string;
  source: string;
  recommendedSize: number;
}

export const fontCandidates: readonly FontCandidate[] = [
  {
    id: "departure-mono",
    label: "Departure Mono",
    family: "Demo Departure Mono",
    url: new URL('./departure-mono/DepartureMono-1.500.woff2', import.meta.url).href,
    format: "woff2",
    cyrillic: true,
    notes: "Технический пиксельный моноширинный шрифт; автор рекомендует размеры, кратные 11 px.",
    license: "OFL-1.1",
    source: "https://github.com/rektdeckard/departure-mono/tree/75152a3f1e6dacdd248a6c397c97dbf27e33eea0",
    recommendedSize: 11,
  },
  {
    id: "monocraft",
    label: "Monocraft",
    family: "Demo Monocraft",
    url: new URL('./monocraft/Monocraft.ttf', import.meta.url).href,
    format: "truetype",
    cyrillic: true,
    notes: "Пиксельный моноширинный шрифт в духе Minecraft, с лигатурами для кода.",
    license: "OFL-1.1",
    source: "https://github.com/IdreesInc/Monocraft/tree/e498bf70aeb25b4bdcff1e44d878fb2cb4f7c2a9",
    recommendedSize: 16,
  },
  {
    id: "pixel-code",
    label: "Pixel Code",
    family: "Demo Pixel Code",
    url: new URL('./pixel-code/PixelCode.woff2', import.meta.url).href,
    format: "woff2",
    cyrillic: true,
    notes: "Пиксельный моноширинный шрифт для кода с плотными, открытыми формами букв.",
    license: "OFL-1.1",
    source: "https://github.com/qwerasd205/PixelCode/tree/eefe4180f376b5bd9a9d3c39f1fca6956fdbb702",
    recommendedSize: 16,
  },
];
